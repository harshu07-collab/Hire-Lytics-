import logging
import uuid
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, UploadFile, File, Response,Request
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
import sys
import io
import json


load_dotenv()   # reads .env file

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Test connection (optional - can be removed in production)
try:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Explain the importance of fast language models",
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    print("Groq API connection successful!")
except Exception as e:
    print(f"Groq API connection failed: {e}")

def advanced_clean_text(text):

    # 1️⃣ Normalize line endings
    text = text.replace('\r', '\n')

    # 2️⃣ Remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)

    # 3️⃣ Remove bullet symbols
    text = re.sub(r'[•●▪►✔➢▪·]', '', text)

    # 4️⃣ Remove page numbers (common formats)
    text = re.sub(r'Page\s*\d+(\s*of\s*\d+)?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n\d+\n', '\n', text)

    # 5️⃣ Remove excessive spaces
    text = re.sub(r'[ \t]+', ' ', text)

    # 6️⃣ Remove excessive blank lines
    text = re.sub(r'\n\s*\n+', '\n\n', text)

    # 7️⃣ Fix broken words split across lines
    text = re.sub(r'-\n', '', text)

    # 8️⃣ Merge lines that are artificially broken
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)

    # 9️⃣ Split again into proper paragraphs
    text = re.sub(r'\n{2,}', '\n\n', text)

    # 🔟 Strip each line
    lines = [line.strip() for line in text.split('\n')]

    # 1️⃣1️⃣ Remove duplicate lines (very common in PDFs)
    lines = list(OrderedDict.fromkeys(lines))

    # 1️⃣2️⃣ Remove very short noise lines (optional)
    lines = [line for line in lines if len(line) > 2]

    cleaned_text = "\n".join(lines)

    return cleaned_text

def get_ats_score(clean_text):
    """
    Get ATS score from Groq API
    Returns: dict with score and breakdown or error message
    """
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an ATS (Applicant Tracking System) expert. Analyze resumes and return a JSON object with the following structure: {\"score\": <number 0-100>, \"breakdown\": {\"ats_parse_rate\": <0-100>, \"formatting\": <0-100>, \"skills_match\": <0-100>, \"grammar\": <0-100>}, \"feedback\": \"<brief explanation>\"}. Only return valid JSON, no additional text."
                },
                {
                    "role": "user",
                    "content": f"Analyze the following resume text for ATS compatibility:\n\n{clean_text[:4000]}"  # Limit text length to avoid token limits
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )

        # Get the response content
        content = response.choices[0].message.content

        # Try to parse JSON from the response
        try:
            # Clean up the response in case it has markdown code blocks
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            result = json.loads(content)
            return result
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw content with a default structure
            return {
                "score": 50,
                "breakdown": {
                    "ats_parse_rate": 50,
                    "formatting": 50,
                    "skills_match": 50,
                    "grammar": 50
                },
                "feedback": content
            }
    except Exception as e:
        logging.error(f"Error getting ATS score: {str(e)}")
        return {
            "score": 0,
            "breakdown": {
                "ats_parse_rate": 0,
                "formatting": 0,
                "skills_match": 0,
                "grammar": 0
            },
            "feedback": f"Error analyzing resume: {str(e)}"
        }


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

origins = ["http://localhost:3000"]

logger = logging.getLogger(__name__)

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

# Add a root endpoint to the main app to avoid 404 on /
@app.get("/")
async def main_root():
    return {
        "status": "online",
        "message": "Hirelytic Backend Server is running",
        "endpoints": {
            "health": "/api/",
            "analyze": "/api/analyze"
        }
    }


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"status": "ok", "message": "Hire-Lytics API is running"}

@api_router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):

    if not file:
        return {"error": "No file uploaded"}

    # Generate unique analysis ID
    analysis_id = str(uuid.uuid4())

    raw_text = ""

    try:
        # ✅ READ FILE BYTES
        pdf_bytes = await file.read()

        # ✅ PASS BYTES TO pdfplumber
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"

        if not raw_text.strip():
            return {
                "error": "Could not extract text from PDF",
                "analysis_id": analysis_id,
                "filename": file.filename
            }

        # Clean the extracted text
        cleaned_text = advanced_clean_text(raw_text)

        # Get ATS score from Groq API
        ats_result = get_ats_score(cleaned_text)

        # Build response document
        doc = {
            "analysis_id": analysis_id,
            "filename": file.filename,
            "content_type": file.content_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "score": ats_result.get("score", 0),
            "breakdown": ats_result.get("breakdown", {
                "ats_parse_rate": 0,
                "formatting": 0,
                "skills_match": 0,
                "grammar": 0
            }),
            "feedback": ats_result.get("feedback", "Analysis complete")
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

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results

    return "good to see you!"

# Include the router in the main app
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)