#!/usr/bin/env python3
"""
Inspect the resend package structure
"""
import sys
import os

# Add the virtual environment path
venv_path = os.path.join(os.getcwd(), 'venv', 'Lib', 'site-packages')
sys.path.insert(0, venv_path)

print("Checking resend package...")

try:
    import resend
    print("✅ resend imported successfully")
    print(f"resend.__file__: {resend.__file__}")
    print(f"resend attributes: {dir(resend)}")

    # Check for version
    print(f"resend version: {getattr(resend, '__version__', 'unknown')}")

    # Check if Resend class exists
    if hasattr(resend, 'Resend'):
        print("✅ resend.Resend exists")
        print(f"resend.Resend: {resend.Resend}")
    else:
        print("❌ resend.Resend does not exist")

    # Check for other possible classes
    possible_classes = ['Client', 'API', 'Email', 'ResendClient']
    for cls in possible_classes:
        if hasattr(resend, cls):
            print(f"✅ resend.{cls} exists: {getattr(resend, cls)}")

    # Try to check submodules
    try:
        import resend.api
        print("✅ resend.api imported")
        print(f"resend.api attributes: {dir(resend.api)}")
    except ImportError as e:
        print(f"❌ resend.api import failed: {e}")

    try:
        import resend.client
        print("✅ resend.client imported")
        print(f"resend.client attributes: {dir(resend.client)}")
    except ImportError as e:
        print(f"❌ resend.client import failed: {e}")

except ImportError as e:
    print(f"❌ resend import failed: {e}")

# Check pip info
import subprocess
try:
    result = subprocess.run([sys.executable, '-m', 'pip', 'show', 'resend'],
                          capture_output=True, text=True, cwd=os.getcwd())
    print("\n--- Pip show resend ---")
    print(result.stdout)
    if result.stderr:
        print("Errors:", result.stderr)
except Exception as e:
    print(f"Could not run pip show: {e}")