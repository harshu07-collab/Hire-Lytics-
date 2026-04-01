import logging
import os
import re
import time
import uuid
import io
import json
import base64
from pathlib import Path
from datetime import datetime, timezone

import pdfplumber
import requests
from fpdf import FPDF
from fastapi import FastAPI, APIRouter, UploadFile, File, Response, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv

# Load .env from one level above backend/
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

# Local modules
from text_cleaner import advanced_clean_text
from groq_service import get_ats_score, get_job_suggestion
from job_open import jobs as fetch_jobs
from supabase_service import get_user_by_id
from auth import verify_token

# global cleaned text — gets updated on every /analyze call
cleaned_text = ""
CACHE_DIR = Path(__file__).resolve().parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)
CLEANED_TEXT_PATH = CACHE_DIR / "cleaned_text.txt"

# ============================================================
# RESUME TEMPLATE DATA
# ============================================================

TEMPLATES_PATH = Path(__file__).resolve().parent / "templates.json"
TEMPLATES_SOURCE_URL = os.getenv("TEMPLATES_SOURCE_URL", "").strip()
TEMPLATES_API_TOKEN = os.getenv("TEMPLATES_API_TOKEN", "").strip()
TEMPLATES_REFRESH_SECONDS = int(os.getenv("TEMPLATES_REFRESH_SECONDS", "300"))
TEMPLATES_PROVIDER = os.getenv("TEMPLATES_PROVIDER", "auto").strip().lower()
JSONRESUME_THEME_LIST_URL = os.getenv("JSONRESUME_THEME_LIST_URL", "https://docs.jsonresume.org/themes").strip()
JSONRESUME_PREVIEW_BASE = os.getenv("JSONRESUME_PREVIEW_BASE", "https://registry.jsonresume.org").strip()
JSONRESUME_PREVIEW_USERNAME = os.getenv("JSONRESUME_PREVIEW_USERNAME", "thomasdavis").strip()
JSONRESUME_MAX_TEMPLATES = int(os.getenv("JSONRESUME_MAX_TEMPLATES", "24"))
JSONRESUME_VALIDATE_TEMPLATES = os.getenv("JSONRESUME_VALIDATE_TEMPLATES", "true").strip().lower() == "true"
# Upstream has removed many legacy themes (often returns JSON TEMPLATE_MISSING). Never surface these.
JSONRESUME_DEPRECATED_THEMES = frozenset(
    theme.strip().lower()
    for theme in os.getenv(
        "JSONRESUME_DEPRECATED_THEMES",
        "standard,standard-resume,stackoverflow,github2",
    ).split(",")
    if theme.strip()
)
TEMPLATES_CACHE: Dict[str, Any] = {
    "data": [],
    "source": "local",
    "updated_at": None,
    "fetched_at": 0.0
}


def _slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return cleaned or "template"


