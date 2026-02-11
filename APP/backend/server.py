import logging
import uuid
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, UploadFile, File, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection settings
MONGO_URL = os.environ.get('MONGO_URL', "mongodb://localhost:27017")
DB_NAME = os.environ.get('DB_NAME', "test_database")

client = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    # Startup: Create MongoDB client
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        # Verify connection
        await client.admin.command('ping')
        logger.info(f"Connected to MongoDB at {MONGO_URL}, database: {DB_NAME}")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        db = None
    yield
    # Shutdown: Close MongoDB client
    if client:
        client.close()
        logger.info("MongoDB connection closed")

# Create the main app with lifespan
app = FastAPI(lifespan=lifespan)

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
    # Basic analysis simulation
    # In a real scenario, this would use an AI model to parse the resume
    analysis_id = str(uuid.uuid4())
    
    # Calculate a mock score based on filename length (just to have some variety)
    mock_score = 70 + (len(file.filename) % 25)
    
    doc = {
        "analysis_id": analysis_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "score": mock_score,
        "breakdown": {
            "ats_parse_rate": 90 + (len(file.filename) % 10),
            "formatting": 85 + (len(file.filename) % 15),
            "skills_match": 70 + (len(file.filename) % 20),
            "grammar": 95
        }
    }
    
    if db is not None:
        try:
            await db.analyses.insert_one(doc)
        except Exception as e:
            logger.error(f"Failed to store analysis in MongoDB: {e}")
    else:
        logger.warning("MongoDB is not connected. Analysis not stored.")
        # Continue even if DB fails, so the user gets a result
        
    # Remove the _id if it was added by MongoDB
    if "_id" in doc:
        del doc["_id"]
        
    return doc

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    if db is not None:
        _ = await db.status_checks.insert_one(doc)
    else:
        logger.warning("MongoDB is not connected. Status check not stored.")
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        return []

    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)