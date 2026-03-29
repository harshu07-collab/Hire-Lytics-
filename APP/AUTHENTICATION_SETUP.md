# Real Authentication Implementation Guide

## Overview
This document guides you through setting up the new real authentication system with Google OAuth and OTP email verification.

## What's New

### ✅ Features Implemented
1. **Gmail OTP Authentication** - 6-digit OTP sent to user email
2. **Google OAuth 2.0** - Social login with Google
3. **Persistent User Profiles** - Store user data with Supabase
4. **Secure Token Management** - JWT access and refresh tokens
5. **Real-time Email Sending** - Transactional emails via Resend
6. **Protected Routes** - Auth context middleware

### 📁 Files Added/Modified

#### Backend (Python/FastAPI)
- **NEW: `backend/auth.py`** - Authentication utilities (tokens, OTP, hashing)
- **NEW: `backend/auth_routes.py`** - API endpoints for auth
- **NEW: `backend/email_service.py`** - Email OTP sending
- **NEW: `backend/supabase_service.py`** - Database integration
- **MODIFIED: `backend/server.py`** - Integrated auth routes
- **MODIFIED: `backend/requirements.txt`** - Added auth dependencies

#### Frontend (React)
- **MODIFIED: `frontend/src/contexts/AuthContext.js`** - Real token management
- **MODIFIED: `frontend/src/pages/Login.js`** - OTP + Google OAuth
- **MODIFIED: `frontend/src/pages/Signup.js`** - OTP registration
- **MODIFIED: `frontend/src/App.js`** - GoogleOAuthProvider setup
- **MODIFIED: `frontend/package.json`** - Added dependencies
- **MODIFIED: `frontend/src/styles/Auth.css`** - New auth styles

#### Configuration
- **NEW: `.env.example`** - Environment variables template

---

## Setup Instructions

### Step 1: Install Dependencies

#### Backend
```bash
cd APP/backend
pip install -r requirements.txt
```

#### Frontend
```bash
cd APP/frontend
npm install
# or
yarn install
```

### Step 2: Configure Environment Variables

#### Create `.env` file in `APP/` directory:

```env
# ==========================================
# SUPABASE CONFIGURATION
# ==========================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# ==========================================
# GOOGLE OAUTH CONFIGURATION
# ==========================================
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# ==========================================
# EMAIL CONFIGURATION
# ==========================================
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=noreply@hirelytic.com
EMAIL_SENDER_NAME=Hire-Lytics

# ==========================================
# BACKEND CONFIGURATION
# ==========================================
REACT_APP_BACKEND_URL=http://localhost:8000
JWT_SECRET=your-super-secret-key-change-in-production-very-long-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# ==========================================
# SECURITY
# ==========================================
CORS_ORIGINS=http://localhost:3000,http://localhost:5000

# ==========================================
# GROQ API (existing)
# ==========================================
GROQ_API_KEY=your-groq-api-key
```

### Step 3: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable OAuth 2.0:
   - Go to "APIs & Services" → "Credentials"
   - Create OAuth 2.0 Client ID (Web Application)
   - Add authorized redirect URIs:
     - `http://localhost:3000` (development)
     - `http://localhost:5000` (testing)
     - `https://yourdomain.com` (production)
4. Copy Client ID and Client Secret to `.env`

### Step 4: Setup Supabase (Database)

**Option A: Use Supabase (Recommended)**

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to "SQL Editor" and run this query to create users table:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    auth_provider VARCHAR DEFAULT 'email',
    google_id VARCHAR UNIQUE,
    hashed_password VARCHAR,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_google_id ON users(google_id);
```

4. Get your:
   - Project URL → `SUPABASE_URL`
   - Service Role Key → `SUPABASE_SERVICE_KEY`

### Step 5: Setup Email Service

**Option A: Resend (Recommended)**

1. Go to [Resend](https://resend.com/)
2. Create account and get API key
3. Add to `.env`: `RESEND_API_KEY=...`

**Option B: Gmail SMTP**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password
```

### Step 6: Run the Application

#### Terminal 1 - Backend
```bash
cd APP/backend
python server.py
# Server runs on http://localhost:8000
```

#### Terminal 2 - Frontend
```bash
cd APP/frontend
npm start
# App runs on http://localhost:3000
```

---

## Testing the Authentication

### Test Signup
1. Go to `http://localhost:3000/signup`
2. Enter name and email
3. Click "Send OTP"
4. Check email for 6-digit OTP (in console if email not configured)
5. Enter OTP and verify
6. Should redirect to app

### Test Login
1. Go to `http://localhost:3000/login`
2. Enter email used in signup
3. Click "Send OTP"
4. Enter OTP from email
5. Should redirect to app

### Test Google OAuth
1. Go to `/signup` or `/login`
2. Click "Sign in with Google"
3. Select Google account
4. Should create user and redirect

### Debug Mode
OTP codes are logged to console when email fails:
- Open browser DevTools (F12)
- Go to Console tab
- Look for "DEBUG OTP: 123456"

---

## API Endpoints

All endpoints are under `/api/auth/`