def _normalize_templates(raw: Any) -> List[Dict[str, Any]]:
    if isinstance(raw, dict):
        raw = raw.get("templates", [])
    if not isinstance(raw, list):
        return []

    normalized: List[Dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name") or item.get("title") or "Untitled Template")
        template_id = item.get("id") or item.get("slug") or f"tmpl-{_slugify(name)}"
        normalized.append({
            "id": str(template_id),
            "name": name,
            "category": str(item.get("category") or "General"),
            "description": str(item.get("description") or ""),
            "accent": str(item.get("accent") or "emerald"),
            "preview_url": item.get("preview_url") or item.get("previewUrl") or "",
            "download_url": item.get("download_url") or item.get("downloadUrl") or "",
            "preview_type": item.get("preview_type") or item.get("previewType") or "",
            "updated_at": item.get("updated_at") or item.get("updatedAt")
        })
    return normalized


def _load_local_templates() -> List[Dict[str, Any]]:
    if not TEMPLATES_PATH.exists():
        return []
    try:
        raw = json.loads(TEMPLATES_PATH.read_text(encoding="utf-8"))
        return _normalize_templates(raw)
    except Exception as exc:
        logger.error(f"Failed to read local templates: {str(exc)}")
        return []


def _fetch_remote_templates() -> Optional[List[Dict[str, Any]]]:
    if not TEMPLATES_SOURCE_URL:
        return None

    headers: Dict[str, str] = {}
    if TEMPLATES_API_TOKEN:
        headers["Authorization"] = f"Bearer {TEMPLATES_API_TOKEN}"

    try:
        response = requests.get(TEMPLATES_SOURCE_URL, headers=headers, timeout=10)
        response.raise_for_status()
        raw = response.json()
        templates = _normalize_templates(raw)
        return templates if templates else None
    except Exception as exc:
        logger.error(f"Failed to fetch remote templates: {str(exc)}")
        return None


def _default_jsonresume_theme_names() -> List[str]:
    """Bundled list used when docs.jsonresume.org theme list is unreachable.

    Excludes themes known to be disabled upstream; each entry is still checked with
    `_jsonresume_theme_preview_works` before being shown.
    """
    return [
        "professional", "elegant", "flat", "spartacus", "spartan",
        "paper", "kendall", "tan-responsive", "rocketspacer", "macchiato",
        "github", "actual", "even", "relaxed",
    ]


def _extract_jsonresume_themes(html: str) -> List[str]:
    marker_index = html.find("Complete Theme List")
    if marker_index == -1:
        return []

    snippet = html[marker_index:marker_index + 4000]
    themes = re.findall(r"`([^`]+)`", snippet)
    valid = [theme for theme in themes if re.fullmatch(r"[a-z0-9-]+", theme)]
    return valid


def _categorize_jsonresume_theme(theme: str) -> str:
    professional = {"standard", "standard-resume", "professional", "github", "github2", "stackoverflow", "techlead", "msresume"}
    modern = {"spartan", "spartacus", "rocketspacer", "tan-responsive", "flat", "kards", "kendall", "orbit", "one", "onepage", "onepage-plus", "onepageresume"}
    minimal = {"elegant", "paper", "paper-plus-plus", "papirus", "minyma", "simple-red", "relaxed", "even"}
    creative = {"autumn", "pumpkin", "cora", "jacrys", "lucide", "mantra", "macchiato", "mocha-responsive", "rickosborne"}
    classic = {"cv", "full", "ace", "actual", "el-santo"}

    if theme in professional:
        return "Professional"
    if theme in minimal:
        return "Minimal"
    if theme in creative:
        return "Creative"
    if theme in classic:
        return "Classic"
    if theme in modern:
        return "Modern"
    return "Modern"


def _jsonresume_theme_preview_works(theme: str) -> bool:
    """True if registry serves a real HTML preview for this theme (not 400/JSON error)."""
    if not JSONRESUME_VALIDATE_TEMPLATES:
        return True

    url = f"{JSONRESUME_PREVIEW_BASE}/{JSONRESUME_PREVIEW_USERNAME}?theme={theme}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return False

        content_type = response.headers.get("content-type", "").lower()
        body = (response.text or "")[:16384]

        if "TEMPLATE_MISSING" in body:
            return False
        try:
            if body.strip().startswith("{"):
                payload = json.loads(body)
                err = payload.get("error") if isinstance(payload, dict) else None
                if isinstance(err, dict) and err.get("code") == "TEMPLATE_MISSING":
                    return False
        except json.JSONDecodeError:
            pass

        # Error payloads are usually JSON even when status is 200 in edge cases
        if "application/json" in content_type and '"error"' in body:
            return False

        if "text/html" not in content_type and "application/xhtml" not in content_type:
            return False

        x_frame = response.headers.get("x-frame-options", "").lower()
        csp = response.headers.get("content-security-policy", "").lower()
        blocked_by_frame = bool(x_frame) and x_frame not in {"allowall", "allow-from *"}
        blocked_by_csp = "frame-ancestors" in csp and ("'none'" in csp or "none" in csp)
        if blocked_by_frame or blocked_by_csp:
            return False

        return True
    except Exception:
        return False


def _fetch_jsonresume_templates() -> Optional[List[Dict[str, Any]]]:
    try:
        response = requests.get(JSONRESUME_THEME_LIST_URL, timeout=10)
        response.raise_for_status()
        theme_names = _extract_jsonresume_themes(response.text)
        if not theme_names:
            raise ValueError("No JSON Resume themes found in docs")
    except Exception as exc:
        resp = getattr(exc, "response", None)
        status = getattr(resp, "status_code", None)
        if status is not None and 500 <= status < 600:
            logger.warning(
                "JSON Resume theme list returned HTTP %s (upstream). Using bundled theme list.",
                status,
            )
        else:
            logger.warning(
                "Could not load JSON Resume theme list from %s (%s). Using bundled theme list.",
                JSONRESUME_THEME_LIST_URL,
                exc,
            )
        theme_names = _default_jsonresume_theme_names()

    theme_names = [
        t for t in theme_names
        if t.lower() not in JSONRESUME_DEPRECATED_THEMES
    ]

    accents = ["emerald", "blue", "teal", "cyan", "rose", "amber", "stone", "indigo"]
    templates: List[Dict[str, Any]] = []
    for index, theme in enumerate(theme_names):
        if len(templates) >= JSONRESUME_MAX_TEMPLATES:
            break
        if not _jsonresume_theme_preview_works(theme):
            continue
        templates.append({
            "id": f"jsonresume-{theme}",
            "name": theme.replace("-", " ").title(),
            "category": _categorize_jsonresume_theme(theme),
            "description": f"JSON Resume theme: {theme}",
            "accent": accents[len(templates) % len(accents)],
            "preview_url": f"{JSONRESUME_PREVIEW_BASE}/{JSONRESUME_PREVIEW_USERNAME}?theme={theme}",
            "download_url": f"{JSONRESUME_PREVIEW_BASE}/{JSONRESUME_PREVIEW_USERNAME}?theme={theme}",
            "preview_type": "iframe",
            "updated_at": datetime.now(timezone.utc).isoformat()
        })

    return templates if templates else None


def _set_templates_cache(templates: List[Dict[str, Any]], source: str) -> None:
    TEMPLATES_CACHE["data"] = templates
    TEMPLATES_CACHE["source"] = source
    TEMPLATES_CACHE["updated_at"] = datetime.now(timezone.utc).isoformat()
    TEMPLATES_CACHE["fetched_at"] = time.time()


def _get_templates_cached() -> Dict[str, Any]:
    now = time.time()
    if TEMPLATES_CACHE["data"] and (now - TEMPLATES_CACHE["fetched_at"] < TEMPLATES_REFRESH_SECONDS):
        return TEMPLATES_CACHE

    templates: Optional[List[Dict[str, Any]]] = None
    source = "local"

    if TEMPLATES_PROVIDER == "jsonresume":
        templates = _fetch_jsonresume_templates()
        source = "jsonresume"
    elif TEMPLATES_PROVIDER == "remote":
        templates = _fetch_remote_templates()
        source = "remote"
    elif TEMPLATES_PROVIDER == "auto":
        templates = _fetch_jsonresume_templates()
        source = "jsonresume"
        if not templates:
            templates = _fetch_remote_templates()
            source = "remote"

    if not templates:
        templates = _load_local_templates()
        source = "local"

    _set_templates_cache(templates, source)
    return TEMPLATES_CACHE


def _clean_text(value: Any, default: str = "") -> str:
    if value is None:
        return default
    text = str(value).replace("\r", " ").strip()
    if not text:
        return default
    try:
        text.encode("latin-1")
        return text
    except UnicodeEncodeError:
        return text.encode("latin-1", "replace").decode("latin-1")


def _build_resume_pdf(resume: Dict[str, Any], template: Optional[Dict[str, Any]] = None) -> bytes:
    name = _clean_text(resume.get("name"), "Resume")
    title = _clean_text(resume.get("title"), "")
    email = _clean_text(resume.get("email"), "")
    phone = _clean_text(resume.get("phone"), "")
    location = _clean_text(resume.get("location"), "")
    linkedin = _clean_text(resume.get("linkedin"), "")
    summary = _clean_text(resume.get("summary"), "")
    exp_title = _clean_text(resume.get("experienceTitle"), "")
    exp_company = _clean_text(resume.get("experienceCompany"), "")
    exp_dates = _clean_text(resume.get("experienceDates"), "")
    exp_location = _clean_text(resume.get("experienceLocation"), "")
    exp_bullets = _clean_text(resume.get("experienceBullets"), "")
    template_name = _clean_text((template or {}).get("name"), "")

    pdf = FPDF(unit="pt", format="A4")
    pdf.set_auto_page_break(auto=True, margin=48)
    pdf.add_page()
    # Compute effective page width in points for portable layout.
    effective_page_width = getattr(pdf, "epw", None)
    if effective_page_width is None:
        effective_page_width = float(getattr(pdf, "w", 0)) - float(getattr(pdf, "l_margin", 0)) - float(getattr(pdf, "r_margin", 0))
    
    pdf.set_font("Helvetica", "B", 22)
    pdf.cell(0, 24, name, ln=1)

    if title:
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(0, 18, title, ln=1)

    if template_name:
        pdf.set_font("Helvetica", "I", 10)
        pdf.set_text_color(100, 116, 139)
        pdf.cell(0, 16, f"Template: {template_name}", ln=1)
        pdf.set_text_color(0, 0, 0)

    contact_parts = [part for part in [phone, email, linkedin, location] if part]
    if contact_parts:
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(effective_page_width, 14, " | ".join(contact_parts))
        pdf.ln(6)

    if summary:
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 18, "Summary", ln=1)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(effective_page_width, 14, summary)
        pdf.ln(6)

    if exp_title or exp_company:
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 18, "Experience", ln=1)
        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 16, f"{exp_title} - {exp_company}".strip(" -"), ln=1)
        pdf.set_font("Helvetica", "", 10)
        if exp_dates or exp_location:
            pdf.cell(0, 14, f"{exp_dates}  {exp_location}".strip(), ln=1)
        # FPDF's default Latin fonts can raise encoding errors for non-Latin glyphs.
        # Use ASCII-safe bullets and sanitize each line.
        bullet_lines = [
            _clean_text(line.strip(), "")
            for line in exp_bullets.split("\n")
            if line.strip()
        ]
        if bullet_lines:
            for bullet in bullet_lines:
                pdf.multi_cell(effective_page_width, 14, f"- {bullet}")
        pdf.ln(4)

    # fpdf2: Calling output() returns a bytearray; Starlette Response requires bytes.
    # fpdf1: Calling output(dest='S') returns a string (often containing latin-1 binary).
    try:
        # Check if we are using fpdf2 by trying to call output() without arguments
        output = pdf.output()
    except TypeError:
        # Fallback for old fpdf1 versions which require dest='S'
        output = pdf.output(dest="S")

    if isinstance(output, str):
        return output.encode("latin-1")
    return bytes(output)


