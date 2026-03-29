# ============================================================
# ROLLBACK SCRIPT - Remove Real Authentication
# Usage: .\rollback-auth.ps1
# ============================================================

Write-Host ""
Write-Host "============================================================"
Write-Host "AUTHENTICATION ROLLBACK SCRIPT" -ForegroundColor Cyan
Write-Host "============================================================"
Write-Host ""
Write-Host "This script will remove real authentication features"
Write-Host "and revert to dummy authentication."
Write-Host ""
Write-Host "Files that will be reverted:" -ForegroundColor Yellow
Write-Host "  - frontend/src/pages/Login.js"
Write-Host "  - frontend/src/pages/Signup.js"
Write-Host "  - frontend/src/contexts/AuthContext.js"
Write-Host "  - frontend/src/App.js"
Write-Host "  - backend/server.py"
Write-Host "  - backend/requirements.txt"
Write-Host "  - frontend/package.json"
Write-Host ""
Write-Host "Files that will be DELETED:" -ForegroundColor Red
Write-Host "  - backend/auth.py"
Write-Host "  - backend/auth_routes.py"
Write-Host "  - backend/email_service.py"
Write-Host "  - backend/supabase_service.py"
Write-Host ""

$confirm = Read-Host "Continue with rollback? (yes/no)"

if ($confirm -ne "yes" -and $confirm -ne "y") {
    Write-Host "Rollback cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Creating backup of current auth files..." -ForegroundColor Green

# Create backup directory
if (!(Test-Path "auth_rollback_backup")) {
    New-Item -ItemType Directory -Path "auth_rollback_backup" | Out-Null
}

# Backup new auth files
$filesToBackup = @(
    "APP\backend\auth.py",
    "APP\backend\auth_routes.py",
    "APP\backend\email_service.py",
    "APP\backend\supabase_service.py"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        Copy-Item $file "auth_rollback_backup\" -Force | Out-Null
    }
}

Write-Host "Backup created in: auth_rollback_backup\" -ForegroundColor Green
Write-Host ""

Write-Host "Removing authentication files..." -ForegroundColor Yellow

# Delete new auth files
$filesToDelete = @(
    "APP\backend\auth.py",
    "APP\backend\auth_routes.py",
    "APP\backend\email_service.py",
    "APP\backend\supabase_service.py"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✓ Deleted: $file"
    }
}

Write-Host ""
Write-Host "Note: Frontend and backend files still have authentication code." -ForegroundColor Yellow
Write-Host "If you used Git, you can restore them:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd APP" -ForegroundColor Cyan
Write-Host "   git restore frontend/src/pages/Login.js" -ForegroundColor Cyan
Write-Host "   git restore frontend/src/pages/Signup.js" -ForegroundColor Cyan
Write-Host "   git restore frontend/src/contexts/AuthContext.js" -ForegroundColor Cyan
Write-Host "   git restore frontend/src/App.js" -ForegroundColor Cyan
Write-Host "   git restore backend/server.py" -ForegroundColor Cyan
Write-Host "   git restore backend/requirements.txt" -ForegroundColor Cyan
Write-Host "   git restore frontend/package.json" -ForegroundColor Cyan
Write-Host ""

Write-Host ""
Write-Host "============================================================"
Write-Host "ROLLBACK COMPLETE" -ForegroundColor Green
Write-Host "============================================================"
Write-Host ""
Write-Host "Your backed up files are in: auth_rollback_backup\" -ForegroundColor Green
Write-Host "You can restore them if needed."
Write-Host ""
Read-Host "Press Enter to exit"
