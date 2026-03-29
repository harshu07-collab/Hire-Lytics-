#!/usr/bin/env python3
"""
Test script to verify Resend email service
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_resend_email():
    """Test Resend email sending"""
    print("Testing Resend email service...")

    # Check if resend is available
    try:
        import resend
        api_key = os.environ.get("RESEND_API_KEY", "")
        if not api_key:
            print("❌ RESEND_API_KEY not set in .env")
            return

        resend.api_key = api_key
        print("✅ Resend configured with API key")
    except ImportError as e:
        print(f"❌ Resend import failed: {e}")
        return

    # Test email details
    test_email = os.environ.get("TEST_EMAIL", "")
    if not test_email:
        print("❌ TEST_EMAIL not set in .env")
        return

    email_from = os.environ.get("EMAIL_FROM", "noreply@hirelytic.com")
    sender_name = os.environ.get("EMAIL_SENDER_NAME", "Hire-Lytics")

    # Create test email
    subject = "Hire-Lytics Test OTP"
    otp = "123456"
    html_body = f"""
    <h2>Test Email from {sender_name}</h2>
    <p>This is a test email to verify Resend configuration.</p>
    <p>Your test OTP is: <strong>{otp}</strong></p>
    <p>If you received this email, Resend is working correctly!</p>
    <p>Current date: March 28, 2026</p>
    """

    try:
        print(f"Sending test email to {test_email}...")

        response = resend.Emails.send({
            "from": f"{sender_name} <{email_from}>",
            "to": test_email,
            "subject": subject,
            "html": html_body
        })

        print("✅ Email sent successfully via Resend!")
        print(f"Response ID: {response.get('id', 'unknown')}")

    except Exception as e:
        print(f"❌ Resend email failed: {e}")
        print("Check your RESEND_API_KEY and try again")

if __name__ == "__main__":
    asyncio.run(test_resend_email())