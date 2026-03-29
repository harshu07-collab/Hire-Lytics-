@REM ============================================================
@REM ROLLBACK SCRIPT - Remove Real Authentication
@REM Usage: rollback-auth.bat
@REM ============================================================
@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo AUTHENTICATION ROLLBACK SCRIPT
echo ============================================================
echo.
echo This script will remove real authentication features
echo and revert to dummy authentication.
echo.
echo Files that will be reverted:
echo   - frontend/src/pages/Login.js
echo   - frontend/src/pages/Signup.js
echo   - frontend/src/contexts/AuthContext.js
echo   - frontend/src/App.js
echo   - backend/server.py
echo   - backend/requirements.txt
echo   - frontend/package.json
echo.
echo Files that will be DELETED:
echo   - backend/auth.py
echo   - backend/auth_routes.py
echo   - backend/email_service.py
echo   - backend/supabase_service.py
echo.

set /p confirm="Continue with rollback? (yes/no): "
if /i not "%confirm%"=="yes" (
    echo Rollback cancelled.
    exit /b 0
)

echo.
echo Creating backup of current auth files...
mkdir auth_rollback_backup 2>nul

REM Backup new auth files
if exist "APP\backend\auth.py" copy "APP\backend\auth.py" "auth_rollback_backup\" >nul
if exist "APP\backend\auth_routes.py" copy "APP\backend\auth_routes.py" "auth_rollback_backup\" >nul
if exist "APP\backend\email_service.py" copy "APP\backend\email_service.py" "auth_rollback_backup\" >nul
if exist "APP\backend\supabase_service.py" copy "APP\backend\supabase_service.py" "auth_rollback_backup\" >nul

echo Backup created in: auth_rollback_backup\
echo.

echo Removing authentication files...

REM Delete new auth files
if exist "APP\backend\auth.py" (
    del "APP\backend\auth.py"
    echo ✓ Deleted: backend/auth.py
)

if exist "APP\backend\auth_routes.py" (
    del "APP\backend\auth_routes.py"
    echo ✓ Deleted: backend/auth_routes.py
)

if exist "APP\backend\email_service.py" (
    del "APP\backend\email_service.py"
    echo ✓ Deleted: backend/email_service.py
)

if exist "APP\backend\supabase_service.py" (
    del "APP\backend\supabase_service.py"
    echo ✓ Deleted: backend/supabase_service.py
)

echo.
echo Note: Frontend and backend files still have authentication code.
echo If you used Git, you can restore them:
echo.
echo   cd APP
echo   git restore frontend/src/pages/Login.js
echo   git restore frontend/src/pages/Signup.js
echo   git restore frontend/src/contexts/AuthContext.js
echo   git restore frontend/src/App.js
echo   git restore backend/server.py
echo   git restore backend/requirements.txt
echo   git restore frontend/package.json
echo.

echo.
echo ============================================================
echo ROLLBACK COMPLETE
echo ============================================================
echo.
echo Your backed up files are in: auth_rollback_backup\
echo You can restore them if needed.
echo.
pause