def _safe_download_filename(value: str, fallback: str = "template") -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "-", (value or "").strip()).strip("-.")
    if not cleaned:
        cleaned = fallback
    return cleaned.lower()


def _build_template_sample_pdf(template: Dict[str, Any]) -> bytes:
    sample_resume = {
        "name": "Alex Candidate",
        "title": "Senior Product Analyst",
        "email": "alex.candidate@example.com",
        "phone": "+1 (555) 123-9876",
        "location": "New York, NY",
        "linkedin": "linkedin.com/in/alexcandidate",
        "summary": (
            "Results-driven analyst with 6+ years of experience delivering measurable "
            "business outcomes through data storytelling and process optimization."
        ),
        "experienceTitle": "Senior Product Analyst",
        "experienceCompany": "Nova Systems",
        "experienceDates": "2021 - Present",
        "experienceLocation": "Remote",
        "experienceBullets": (
            "Improved conversion by 18% using A/B test insights\n"
            "Built KPI dashboards used by leadership weekly\n"
            "Reduced reporting cycle time from 3 days to 4 hours"
        ),
    }
    return _build_resume_pdf(sample_resume, template)


def _extract_token(token: Optional[str], req: Optional[Request]) -> Optional[str]:
    if token:
        return token
    if not req:
        return None
    auth_header = req.headers.get("authorization", "")
    if auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1].strip()
    return None


