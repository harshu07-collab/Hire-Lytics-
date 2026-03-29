#!/usr/bin/env python3
"""
Test script to verify email service configuration (SMTP via Gmail)
"""
import asyncio
import os
from dotenv import load_dotenv
from email_service import send_otp_email

load_dotenv()

async def test_email():
    """Test email sending"""
    print("Testing email service (SMTP via Gmail)...")

    # Test OTP email
    test_email = os.environ.get("TEST_EMAIL", "your-email@example.com")
    test_otp = "123456"

    print(f"Sending test OTP email to {test_email}...")
    success = await send_otp_email(
        to=test_email,
        otp=test_otp,
        name="Test User",
        email_type="signup"
    )

    if success:
        print("✅ Email sent successfully!")
        print(f"Check {test_email} for the OTP email.")
    else:
        print("❌ Email sending failed.")
        print("Check your Gmail App Password in .env file.")

if __name__ == "__main__":
    asyncio.run(test_email())