import logging
import uuid
import io
import json
import base64
from pathlib import Path
from datetime import datetime, timezone

import pdfplumber
from fastapi import FastAPI, APIRouter, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from dotenv import load_dotenv

# Load .env from one level above backend/
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

# Local modules
from text_cleaner import advanced_clean_text
from groq_service import get_ats_score, get_job_suggestion
from job_open import jobs as fetch_jobs

# global cleaned text — gets updated on every /analyze call
cleaned_text = ""
CACHE_DIR = Path(__file__).resolve().parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)
CLEANED_TEXT_PATH = CACHE_DIR / "cleaned_text.txt"

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
            "job_suggestions": "/api/job_suggestions"
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