async def _require_download_auth(token: Optional[str], req: Optional[Request] = None) -> None:
    token_value = _extract_token(token, req)
    if not token_value:
        raise HTTPException(status_code=401, detail="Authentication required")
    payload = verify_token(token_value)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    try:
        user = await get_user_by_id(user_id)
        if not user:
            logger.warning("PDF download token valid but user not found in database.")
    except Exception as exc:
        logger.error(f"User lookup failed: {str(exc)}")

# Optional auth
try:
    from auth_routes import router as auth_router
    AUTH_AVAILABLE = True
except ImportError:
    AUTH_AVAILABLE = False
    print("WARNING: auth_routes module not found. Authentication features will be disabled.")

# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================
# APP SETUP
# ============================================================

app = FastAPI()

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]
CORS_ORIGIN_REGEX = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"^http://(localhost|127\.0\.0\.1)(:\d+)?$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _is_origin_allowed(origin: str) -> bool:
    if origin in CORS_ORIGINS:
        return True
    if not CORS_ORIGIN_REGEX:
        return False
    try:
        return re.match(CORS_ORIGIN_REGEX, origin) is not None
    except re.error:
        return False


@app.middleware("http")
async def ensure_cors_headers(request: Request, call_next):
    try:
        response = await call_next(request)
    except HTTPException as exc:
        response = JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    except Exception as exc:
        logger.exception(f"Unhandled server error: {str(exc)}")
        response = JSONResponse(status_code=500, content={"detail": "Internal server error"})

    origin = request.headers.get("origin")
    if origin and _is_origin_allowed(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Vary"] = "Origin"
    return response


# ============================================================
# MODELS
# ============================================================

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ResumePDFRequest(BaseModel):
    resume: Dict[str, Any]
    template: Optional[Dict[str, Any]] = None


# ============================================================
# ROOT ROUTES
# ============================================================

@app.get("/")
async def main_root():
    return {
        "status": "online",
        "message": "Hirelytic Backend Server is running",
        "endpoints": {
            "health": "/api/",
            "analyze": "/api/analyze",
            "job_suggestions": "/api/job_suggestions",
            "templates": "/api/templates"
        }
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


# ============================================================
# API ROUTER
# ============================================================

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"status": "ok", "message": "Hire-Lytics API is running"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    return []


@api_router.get("/templates")
async def get_templates(category: Optional[str] = None):
    payload = _get_templates_cached()
    templates = payload["data"]

    if category:
        normalized = category.strip().lower()
        templates = [
            template for template in templates
            if template.get("category", "").strip().lower() == normalized
        ]

    categories = sorted({template.get("category") for template in payload["data"] if template.get("category")})
    return {
        "templates": templates,
        "count": len(templates),
        "source": payload["source"],
        "last_updated": payload["updated_at"],
        "categories": categories
    }


@api_router.get("/templates/{template_id}")
async def get_template_by_id(template_id: str):
    payload = _get_templates_cached()
    template = next(
        (item for item in payload["data"] if str(item.get("id")) == template_id),
        None
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return {
        "template": template,
        "source": payload["source"],
        "last_updated": payload["updated_at"]
    }


@api_router.get("/templates/{template_id}/download")
async def download_template_pdf(template_id: str, req: Request):
    payload = _get_templates_cached()
    template = next(
        (item for item in payload["data"] if str(item.get("id")) == template_id),
        None
    )
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    pdf_bytes: Optional[bytes] = None
    download_url = (template.get("download_url") or template.get("downloadUrl") or "").strip()
    if download_url:
        try:
            upstream = requests.get(download_url, timeout=15)
            content_type = upstream.headers.get("content-type", "").lower()
            if upstream.status_code == 200 and "application/pdf" in content_type:
                pdf_bytes = upstream.content
        except Exception as exc:
            logger.warning(f"Template upstream download failed for {template_id}: {str(exc)}")

    if not pdf_bytes:
        try:
            pdf_bytes = _build_template_sample_pdf(template)
        except Exception as exc:
            logger.exception(f"Failed to generate template sample PDF for {template_id}: {str(exc)}")
            raise HTTPException(status_code=500, detail="Failed to generate template PDF")

    origin = req.headers.get("origin") or ""
    filename = _safe_download_filename(template.get("name", "template"), "template")
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}.pdf"',
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)


@api_router.options("/resume/pdf")
async def resume_pdf_options(request: Request):
    origin = request.headers.get("origin") or ""
    headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin"
    }
    return Response(status_code=204, headers=headers)


