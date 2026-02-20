import logging
import uuid
import os
from fastapi import FastAPI, APIRouter, UploadFile, File, Response
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime, timezone
from groq import Groq
import pdfplumber
import re
from collections import OrderedDict
import io
import json
import base64
from fpdf import FPDF

load_dotenv()

# ✅ Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# ✅ Simple env check — no wasted API credits on startup
if not os.environ.get("GROQ_API_KEY"):
    print("WARNING: GROQ_API_KEY not set in environment!")
else:
    print("Groq API key loaded successfully.")

# Configure logging EARLY
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================
# TEXT CLEANING
# ============================================================

def advanced_clean_text(text):
    text = text.replace('\r', '\n')
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'[•●▪►✔➢▪·]', '', text)
    text = re.sub(r'Page\s*\d+(\s*of\s*\d+)?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n\d+\n', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    text = re.sub(r'-\n', '', text)
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    text = re.sub(r'\n{2,}', '\n\n', text)
    lines = [line.strip() for line in text.split('\n')]
    lines = list(OrderedDict.fromkeys(lines))
    lines = [line for line in lines if len(line) > 2]
    return "\n".join(lines)


# ============================================================
# ATS SCORING
# ============================================================

def get_default_analysis(feedback):
    return {
        "score": 38,
        "breakdown": {
            "content": 40,
            "sections": 35,
            "ats_essentials": 38,
            "tailoring": 38
        },
        "feedback": feedback,
        "issues": {
            "content": [
                {
                    "type": "warning",
                    "title": "ATS Parse Rate",
                    "description": "Some formatting may affect ATS parsing.",
                    "impact": "2 Issues"
                },
                {
                    "type": "warning",
                    "title": "Quantifying Impact",
                    "description": "Add measurable achievements with numbers and percentages.",
                    "impact": "3 Issues"
                }
            ],
            "sections": [
                {
                    "type": "warning",
                    "title": "Contact Information",
                    "description": "Ensure all required contact details are present.",
                    "impact": "1 Issue"
                },
                {
                    "type": "error",
                    "title": "Professional Summary",
                    "description": "Missing or weak professional summary section.",
                    "impact": "2 Issues"
                }
            ],
            "ats_essentials": [
                {
                    "type": "success",
                    "title": "File Format",
                    "description": "PDF format is ATS-friendly.",
                    "impact": "No Issues"
                },
                {
                    "type": "warning",
                    "title": "Keywords",
                    "description": "Add more industry-specific keywords.",
                    "impact": "3 Issues"
                }
            ],
            "tailoring": [
                {
                    "type": "warning",
                    "title": "Job Match",
                    "description": "Resume could be better tailored to target roles.",
                    "impact": "2 Issues"
                }
            ]
        }
    }


def get_ats_score(clean_text):
    """
    Get ATS score from Groq API with detailed analysis.
    Model: llama-3.3-70b-versatile — best for structured JSON scoring.
    """
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a strict ATS (Applicant Tracking System) evaluator.
Analyze resumes critically and assign REALISTIC scores based on actual content quality.

Scoring rules:
- A resume missing key sections scores LOW (20-40)
- A resume with some content but no quantified achievements scores MEDIUM (40-65)
- Only well-structured, keyword-rich, quantified resumes score HIGH (75-90)
- Perfect resumes are extremely rare, max realistic score is 92

Score each category 0-100:
- content: Quality of bullet points, quantified achievements, strong action verbs
- sections: Presence of Summary, Experience, Education, Skills, Contact Info
- ats_essentials: Keyword density, standard formatting, no tables/graphics/columns
- tailoring: Industry relevance, job-specific language, role alignment

The final score MUST equal: round((content*0.30) + (sections*0.25) + (ats_essentials*0.25) + (tailoring*0.20))

Return ONLY valid JSON. No markdown. No extra text. No code blocks."""
                },
                {
                    "role": "user",
                    "content": f"""Analyze this resume and return a JSON object with this EXACT structure:
{{
  "score": <calculated weighted average as integer>,
  "breakdown": {{
    "content": <0-100 integer>,
    "sections": <0-100 integer>,
    "ats_essentials": <0-100 integer>,
    "tailoring": <0-100 integer>
  }},
  "feedback": "<2-3 sentence specific explanation referencing actual resume content>",
  "issues": {{
    "content": [
      {{"type": "error|warning|success", "title": "Issue Title", "description": "Specific description", "impact": "X Issues"}}
    ],
    "sections": [
      {{"type": "error|warning|success", "title": "Section Name", "description": "Specific feedback", "impact": "X Issues"}}
    ],
    "ats_essentials": [
      {{"type": "error|warning|success", "title": "Essential Item", "description": "Specific details", "impact": "X Issues"}}
    ],
    "tailoring": [
      {{"type": "error|warning|success", "title": "Tailoring Aspect", "description": "Specific recommendation", "impact": "X Issues"}}
    ]
  }}
}}

Resume text to analyze:
{clean_text[:4000]}"""
                }
            ],
            model="llama-3.3-70b-versatile",          # ✅ Best for structured JSON analysis
            temperature=0.1,                            # ✅ Low = consistent, reliable output
            response_format={"type": "json_object"}     # ✅ Forces pure JSON, no markdown
        )

        content = response.choices[0].message.content
        logger.info(f"Raw Groq response preview: {content[:300]}")

        result = json.loads(content)

        # ✅ Validate and clamp all breakdown values to 0-100
        breakdown = result.get("breakdown", {})
        content_score   = max(0, min(100, int(breakdown.get("content", 0))))
        sections_score  = max(0, min(100, int(breakdown.get("sections", 0))))
        ats_score       = max(0, min(100, int(breakdown.get("ats_essentials", 0))))
        tailoring_score = max(0, min(100, int(breakdown.get("tailoring", 0))))

        # ✅ Always recalculate score — never trust model's own sum
        calculated_score = round(
            content_score   * 0.30 +
            sections_score  * 0.25 +
            ats_score       * 0.25 +
            tailoring_score * 0.20
        )

        result["score"] = calculated_score
        result["breakdown"] = {
            "content":        content_score,
            "sections":       sections_score,
            "ats_essentials": ats_score,
            "tailoring":      tailoring_score
        }

        # ✅ Ensure issues structure always has all 4 keys
        issues = result.get("issues", {})
        for key in ["content", "sections", "ats_essentials", "tailoring"]:
            if key not in issues or not isinstance(issues[key], list):
                issues[key] = []
        result["issues"] = issues

        logger.info(f"Final ATS Score: {calculated_score} | Breakdown: {result['breakdown']}")
        return result

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse failed: {e}")
        return get_default_analysis("Could not parse AI response. Showing estimated analysis.")
    except Exception as e:
        logger.error(f"Error getting ATS score: {str(e)}")
        return get_default_analysis(f"Error analyzing resume: {str(e)}")


# ============================================================
# FASTAPI APP SETUP
# ============================================================

origins = ["http://localhost:3000"]

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main_root():
    return {
        "status": "online",
        "message": "Hirelytic Backend Server is running",
        "endpoints": {
            "health": "/api/",
            "analyze": "/api/analyze",
            "enhance": "/api/enhance"
        }
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


api_router = APIRouter(prefix="/api")


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
# ROUTES
# ============================================================

@api_router.get("/")
async def root():
    return {"status": "ok", "message": "Hire-Lytics API is running"}


@api_router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file:
        return {"error": "No file uploaded"}

    analysis_id = str(uuid.uuid4())
    raw_text = ""

    try:
        pdf_bytes = await file.read()

        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"

        if not raw_text.strip():
            return {
                "error": "Could not extract text from PDF. Ensure the PDF contains selectable text.",
                "analysis_id": analysis_id,
                "filename": file.filename
            }

        cleaned_text = advanced_clean_text(raw_text)
        logger.info(f"Extracted {len(cleaned_text)} characters from {file.filename}")

        ats_result = get_ats_score(cleaned_text)

        doc = {
            "analysis_id": analysis_id,
            "filename": file.filename,
            "content_type": file.content_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "score": ats_result.get("score", 0),
            "breakdown": ats_result.get("breakdown", {
                "content": 0,
                "sections": 0,
                "ats_essentials": 0,
                "tailoring": 0
            }),
            "feedback": ats_result.get("feedback", "Analysis complete"),
            "issues": ats_result.get("issues", {
                "content": [],
                "sections": [],
                "ats_essentials": [],
                "tailoring": []
            })
        }

        logger.info(f"Analysis complete for {file.filename}: Score {doc['score']}")
        return doc

    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return {
            "error": f"Error processing file: {str(e)}",
            "analysis_id": analysis_id,
            "filename": file.filename
        }


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    return []


@api_router.post("/enhance")
async def enhance_resume(file: UploadFile = File(...)):
    if not file:
        return {"error": "No file uploaded"}

    logger.info(f"Enhancement request received for: {file.filename}")

    try:
        # 1. Extract text from PDF
        pdf_bytes = await file.read()
        raw_text = ""
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"

        if not raw_text.strip():
            logger.error("Text extraction failed")
            return {"error": "Could not extract text from PDF"}

        # 2. Get ATS analysis to identify what needs fixing
        analysis = get_ats_score(raw_text)
        issues_summary = json.dumps(analysis.get("issues", {}))

        # 3. Enhance resume using Llama 4 Scout (newer, better for creative rewriting)
        enhance_prompt = f"""You are a world-class professional resume writer.
Transform the following raw resume text into a modern, high-impact, ATS-optimized resume.

REQUIRED CHANGES:
- FIX THESE ISSUES: {issues_summary}
- REWRITE every bullet point using the Google X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z]
- INJECT 20+ relevant industry keywords throughout
- QUANTIFY everything: use percentages, dollar amounts, team sizes
- STRUCTURE with these exact headers: PROFESSIONAL SUMMARY, CORE COMPETENCIES, PROFESSIONAL EXPERIENCE, EDUCATION
- TONE: Professional, executive, achievement-oriented

