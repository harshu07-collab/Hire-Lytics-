"""
Authentication Module
Handles JWT tokens, OTP verification, and user authentication
"""
import os
import secrets
import random
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# CONFIGURATION
# ============================================================
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OTP Storage (in-memory for demo, use Redis in production)
OTP_STORE: Dict[str, Dict[str, Any]] = {}

# ============================================================
# PYDANTIC MODELS
# ============================================================
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int
    user: Optional[Dict[str, Any]] = None

class OTPRequest(BaseModel):
    email: EmailStr
    type: str = "signup"  # signup or login

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str
    name: Optional[str] = None  # Required for signup

class GoogleAuthRequest(BaseModel):
    token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserProfile(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    name: str
    auth_provider: str  # "email", "google"
    is_verified: bool = False
    google_id: Optional[str] = None
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

# ============================================================
# TOKEN MANAGEMENT
# ============================================================
def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

# ============================================================
# OTP MANAGEMENT
# ============================================================
def generate_otp() -> str:
    """Generate a 6-digit OTP"""
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def generate_otp_secret(email: str, otp_type: str = "signup") -> str:
    """Generate OTP and store temporarily"""
    otp = generate_otp()
    secret = secrets.token_urlsafe(32)
    
    OTP_STORE[email] = {
        "otp": otp,
        "secret": secret,
        "type": otp_type,
        "created_at": datetime.now(timezone.utc),
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5),
        "attempts": 0
    }
    
    return otp

def verify_otp(email: str, otp: str) -> bool:
    """Verify OTP for email"""
    if email not in OTP_STORE:
        return False
    
    otp_data = OTP_STORE[email]
    
    # Check expiration
    if datetime.now(timezone.utc) > otp_data["expires_at"]:
        del OTP_STORE[email]
        return False
    
    # Check attempts
    if otp_data["attempts"] >= 5:
        del OTP_STORE[email]
        return False
    
    # Verify OTP
    if otp_data["otp"] == otp:
        del OTP_STORE[email]
        return True
    
    otp_data["attempts"] += 1
    return False

def get_otp_data(email: str) -> Optional[Dict[str, Any]]:
    """Get OTP data for email"""
    return OTP_STORE.get(email)
