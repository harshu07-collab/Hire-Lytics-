#!/usr/bin/env python3
"""
Check what's available in the resend package
"""
import sys
sys.path.insert(0, 'venv/Lib/site-packages')

try:
    import resend
    print("✅ resend package imported successfully")
    print(f"resend module attributes: {dir(resend)}")

    # Check what's in __init__.py
    print(f"resend.__file__: {resend.__file__}")

    # Try different import methods
    try:
        from resend import Resend
        print("✅ from resend import Resend works")
    except ImportError as e:
        print(f"❌ from resend import Resend failed: {e}")

    try:
        import resend as rs
        print(f"resend version: {getattr(rs, '__version__', 'unknown')}")
    except:
        pass

except ImportError as e:
    print(f"❌ Cannot import resend: {e}")

# Check pip show resend
import subprocess
try:
    result = subprocess.run([sys.executable, '-m', 'pip', 'show', 'resend'],
                          capture_output=True, text=True)
    print("\nPip show resend:")
    print(result.stdout)
except:
    print("Could not run pip show")