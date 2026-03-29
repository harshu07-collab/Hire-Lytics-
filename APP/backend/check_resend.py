#!/usr/bin/env python3
"""
Check if Resend package is properly installed
"""
try:
    from resend import Resend
    print("✅ Resend package is installed and importable")
    print(f"Resend version: {Resend.__version__ if hasattr(Resend, '__version__') else 'unknown'}")
except ImportError as e:
    print("❌ Resend package is not installed or cannot be imported")
    print(f"Import error: {e}")

# Check environment variables
import os
from dotenv import load_dotenv
load_dotenv()

api_key = os.environ.get("RESEND_API_KEY", "")
if api_key:
    print(f"✅ RESEND_API_KEY is set (length: {len(api_key)})")
else:
    print("❌ RESEND_API_KEY is not set")

email_from = os.environ.get("EMAIL_FROM", "")
print(f"EMAIL_FROM: {email_from}")

test_email = os.environ.get("TEST_EMAIL", "")
print(f"TEST_EMAIL: {test_email}")