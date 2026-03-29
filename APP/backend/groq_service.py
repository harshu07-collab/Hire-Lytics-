import os
import json
import logging
import base64
from groq import Groq
from fpdf import FPDF

logger = logging.getLogger(__name__)

# ============================================================
# GROQ CLIENT INIT
# ============================================================

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

if not os.environ.get("GROQ_API_KEY"):
    print("WARNING: GROQ_API_KEY not set in environment!")
else:
    print("Groq API key loaded successfully.")


# ============================================================
# DEFAULT FALLBACK ANALYSIS
# ============================================================

def get_default_analysis(feedback: str) -> dict:
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


# ============================================================
# ATS SCORING  (triggered on resume upload)
# ============================================================

def get_ats_score(clean_text: str) -> dict:
    """
    Score a resume using Groq's llama-3.3-70b-versatile.
    Called when the user uploads/clicks their resume for analysis.
    Returns structured JSON with score, breakdown, feedback, and issues.
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
            model="llama-3.3-70b-versatile",           # Best for structured JSON analysis
            temperature=0.1,                             # Low = consistent, reliable output
            response_format={"type": "json_object"}      # Forces pure JSON, no markdown
        )

        content = response.choices[0].message.content
        logger.info(f"Raw Groq response preview: {content[:300]}")

        result = json.loads(content)

        # Validate and clamp all breakdown values to 0-100
        breakdown = result.get("breakdown", {})
        content_score   = max(0, min(100, int(breakdown.get("content", 0))))
        sections_score  = max(0, min(100, int(breakdown.get("sections", 0))))
        ats_score       = max(0, min(100, int(breakdown.get("ats_essentials", 0))))
        tailoring_score = max(0, min(100, int(breakdown.get("tailoring", 0))))

        # Always recalculate score — never trust model's own sum
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

        # Ensure issues structure always has all 4 keys
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


#Recommended jobs to apply for based on resume content
def get_job_suggestion(resume_text: str) -> str:
    """
    Analyze a resume and return the single most specific job title
    the candidate is best suited for (e.g. 'Data Analyst', 'Frontend Developer').
    Returns a plain string — no JSON, no extra formatting.
    """
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a career counselor and hiring expert.
Your job is to read a resume and output ONE specific job title that best matches the candidate's skills, experience, and background.

Rules:
- Be SPECIFIC. Never say generic things like "Software Engineer" or "Developer".
- Good examples: "Data Analyst", "Frontend Developer", "Full Stack Developer", "Machine Learning Engineer",
  "DevOps Engineer", "UI/UX Designer", "Backend Developer", "Cloud Architect", "Cybersecurity Analyst","Gyanecologist",
  "Business Intelligence Analyst", "Mobile Developer (React Native)", "Embedded Systems Engineer".
- Output ONLY the job title. No explanation. No punctuation. No extra words. Just the title."""
                },
                {
                    "role": "user",
                    "content": f"Based on this resume, what is the single most specific job title this person is best suited for?\n\n{resume_text[:3000]}"
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,        # Low = consistent, decisive output
            max_tokens=20           # Job title only — no need for more
        )

        suggestion = response.choices[0].message.content.strip()

        # Sanitize: strip quotes, punctuation, newlines if model adds them
        suggestion = suggestion.strip('"\'').strip()
        logger.info(f"Job suggestion: {suggestion}")
        return suggestion

    except Exception as e:
        logger.error(f"Error getting job suggestion: {str(e)}")
        return "Software Developer"  # Safe fallback