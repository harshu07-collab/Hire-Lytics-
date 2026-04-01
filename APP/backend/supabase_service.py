"""
Supabase Integration Module
Handles user database operations using Supabase
"""
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Try to import Supabase
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    logger.warning("Supabase client not available")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

class SupabaseService:
    def __init__(self):
        self.available = SUPABASE_AVAILABLE and SUPABASE_URL and SUPABASE_SERVICE_KEY
        self.memory_mode = False
        self._memory_users: Dict[str, Dict[str, Any]] = {}
        if self.available:
            try:
                self.client: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {str(e)}")
                self.available = False
        else:
            logger.warning("Supabase not configured properly")
            self.client = None

    def _is_missing_users_table_error(self, error: Exception) -> bool:
        text = str(error)
        return "PGRST205" in text or "Could not find the table 'public.users'" in text

    def _enable_memory_mode(self) -> None:
        if not self.memory_mode:
            logger.warning("Supabase users table unavailable, switching to in-memory auth store")
            self.memory_mode = True

    def _memory_create_user(
        self,
        email: str,
        name: str,
        auth_provider: str = "email",
        google_id: Optional[str] = None,
        hashed_password: Optional[str] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        safe_email = email.replace("@", "_at_").replace(".", "_")
        user = {
            "id": f"user_{safe_email}",
            "email": email,
            "name": name,
            "auth_provider": auth_provider,
            "google_id": google_id,
            "hashed_password": hashed_password,
            "is_verified": False,
            "created_at": now,
            "last_login": None,
        }
        self._memory_users[user["id"]] = user
        return user

    def _memory_find_user(self, field: str, value: str) -> Optional[Dict[str, Any]]:
        for user in self._memory_users.values():
            if user.get(field) == value:
                return user
        return None

    async def create_user(
        self,
        email: str,
        name: str,
        auth_provider: str = "email",
        google_id: Optional[str] = None,
        hashed_password: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Create new user in database"""
        if not self.available or self.memory_mode:
            logger.warning("Supabase not available, simulating user creation")
            return self._memory_create_user(email, name, auth_provider, google_id, hashed_password)

        try:
            data = {
                "email": email,
                "name": name,
                "auth_provider": auth_provider,
                "google_id": google_id,
                "hashed_password": hashed_password,
                "is_verified": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            }

            response = self.client.table("users").insert(data).execute()
            logger.info(f"User created: {email}")
            return response.data[0] if response.data else None
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                return self._memory_create_user(email, name, auth_provider, google_id, hashed_password)
            logger.error(f"Error creating user {email}: {str(e)}")
            return None

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        if not self.available or self.memory_mode:
            logger.warning("Supabase not available, returning mock user")
            return self._memory_find_user("email", email)

        try:
            response = self.client.table("users").select("*").eq("email", email).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                return self._memory_find_user("email", email)
            logger.error(f"Error getting user {email}: {str(e)}")
            return None

    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        if not self.available or self.memory_mode:
            return self._memory_users.get(user_id)

        try:
            response = self.client.table("users").select("*").eq("id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                return self._memory_users.get(user_id)
            logger.error(f"Error getting user {user_id}: {str(e)}")
            return None

    async def get_user_by_google_id(self, google_id: str) -> Optional[Dict[str, Any]]:
        """Get user by Google ID"""
        if not self.available or self.memory_mode:
            return self._memory_find_user("google_id", google_id)

        try:
            response = self.client.table("users").select("*").eq("google_id", google_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                return self._memory_find_user("google_id", google_id)
            logger.error(f"Error getting user by Google ID: {str(e)}")
            return None

    async def verify_user(self, user_id: str) -> bool:
        """Mark user as verified"""
        if not self.available or self.memory_mode:
            logger.warning("Supabase not available, simulating user verification")
            user = self._memory_users.get(user_id)
            if user:
                user["is_verified"] = True
            return True

        try:
            self.client.table("users").update({
                "is_verified": True
            }).eq("id", user_id).execute()
            logger.info(f"User verified: {user_id}")
            return True
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                user = self._memory_users.get(user_id)
                if user:
                    user["is_verified"] = True
                return True
            logger.error(f"Error verifying user {user_id}: {str(e)}")
            return False

    async def update_last_login(self, user_id: str) -> bool:
        """Update user's last login timestamp"""
        if not self.available or self.memory_mode:
            logger.warning("Supabase not available, simulating last login update")
            user = self._memory_users.get(user_id)
            if user:
                user["last_login"] = datetime.now(timezone.utc).isoformat()
            return True

        try:
            self.client.table("users").update({
                "last_login": datetime.now(timezone.utc).isoformat()
            }).eq("id", user_id).execute()
            logger.info(f"Last login updated: {user_id}")
            return True
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                user = self._memory_users.get(user_id)
                if user:
                    user["last_login"] = datetime.now(timezone.utc).isoformat()
                return True
            logger.error(f"Error updating last login for {user_id}: {str(e)}")
            return False

    async def update_user(self, user_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user data"""
        if not self.available or self.memory_mode:
            logger.warning("Supabase not available, simulating user update")
            user = self._memory_users.get(user_id)
            if not user:
                return None
            user.update(data)
            return user

        try:
            response = self.client.table("users").update(data).eq("id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                user = self._memory_users.get(user_id)
                if not user:
                    return None
                user.update(data)
                return user
            logger.error(f"Error updating user {user_id}: {str(e)}")
            return None

    async def check_email_exists(self, email: str) -> bool:
        """Check if email already exists"""
        if not self.available or self.memory_mode:
            return self._memory_find_user("email", email) is not None

        try:
            response = self.client.table("users").select("id").eq("email", email).execute()
            return len(response.data) > 0
        except Exception as e:
            if self._is_missing_users_table_error(e):
                self._enable_memory_mode()
                return self._memory_find_user("email", email) is not None
            logger.error(f"Error checking email {email}: {str(e)}")
            return False

# Singleton instance
supabase_service = SupabaseService()

# Convenience functions
async def create_user(
    email: str,
    name: str,
    auth_provider: str = "email",
    google_id: Optional[str] = None,
    hashed_password: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    return await supabase_service.create_user(email, name, auth_provider, google_id, hashed_password)

async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    return await supabase_service.get_user_by_email(email)

async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    return await supabase_service.get_user_by_id(user_id)

async def get_user_by_google_id(google_id: str) -> Optional[Dict[str, Any]]:
    return await supabase_service.get_user_by_google_id(google_id)

async def verify_user(user_id: str) -> bool:
    return await supabase_service.verify_user(user_id)

async def update_last_login(user_id: str) -> bool:
    return await supabase_service.update_last_login(user_id)

async def update_user(user_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    return await supabase_service.update_user(user_id, data)

async def check_email_exists(email: str) -> bool:
    return await supabase_service.check_email_exists(email)
