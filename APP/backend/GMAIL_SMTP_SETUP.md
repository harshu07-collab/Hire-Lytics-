# Gmail SMTP Setup Guide

## Step 1: Enable 2-Factor Authentication (2FA)

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA

## Step 2: Generate App Password

1. Go to App Passwords: https://support.google.com/accounts/answer/185833
2. Sign in with your Gmail account (hirelytics7@gmail.com)
3. Select "Mail" as the app
4. Select "Other (custom name)" as the device
5. Enter "Hire-Lytics" as the custom name
6. Click "Generate"
7. **Copy the 16-character password** (ignore spaces)

## Step 3: Update Environment Variables

Update your `.env` file in `APP/backend/`:

```env
SMTP_PASSWORD=abcd1234efgh5678  # Replace with your actual 16-character App Password
```

## Step 4: Test Email Service

```bash
cd APP/backend
python test_smtp.py
```

Expected output:
```
Testing SMTP email service...
✅ Email sent successfully via SMTP!
```

## Step 5: Test Signup Flow

1. Start backend: `python server.py`
2. Start frontend: `cd ../frontend && npm start`
3. Go to `http://localhost:3000/signup`
4. Enter email and click "Send OTP"
5. ✅ **Check your email for the OTP!**

## Troubleshooting

- **"Username and Password not accepted"**: Use App Password, not regular password
- **"Application-specific password required"**: Enable 2FA first
- **Still not working**: Double-check the App Password (no spaces)

## Why Gmail SMTP?

- ✅ Free to use
- ✅ No domain verification required
- ✅ Reliable delivery
- ✅ Works with existing Gmail account

Your OTP emails will now be sent to users' email addresses instead of appearing in the browser console!