@api_router.post("/resume/pdf")
async def generate_resume_pdf(request: ResumePDFRequest, req: Request, token: Optional[str] = None):
    await _require_download_auth(token, req)
    try:
        pdf_bytes = _build_resume_pdf(request.resume or {}, request.template or {})
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception(f"Failed to generate resume PDF: {str(exc)}")
        raise HTTPException(status_code=500, detail="Failed to generate PDF")
    origin = req.headers.get("origin") or ""
    headers = {
        "Content-Disposition": "attachment; filename=resume.pdf",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin"
    }
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers=headers
    )


# ------------------------------------------------------------
# Backwards-compatible routes (older frontend builds)
# ------------------------------------------------------------

@app.options("/resume/pdf")
async def resume_pdf_options_legacy(request: Request):
    # Mirror the /api/resume/pdf preflight for legacy clients that call /resume/pdf
    return await resume_pdf_options(request)


@app.post("/resume/pdf")
async def generate_resume_pdf_legacy(request: ResumePDFRequest, req: Request, token: Optional[str] = None):
    # Delegate to the canonical implementation under /api
    return await generate_resume_pdf(request, req, token)


@app.get("/resume/pdf")
async def resume_pdf_get_not_supported():
    # Some older clients attempted a GET download flow; keep the error explicit.
    raise HTTPException(status_code=405, detail="Use POST /api/resume/pdf with JSON body to generate a PDF.")