RAW RESUME TEXT:
{raw_text[:5000]}

Return this exact JSON structure:
{{
  "enhanced_text": "THE FULL REWRITTEN RESUME TEXT HERE",
  "changes": [
    "Specific change 1",
    "Specific change 2",
    "Specific change 3",
    "Specific change 4",
    "Specific change 5"
  ]
}}"""

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional resume writer. Return ONLY a valid JSON object with keys 'enhanced_text' and 'changes'. No markdown. No extra text."
                },
                {
                    "role": "user",
                    "content": enhance_prompt
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",  # ✅ Newer model, better creative rewriting
            temperature=0.7,
            response_format={"type": "json_object"}              # ✅ Forces pure JSON
        )

        result_json = json.loads(response.choices[0].message.content)
        enhanced_text = result_json.get("enhanced_text", "")
        changes = result_json.get("changes", [])

        if not enhanced_text or len(enhanced_text) < 100:
            logger.warning("AI returned insufficient text, using original as fallback")
            enhanced_text = raw_text

        # 4. Build professional styled PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)

        PRIMARY   = (37, 99, 235)   # Royal Blue
        SECONDARY = (30, 41, 59)    # Dark Slate
        ACCENT    = (59, 130, 246)  # Lighter Blue

        # Header banner
        pdf.set_fill_color(*SECONDARY)
        pdf.rect(0, 0, 210, 50, 'F')

        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Helvetica", style='B', size=26)
        pdf.set_y(15)
        pdf.cell(0, 15, "AI-ENHANCED RESUME", ln=True, align='C')

        pdf.set_font("Helvetica", size=10)
        pdf.set_y(32)
        pdf.cell(0, 5, "OPTIMIZED FOR ATS & EXECUTIVE REVIEW", ln=True, align='C')

        pdf.set_y(55)
        pdf.set_text_color(*SECONDARY)

        # Render resume content line by line
        lines = enhanced_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                pdf.ln(2)
                continue

            # Section headers (ALL CAPS, short lines)
            if line.isupper() and len(line) < 50:
                pdf.ln(3)
                pdf.set_font("Helvetica", style='B', size=14)
                pdf.set_text_color(*PRIMARY)
                safe_line = line.encode('latin-1', 'replace').decode('latin-1')
                pdf.cell(0, 10, safe_line, ln=True)
                pdf.set_draw_color(*ACCENT)
                pdf.set_line_width(0.5)
                pdf.line(10, pdf.get_y(), 200, pdf.get_y())
                pdf.ln(2)
                pdf.set_font("Helvetica", size=10)
                pdf.set_text_color(*SECONDARY)

            # Bullet points
            elif line.startswith('-') or line.startswith('*'):
                pdf.set_font("Helvetica", size=10)
                pdf.set_x(15)
                safe_line = line.encode('latin-1', 'replace').decode('latin-1')
                pdf.multi_cell(180, 6, safe_line)

            # Regular paragraph text
            else:
                pdf.set_font("Helvetica", size=10)
                safe_line = line.encode('latin-1', 'replace').decode('latin-1')
                pdf.multi_cell(190, 6, safe_line)

        # Output PDF as base64
        pdf_output = pdf.output()
        if not isinstance(pdf_output, (bytes, bytearray)):
            pdf_output = str(pdf_output).encode('latin-1')

        pdf_base64 = base64.b64encode(pdf_output).decode('utf-8')
        logger.info(f"Enhancement successful for {file.filename}")

        return {
            "success": True,
            "changes": changes,
            "pdf_base64": pdf_base64
        }

    except Exception as e:
        logger.error(f"Enhancement CRITICAL ERROR: {str(e)}")
        return {"error": str(e)}


# ============================================================
# REGISTER ROUTER
# ============================================================

app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)