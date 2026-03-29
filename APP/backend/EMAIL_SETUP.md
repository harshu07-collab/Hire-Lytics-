# Email Configuration Setup

## Option 1: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Update your `.env` file:
   ```
   RESEND_API_KEY=your_actual_api_key_here
   EMAIL_FROM=noreply@hirelytic.com
   EMAIL_SENDER_NAME=Hire-Lytics
   ```

## Option 2: SMTP (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: [Google App Passwords](https://support.google.com/accounts/answer/185833)
3. Update your `.env` file:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password_here
   EMAIL_FROM=your_email@gmail.com
   EMAIL_SENDER_NAME=Hire-Lytics
   ```

## Testing

Run the test script to verify email sending:
```bash
cd APP/backend
python test_email.py
```

Replace `test@example.com` in the script with your actual email address to test.

## Current Status

✅ OTP is now sent via email only (not returned in API response)
✅ Email service supports both Resend and SMTP fallback
✅ Frontend updated to not expect OTP in response