"""
Authentication Routes
Handles signup, login, OTP verification, and Google OAuth
"""
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import logging
import os
from datetime import datetime, timezone
from typing import Optional

from auth import (
    TokenResponse,
    OTPRequest,
    OTPVerifyRequest,
    GoogleAuthRequest,
    RefreshTokenRequest,
    UserProfile,
    create_access_token,
    create_refresh_token,
    verify_token,
    generate_otp_secret,
    verify_otp,
    hash_password,
)
from email_service import send_otp_email, send_welcome_email
from supabase_service import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    get_user_by_google_id,
    verify_user,
    update_last_login,
    check_email_exists,
    update_user,
)
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

logger = logging.getLogger(__name__)
EMAIL_DEBUG_OTP = os.environ.get("EMAIL_DEBUG_OTP", "false").lower() in ("1", "true", "yes")
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID") or os.environ.get("REACT_APP_GOOGLE_CLIENT_ID")

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# ============================================================
# DEPENDENCY: Get current user from token
# ============================================================
async def get_current_user(token: Optional[str] = None):
    """Extract user from authorization header or query param"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authorization token provided"
        )
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

# ============================================================
# SIGNUP FLOW
# ============================================================
@router.post("/signup/send-otp", response_model=dict)
async def signup_send_otp(request: OTPRequest):
    """
    Step 1: Send OTP to email for signup
    """
    try:
        # Check if email already exists
        email_exists = await check_email_exists(request.email)
        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )
        
        # Generate OTP
        otp = generate_otp_secret(request.email, "signup")
        
        # Send OTP email
        email_sent = await send_otp_email(
            to=request.email,
            otp=otp,
            email_type="signup"
        )
        
        if not email_sent:
            logger.warning(f"OTP email failed to send to {request.email}")
            if EMAIL_DEBUG_OTP:
                logger.info(f"DEBUG OTP for {request.email}: {otp}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Failed to send OTP email. Check email configuration."
            )
        
        return {
            "success": True,
            "message": "OTP sent to your email",
            "email": request.email
        }
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in signup_send_otp: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

@router.post("/signup/verify-otp", response_model=TokenResponse)
async def signup_verify_otp(request: OTPVerifyRequest):
    """
    Step 2: Verify OTP and create account
    """
    try:
        # Verify OTP
        if not verify_otp(request.email, request.otp):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        # Create user
        user = await create_user(
            email=request.email,
            name=request.name or request.email.split('@')[0],
            auth_provider="email"
        )
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        # Mark user as verified
        await verify_user(user.get("id"))
        
        # Update last login
        await update_last_login(user.get("id"))
        
        # Send welcome email
        await send_welcome_email(request.email, request.name or "User")
        
        # Generate tokens
        access_token = create_access_token({"sub": user.get("id"), "email": request.email})
        refresh_token = create_refresh_token({"sub": user.get("id"), "email": request.email})
        
        user_profile = UserProfile(
            id=user.get("id"),
            email=user.get("email"),
            name=user.get("name"),
            auth_provider=user.get("auth_provider"),
            is_verified=user.get("is_verified", True),
            created_at=user.get("created_at"),
            last_login=user.get("last_login")
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=900,  # 15 minutes
            user=user_profile.model_dump()
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in signup_verify_otp: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify OTP"
        )

# ============================================================
# LOGIN FLOW
# ============================================================
@router.post("/login/send-otp", response_model=dict)
async def login_send_otp(request: OTPRequest):
    """
    Step 1: Send OTP to email for login
    """
    try:
        # Check if email exists
        user = await get_user_by_email(request.email)
        if not user:
            # For security, don't reveal if email exists
            logger.warning(f"Login attempt for non-existent email: {request.email}")
        
        # Generate OTP regardless (security best practice)
        otp = generate_otp_secret(request.email, "login")
        
        # Send OTP email
        email_sent = await send_otp_email(
            to=request.email,
            otp=otp,
            email_type="login"
        )
        
        if not email_sent:
            logger.warning(f"OTP email failed to send to {request.email}")
            if EMAIL_DEBUG_OTP:
                logger.info(f"DEBUG OTP for {request.email}: {otp}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Failed to send OTP email. Check email configuration."
            )
        
        return {
            "success": True,
            "message": "OTP sent to your email",
            "email": request.email
        }
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in login_send_otp: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

@router.post("/login/verify-otp", response_model=TokenResponse)
async def login_verify_otp(request: OTPVerifyRequest):
    """
    Step 2: Verify OTP and login
    """
    try:
        # Verify OTP
        if not verify_otp(request.email, request.otp):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        # Get user
        user = await get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update last login
        await update_last_login(user.get("id"))
        
        # Generate tokens
        access_token = create_access_token({"sub": user.get("id"), "email": request.email})
        refresh_token = create_refresh_token({"sub": user.get("id"), "email": request.email})
        
        user_profile = UserProfile(
            id=user.get("id"),
            email=user.get("email"),
            name=user.get("name"),
            auth_provider=user.get("auth_provider"),
            is_verified=user.get("is_verified", False),
            created_at=user.get("created_at"),
            last_login=user.get("last_login")
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=900,  # 15 minutes
            user=user_profile.model_dump()
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in login_verify_otp: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to login"
        )

# ============================================================
# GOOGLE OAUTH
# ============================================================
@router.post("/google", response_model=TokenResponse)
async def google_auth(request: GoogleAuthRequest):
    """
    Google OAuth callback handler
    Validates Google token and creates/updates user
    """
    try:
        if not GOOGLE_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID."
            )

        try:
            id_info = id_token.verify_oauth2_token(
                request.token,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )

        google_id = id_info.get("sub")
        email = id_info.get("email")
        name = id_info.get("name") or id_info.get("given_name") or (email.split("@")[0] if email else "User")

        if not google_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google token missing required claims"
            )

        # Check if user exists by Google ID
        user = await get_user_by_google_id(google_id)
        existing_user = None
        new_user = None
        
        if user:
            # User exists, update login
            await update_last_login(user.get("id"))
            user_id = user.get("id")
            email = user.get("email")
        else:
            # New user, check if email exists
            existing_user = await get_user_by_email(email)
            
            if existing_user:
                # Email exists with different provider
                user_id = existing_user.get("id")
                email = existing_user.get("email")
                if not existing_user.get("google_id"):
                    await update_user(user_id, {
                        "google_id": google_id,
                        "auth_provider": "google"
                    })
                await verify_user(user_id)
                await update_last_login(user_id)
            else:
                # Create new user
                new_user = await create_user(
                    email=email,
                    name=name,
                    auth_provider="google",
                    google_id=google_id
                )
                
                if not new_user:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to create user"
                    )
                
                # Mark as verified (Google accounts are pre-verified)
                await verify_user(new_user.get("id"))
                await send_welcome_email(email, name)
                
                user_id = new_user.get("id")
                email = new_user.get("email")
        
        # Generate tokens
        access_token = create_access_token({"sub": user_id, "email": email})
        refresh_token = create_refresh_token({"sub": user_id, "email": email})
        
        # Get updated user
        final_user = await get_user_by_id(user_id)
        if not final_user:
            final_user = user or existing_user or new_user
        
        user_profile = UserProfile(
            id=final_user.get("id"),
            email=final_user.get("email"),
            name=final_user.get("name"),
            auth_provider=final_user.get("auth_provider"),
            is_verified=final_user.get("is_verified", True),
            created_at=final_user.get("created_at"),
            last_login=final_user.get("last_login")
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=900,
            user=user_profile.model_dump()
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in google_auth: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google authentication failed"
        )

# ============================================================
# TOKEN MANAGEMENT
# ============================================================
@router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    """
    try:
        payload = verify_token(request.refresh_token)
        
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        # Generate new access token
        new_access_token = create_access_token({"sub": user_id, "email": email})
        
        return TokenResponse(
            access_token=new_access_token,
            refresh_token=request.refresh_token,  # Reuse same refresh token
            expires_in=900
        )
    except Exception as e:
        logger.error(f"Error in refresh_token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to refresh token"
        )

# ============================================================
# USER PROFILE
# ============================================================
@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(token: str = None):
    """
    Get current user profile
    """
    try:
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token provided"
            )
        
        payload = verify_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user_id = payload.get("sub")
        user = await get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserProfile(
            id=user.get("id"),
            email=user.get("email"),
            name=user.get("name"),
            auth_provider=user.get("auth_provider"),
            is_verified=user.get("is_verified", False),
            created_at=user.get("created_at"),
            last_login=user.get("last_login")
        )
    except Exception as e:
        logger.error(f"Error in get_current_user_profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user profile"
        )

# ============================================================
# LOGOUT
# ============================================================
@router.post("/logout", response_model=dict)
async def logout(token: str = None):
    """
    Logout user (invalidate token on frontend)
    """
    try:
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token provided"
            )
        
        logger.info("User logged out")
        
        return {
            "success": True,
            "message": "Logged out successfully"
        }
    except Exception as e:
        logger.error(f"Error in logout: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to logout"
        )