# ============================================================
# ANALYZE ROUTE  —  calls get_ats_score from groq_service
# ============================================================

@api_router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file:
        return {"error": "No file uploaded"}

    analysis_id = str(uuid.uuid4())

    try:
        global cleaned_text
        pdf_bytes = await file.read()
        raw_text = ""

        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"

        if not raw_text.strip():
            return {
                "error": "Could not extract text from PDF. Ensure it contains selectable text.",
                "analysis_id": analysis_id,
                "filename": file.filename
            }

        cleaned_text = advanced_clean_text(raw_text)
        logger.info(f"Extracted {len(cleaned_text)} characters from {file.filename}")
        try:
            CLEANED_TEXT_PATH.write_text(cleaned_text, encoding="utf-8")
        except Exception as e:
            logger.error(f"Failed to write cleaned text cache: {str(e)}")

        ats_result = get_ats_score(cleaned_text)

        doc = {
            "analysis_id": analysis_id,
            "filename": file.filename,
            "content_type": file.content_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "score": ats_result.get("score", 0),
            "breakdown": ats_result.get("breakdown", {
                "content": 0, "sections": 0, "ats_essentials": 0, "tailoring": 0
            }),
            "feedback": ats_result.get("feedback", "Analysis complete"),
            "issues": ats_result.get("issues", {
                "content": [], "sections": [], "ats_essentials": [], "tailoring": []
            })
        }

        logger.info(f"Analysis complete for {file.filename}: Score {doc['score']}")
        return doc

    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return {"error": f"Error processing file: {str(e)}", "analysis_id": analysis_id, "filename": file.filename}


# ============================================================
# JOB SUGGESTIONS ROUTE  —  reuses global cleaned_text from /analyze
# ============================================================

@api_router.get("/job_suggestions")
async def job_suggestions():
    global cleaned_text
    if not cleaned_text:
        if CLEANED_TEXT_PATH.exists():
            try:
                cached_text = CLEANED_TEXT_PATH.read_text(encoding="utf-8").strip()
                if cached_text:
                    cleaned_text = cached_text
            except Exception as e:
                logger.error(f"Failed to read cleaned text cache: {str(e)}")

    if not cleaned_text:
        return {"title": "", "jobs": [], "error": "No cached resume found"}

    try:
        suggestion = get_job_suggestion(cleaned_text)

        return {"title": suggestion, "jobs": fetch_jobs(suggestion)}

    except Exception as e:
        logger.error(f"Job suggestion error: {str(e)}")
        return {"title": suggestion if 'suggestion' in locals() else "", "jobs": [], "error": "Job provider unavailable"}


# ============================================================
# REGISTER ROUTERS
# ============================================================

app.include_router(api_router)

if AUTH_AVAILABLE:
    app.include_router(auth_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