### Signup
- **POST** `/signup/send-otp` - Send OTP to email
  ```json
  { "email": "user@example.com", "type": "signup" }
  ```
  Response:
  ```json
  { "success": true, "message": "OTP sent", "otp": "123456" }
  ```

- **POST** `/signup/verify-otp` - Create account and verify
  ```json
  { "email": "user@example.com", "otp": "123456", "name": "John" }
  ```
  Response:
  ```json
  {
    "access_token": "...",
    "refresh_token": "...",
    "user": { "id": "...", "email": "...", "name": "..." }
  }
  ```

### Login
- **POST** `/login/send-otp` - Send login OTP
- **POST** `/login/verify-otp` - Verify and login

### Google OAuth
- **POST** `/google` - Google callback handler
  ```json
  { "token": "google_token", "name": "John", "email": "..." }
  ```

### User Profile
- **GET** `/me?token=...` - Get current user profile
- **POST** `/refresh-token` - Refresh access token
  ```json
  { "refresh_token": "..." }
  ```

### Logout
- **POST** `/logout?token=...` - Logout user

---

## Troubleshooting

### Issue: "Supabase not available"
**Solution:**
- Install Supabase: `pip install supabase`
- Or disable by setting `SUPABASE_URL=""` in `.env`
- System will simulate user creation

### Issue: "Email not sending"
**Solution:**
- Check RESEND_API_KEY is valid
- Or configure SMTP credentials
- OTP will appear in console for testing

### Issue: "Google login not working"
**Solution:**
- Verify REACT_APP_GOOGLE_CLIENT_ID in `.env`
- Check Google OAuth credentials are correct
- Ensure localhost:3000 is in authorized URIs

### Issue: "CORS errors"
**Solution:**
- Update CORS_ORIGINS in backend `.env`
- Add your frontend URL to allowed origins
- Restart backend server

### Issue: "Token expired"
**Solution:**
- Tokens auto-refresh via refresh_token
- If both expired, user needs to login again
- Check ACCESS_TOKEN_EXPIRE_MINUTES in `.env`

---

## Database Schema

### Users Table
```
┌─────────────────┬──────────────┬─────────────┐
│ Column          │ Type         │ Constraints │
├─────────────────┼──────────────┼─────────────┤
│ id              │ UUID         │ PRIMARY KEY │
│ email           │ VARCHAR      │ UNIQUE      │
│ name            │ VARCHAR      │ NOT NULL    │
│ auth_provider   │ VARCHAR      │ DEFAULT     │
│ google_id       │ VARCHAR      │ UNIQUE      │
│ hashed_password │ VARCHAR      │ OPTIONAL    │
│ is_verified     │ BOOLEAN      │ DEFAULT 0   │
│ created_at      │ TIMESTAMP    │ DEFAULT NOW │
│ last_login      │ TIMESTAMP    │ OPTIONAL    │
└─────────────────┴──────────────┴─────────────┘
```

---

## Security Notes

### ✅ Implemented Security Measures
1. **JWT Tokens** - Secure token-based auth
2. **HTTPS Recommended** - Always use HTTPS in production
3. **Password Hashing** - Bcrypt for password security
4. **OTP Expiry** - 5-minute OTP expiration
5. **Rate Limiting** - Prevents brute force (optional: add slowapi)
6. **CORS Validation** - Only allow trusted origins
7. **Secure Headers** - Set secure cookie flags

### 🔐 Production Checklist
- [ ] Change `JWT_SECRET` to long random string
- [ ] Set `HTTPS_ONLY=true`
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for all secrets
- [ ] Enable database row-level security (Supabase)
- [ ] Set up rate limiting (slowapi)
- [ ] Use secure email service (Resend)
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits

---

## Rollback Instructions

If you need to revert to dummy authentication:

### Quick Rollback (Recommended)
```bash
# This preserves your work but disables real auth
cd APP
git restore frontend/src/pages/Login.js frontend/src/pages/Signup.js
git restore frontend/src/contexts/AuthContext.js
git restore frontend/src/App.js
git restore backend/server.py
git restore backend/requirements.txt
git restore frontend/package.json
```

### Complete Rollback
```bash
# Remove all auth files
rm backend/auth.py
rm backend/auth_routes.py
rm backend/email_service.py
rm backend/supabase_service.py
rm .env

# Restore from backups if available
git checkout HEAD~1
```

### Backup Before Changes
```bash
# Create backup directory
mkdir auth_backup

# Copy modified files
cp frontend/src/pages/Login.js auth_backup/
cp frontend/src/pages/Signup.js auth_backup/
cp backend/server.py auth_backup/

# You can restore from auth_backup/ later
```

---

## Next Steps

1. **Test everything** - Follow "Testing the Authentication" section
2. **Monitor logs** - Check browser console and server logs
3. **Setup analytics** - Track signup/login success rates
4. **Add more features**:
   - Password reset flow
   - Two-factor authentication
   - Social login (GitHub, Discord)
   - Email verification
   - Profile editing

---

## Support & Documentation

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React OAuth Google](https://github.com/react-oauth/react-oauth.github.io)
