#!/usr/bin/env python
"""
Test Script - Verify Authentication Setup
Run this to check if everything is configured correctly
"""

import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
APP_DIR = BASE_DIR / "APP"

def _configure_utf8_output():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("[ERROR] Python 3.8+ required")
        return False
    print(f"[OK] Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_backend_files():
    """Check if backend files exist"""
    files = [
        APP_DIR / "backend/server.py",
        APP_DIR / "backend/auth.py",
        APP_DIR / "backend/auth_routes.py",
        APP_DIR / "backend/email_service.py",
        APP_DIR / "backend/supabase_service.py",
        APP_DIR / "backend/requirements.txt"
    ]
    
    print("\nBackend Files:")
    all_exist = True
    for file in files:
        if file.exists():
            size = file.stat().st_size
            rel = file.relative_to(BASE_DIR)
            print(f"  [OK] {rel} ({size} bytes)")
        else:
            rel = file.relative_to(BASE_DIR)
            print(f"  [MISSING] {rel}")
            all_exist = False
    
    return all_exist

def check_frontend_files():
    """Check if frontend files exist"""
    files = [
        APP_DIR / "frontend/src/App.js",
        APP_DIR / "frontend/src/contexts/AuthContext.js",
        APP_DIR / "frontend/src/pages/Login.js",
        APP_DIR / "frontend/src/pages/Signup.js",
        APP_DIR / "frontend/src/styles/Auth.css",
        APP_DIR / "frontend/package.json"
    ]
    
    print("\nFrontend Files:")
    all_exist = True
    for file in files:
        if file.exists():
            size = file.stat().st_size
            rel = file.relative_to(BASE_DIR)
            print(f"  [OK] {rel} ({size} bytes)")
        else:
            rel = file.relative_to(BASE_DIR)
            print(f"  [MISSING] {rel}")
            all_exist = False
    
    return all_exist

def check_env_files():
    """Check environment configuration"""
    print("\nEnvironment:")
    
    env_file = APP_DIR / ".env"
    env_example = APP_DIR / ".env.example"
    
    if env_file.exists():
        print("  [OK] APP/.env exists")
        # Check required keys
        with open(env_file, 'r') as f:
            content = f.read()
            required_keys = [
                "REACT_APP_BACKEND_URL",
                "JWT_SECRET",
                "GROQ_API_KEY"
            ]
            for key in required_keys:
                if key in content:
                    print(f"    [OK] {key} configured")
                else:
                    print(f"    [WARN] {key} not configured")
    else:
        print("  [WARN] APP/.env not found (create from APP/.env.example)")
    
    if env_example.exists():
        print("  [OK] APP/.env.example exists")
    else:
        print("  [MISSING] APP/.env.example")
    
    return True

def check_dependencies():
    """Check if key dependencies can be imported"""
    print("\nDependencies:")
    
    backend_deps = {
        "fastapi": "Backend framework",
        "pydantic": "Data validation",
        "jwt": "Token handling",
        "bcrypt": "Password hashing",
    }
    
    for module, desc in backend_deps.items():
        try:
            __import__(module)
            print(f"  [OK] {module} ({desc})")
        except ImportError:
            print(f"  [MISSING] {module} not installed - run: pip install -r APP/backend/requirements.txt")
    
    return True

def check_database_schema():
    """Check if database table is created"""
    print("\nDatabase:")
    print("  [WARN] Requires Supabase setup (manual)")
    print("  See APP/AUTHENTICATION_SETUP.md for SQL schema")
    return True

def check_documentation():
    """Check if documentation files exist"""
    docs = [
        BASE_DIR / "QUICK_AUTH_START.md",
        APP_DIR / "AUTHENTICATION_SETUP.md",
        BASE_DIR / "IMPLEMENTATION_SUMMARY_AUTH.md"
    ]
    
    print("\nDocumentation:")
    all_exist = True
    for doc in docs:
        if doc.exists():
            rel = doc.relative_to(BASE_DIR)
            print(f"  [OK] {rel}")
        else:
            rel = doc.relative_to(BASE_DIR)
            print(f"  [MISSING] {rel}")
            all_exist = False
    
    return all_exist

def check_git():
    """Check git status"""
    git_dir = BASE_DIR / ".git"
    
    print("\nVersion Control:")
    if git_dir.exists():
        print("  [OK] Git repository found")
        print("  Run: git status")
    else:
        print("  [WARN] Not a git repository (optional)")
    
    return True

def main():
    """Run all checks"""
    _configure_utf8_output()
    print("\n" + "="*60)
    print("AUTHENTICATION SETUP VERIFICATION")
    print("="*60)
    
    checks = [
        ("Python Version", check_python_version),
        ("Backend Files", check_backend_files),
        ("Frontend Files", check_frontend_files),
        ("Environment Files", check_env_files),
        ("Dependencies", check_dependencies),
        ("Database Schema", check_database_schema),
        ("Documentation", check_documentation),
        ("Git Repository", check_git),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"  [ERROR] {str(e)}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "[PASS]" if result else "[CHECK]"
        print(f"{status}: {name}")
    
    print("\n" + "="*60)
    
    if passed == total:
        print("ALL CHECKS PASSED - Ready to start!")
        print("\nNext Steps:")
        print("   1. Read: QUICK_AUTH_START.md")
        print("   2. Start backend: cd APP/backend && python server.py")
        print("   3. Start frontend: cd APP/frontend && npm start")
        print("   4. Test at: http://localhost:3000/signup")
    else:
        print(f"{total - passed} checks need attention")
        print("\nFor help:")
        print("   - Read: APP/AUTHENTICATION_SETUP.md")
        print("   - Check: QUICK_AUTH_START.md")
        print("   - Debug: Browser console (F12)")
    
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
