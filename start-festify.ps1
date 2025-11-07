<#
.SYNOPSIS
    Festify Application Launcher
    
.DESCRIPTION
    This script launches both the backend (Spring Boot) and frontend (Next.js) servers
    in separate PowerShell windows for easy development.
    
.NOTES
    Author: Festify Team
    Date: 2025-11-07
#>

# Set error action preference
$ErrorActionPreference = "Stop"

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Define paths
$backendDir = Join-Path $scriptDir "backend"
$frontendDir = Join-Path $scriptDir "frontend\festify"
$backendJar = Join-Path $backendDir "target\festify-backend-0.0.1-SNAPSHOT.jar"

# Check if backend JAR exists
if (-not (Test-Path $backendJar)) {
    Write-Host "ERROR: Backend JAR not found at: $backendJar" -ForegroundColor Red
    Write-Host "Please build the backend first using: cd backend && mvnd clean package" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if frontend directory exists
if (-not (Test-Path $frontendDir)) {
    Write-Host "ERROR: Frontend directory not found at: $frontendDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "    FESTIFY APPLICATION LAUNCHER" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Backend environment variables
$backendEnv = @{
    JWT_SECRET = "79f7d1e7f25aa021af3ad8e56acbb8f3fff9888f67a625585d658aa0335cf0a8"
    DB_URL = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0"
    DB_USER = "postgres.pnekjnwarkpgrlsntaor"
    DB_PASS = "festify@4578"
    SMTP_USER = "noreply.festify01@gmail.com"
    SMTP_PASS = "festify@4578"
    SMTP_FROM = "noreply.festify01@gmail.com"
    ADMIN_EMAIL = "admin@festify.com"
    ADMIN_PASS = "Admin@12345"
}

# Build backend command
$backendCommand = "cd '$backendDir'; "
foreach ($key in $backendEnv.Keys) {
    $backendCommand += "`$env:$key='$($backendEnv[$key])'; "
}
$backendCommand += "Write-Host ''; Write-Host '=====================================' -ForegroundColor Green; "
$backendCommand += "Write-Host '  FESTIFY BACKEND SERVER' -ForegroundColor Green; "
$backendCommand += "Write-Host '  Port: 8080' -ForegroundColor Green; "
$backendCommand += "Write-Host '=====================================' -ForegroundColor Green; Write-Host ''; "
$backendCommand += "java -jar target\festify-backend-0.0.1-SNAPSHOT.jar"

# Build frontend command
$frontendCommand = "cd '$frontendDir'; "
$frontendCommand += "Write-Host ''; Write-Host '=====================================' -ForegroundColor Magenta; "
$frontendCommand += "Write-Host '  FESTIFY FRONTEND SERVER' -ForegroundColor Magenta; "
$frontendCommand += "Write-Host '  Port: 9002' -ForegroundColor Magenta; "
$frontendCommand += "Write-Host '=====================================' -ForegroundColor Magenta; Write-Host ''; "
$frontendCommand += "npm run dev"

Write-Host "[1/2] Starting Backend Server (Port 8080)..." -ForegroundColor Yellow
Start-Sleep -Milliseconds 500

# Launch backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

Write-Host "[2/2] Starting Frontend Server (Port 9002)..." -ForegroundColor Yellow
Start-Sleep -Milliseconds 500

# Launch frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand

Write-Host ""
Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:9002" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the servers, close the respective PowerShell windows or press Ctrl+C in them." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to close this launcher window"
