#!/usr/bin/env python3
"""
Quick Gmail SMTP test
"""
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def test_gmail_smtp():
    """Test Gmail SMTP directly"""
    print("🔍 Testing Gmail SMTP connection...")

    # Get credentials
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    test_email = os.environ.get("TEST_EMAIL", "")

    print(f"📧 From: {smtp_user}")
    print(f"📧 To: {test_email}")

    if not smtp_user or not smtp_password:
        print("❌ SMTP_USER or SMTP_PASSWORD not set in .env")
        return

    if smtp_password == "YOUR_GMAIL_APP_PASSWORD_HERE":
        print("❌ Please replace 'YOUR_GMAIL_APP_PASSWORD_HERE' with your actual Gmail App Password")
        print("   Get it from: https://support.google.com/accounts/answer/185833")
        return

    # Create test email
    subject = "Hire-Lytics SMTP Test"
    body = """
    <h2>✅ Gmail SMTP is working!</h2>
    <p>This test email confirms that your Gmail SMTP configuration is correct.</p>
    <p>You can now send OTP emails from your Hire-Lytics application.</p>
    <p><strong>Test completed on: March 28, 2026</strong></p>
    """

    try:
        print("📤 Sending test email...")

        msg = MIMEText(body, "html")
        msg["Subject"] = subject
        msg["From"] = f"Hire-Lytics <{smtp_user}>"
        msg["To"] = test_email

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        print("✅ Gmail SMTP test successful!")
        print(f"📬 Check {test_email} for the test email")

    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed!")
        print("   - Make sure 2FA is enabled on your Gmail account")
        print("   - Use App Password, not regular password")
        print("   - App Password should be 16 characters (no spaces)")
    except Exception as e:
        print(f"❌ SMTP error: {e}")

if __name__ == "__main__":
    test_gmail_smtp()