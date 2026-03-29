#!/usr/bin/env python3
"""
Test SMTP email sending directly
"""
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def test_smtp_email():
    """Test SMTP email sending"""
    print("Testing SMTP email service...")

    # Get configuration
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    email_from = os.environ.get("EMAIL_FROM", smtp_user)
    test_email = os.environ.get("TEST_EMAIL", "")

    print(f"SMTP Host: {smtp_host}")
    print(f"SMTP Port: {smtp_port}")
    print(f"SMTP User: {smtp_user}")
    print(f"Email From: {email_from}")
    print(f"Test Email: {test_email}")

    if not smtp_user or not smtp_password:
        print("❌ SMTP credentials not configured")
        print("Please set SMTP_USER and SMTP_PASSWORD in .env")
        return

    if not test_email:
        print("❌ TEST_EMAIL not configured")
        return

    # Create test email
    subject = "Hire-Lytics Test OTP"
    otp = "123456"
    html_body = f"""
    <h2>Test Email from Hire-Lytics</h2>
    <p>This is a test email to verify SMTP configuration.</p>
    <p>Your test OTP is: <strong>{otp}</strong></p>
    <p>If you received this email, SMTP is working correctly!</p>
    """

    try:
        # Create message
        msg = MIMEText(html_body, "html")
        msg["Subject"] = subject
        msg["From"] = f"Hire-Lytics <{email_from}>"
        msg["To"] = test_email

        # Send email
        print(f"Sending test email to {test_email}...")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        print("✅ Email sent successfully via SMTP!")

    except Exception as e:
        print(f"❌ SMTP email failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure 2FA is enabled on your Gmail account")
        print("2. Generate an App Password: https://support.google.com/accounts/answer/185833")
        print("3. Use the 16-character App Password (not your regular password)")
        print("4. Update SMTP_PASSWORD in .env with the App Password")

if __name__ == "__main__":
    test_smtp_email()