# Development Server Startup Script for Hire-Lytics

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hire-Lytics Development Environment  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend virtual environment exists
$backendVenv = "D:\Hire-Lytics\APP\backend\venv"
if (-Not (Test-Path $backendVenv)) {
    Write-Host "Backend virtual environment not found. Creating..." -ForegroundColor Yellow
    cd D:\Hire-Lytics\APP\backend
    python -m venv venv
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    .\venv\Scripts\activate
    pip install -r requirements.txt
    deactivate
}

# Check if frontend node_modules exists
$frontendModules = "D:\Hire-Lytics\APP\frontend\node_modules"
if (-Not (Test-Path $frontendModules)) {
    Write-Host "Frontend dependencies not found. Installing..." -ForegroundColor Yellow
    cd D:\Hire-Lytics\APP\frontend
    npm install
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:8000" -ForegroundColor Cyan

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Hire-Lytics\APP\backend; .\venv\Scripts\activate; python server.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Hire-Lytics\APP\frontend; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servers Started Successfully!        " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""
