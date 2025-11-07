<#
.SYNOPSIS
    Festify Application Launcher - Robust Version
    
.DESCRIPTION
    This script launches both the backend (Spring Boot) and frontend (Next.js) servers
    in separate PowerShell windows. It automatically detects and kills existing processes
    before starting new ones for clean restarts.
    
.NOTES
    Author: Festify Team
    Date: 2025-11-07
    Version: 2.0 (Robust Edition)
#>

# Set error action preference
$ErrorActionPreference = "Continue"

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Define paths
$backendDir = Join-Path $scriptDir "backend"
$frontendDir = Join-Path $scriptDir "frontend\festify"
$backendJar = Join-Path $backendDir "target\festify-backend-0.0.1-SNAPSHOT.jar"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  FESTIFY APPLICATION LAUNCHER v2.0" -ForegroundColor Cyan
Write-Host "  (Robust Process Management)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# ===================================
# Function: Kill processes by port
# ===================================
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    Write-Host "Checking port $Port for existing $Name processes..." -ForegroundColor Yellow
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        
        if ($connections) {
            foreach ($conn in $connections) {
                $processId = $conn.OwningProcess
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                
                if ($process) {
                    Write-Host "  Found: $($process.ProcessName) (PID: $processId)" -ForegroundColor Red
                    Write-Host "  Stopping process..." -ForegroundColor Yellow
                    
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 2
                    
                    # Verify it stopped
                    $stillRunning = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    if ($stillRunning) {
                        Write-Host "  Force killing process..." -ForegroundColor Red
                        taskkill /F /PID $processId 2>&1 | Out-Null
                    }
                    
                    Write-Host "  Process stopped successfully!" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "  Port $Port is free" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  No processes found on port $Port" -ForegroundColor Green
    }
    
    Write-Host ""
}

# ===================================
# Function: Kill processes by name pattern
# ===================================
function Stop-ProcessByName {
    param([string]$Pattern, [string]$Description)
    
    Write-Host "Checking for existing $Description processes..." -ForegroundColor Yellow
    
    $processes = Get-Process | Where-Object { 
        $_.ProcessName -like "*$Pattern*" -or 
        $_.MainWindowTitle -like "*$Pattern*"
    }
    
    if ($processes) {
        foreach ($proc in $processes) {
            Write-Host "  Found: $($proc.ProcessName) (PID: $($proc.Id))" -ForegroundColor Red
            Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            Write-Host "  Stopped!" -ForegroundColor Green
        }
    } else {
        Write-Host "  No $Description processes found" -ForegroundColor Green
    }
    
    Write-Host ""
}

# ===================================
# Step 1: Clean up existing processes
# ===================================
Write-Host "[STEP 1] Cleaning up existing processes..." -ForegroundColor Magenta
Write-Host "=" * 50
Write-Host ""

# Kill backend processes (port 8080)
Stop-ProcessOnPort -Port 8080 -Name "Backend"

# Kill frontend processes (port 9002)
Stop-ProcessOnPort -Port 9002 -Name "Frontend"

# Additional cleanup for Java processes running festify
Write-Host "Checking for orphaned Java processes..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*festify-backend*" -or
    $_.MainWindowTitle -like "*festify*"
}

if ($javaProcesses) {
    foreach ($proc in $javaProcesses) {
        Write-Host "  Stopping Java process (PID: $($proc.Id))..." -ForegroundColor Yellow
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  Cleaned up!" -ForegroundColor Green
}
Write-Host ""

# Additional cleanup for Node processes
Write-Host "Checking for orphaned Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*festify*" -or
    $_.MainWindowTitle -like "*festify*"
}

if ($nodeProcesses) {
    foreach ($proc in $nodeProcesses) {
        Write-Host "  Stopping Node process (PID: $($proc.Id))..." -ForegroundColor Yellow
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  Cleaned up!" -ForegroundColor Green
}
Write-Host ""

# Wait for ports to be fully released
Write-Host "Waiting for ports to be released..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host "Ready!" -ForegroundColor Green
Write-Host ""

# ===================================
# Step 2: Validate prerequisites
# ===================================
Write-Host "[STEP 2] Validating prerequisites..." -ForegroundColor Magenta
Write-Host "=" * 50
Write-Host ""

# Check if backend JAR exists
if (-not (Test-Path $backendJar)) {
    Write-Host "ERROR: Backend JAR not found!" -ForegroundColor Red
    Write-Host "Path: $backendJar" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Building backend now..." -ForegroundColor Yellow
    
    try {
        Push-Location $backendDir
        & "c:\Users\jenny\Downloads\New folder\Festify Project\maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\bin\mvnd.cmd" clean package -DskipTests
        Pop-Location
        
        if (-not (Test-Path $backendJar)) {
            Write-Host "ERROR: Build failed!" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
        
        Write-Host "Build successful!" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: Failed to build backend: $_" -ForegroundColor Red
        Pop-Location
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "Backend JAR: OK" -ForegroundColor Green

# Check if frontend directory exists
if (-not (Test-Path $frontendDir)) {
    Write-Host "ERROR: Frontend directory not found at: $frontendDir" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Frontend directory: OK" -ForegroundColor Green
Write-Host ""

# ===================================
# Step 3: Prepare launch commands
# ===================================
Write-Host "[STEP 3] Preparing launch commands..." -ForegroundColor Magenta
Write-Host "=" * 50
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

# Build backend command with better formatting
$backendCommand = @"
Set-Location '$backendDir'
`$Host.UI.RawUI.WindowTitle = 'Festify Backend - Port 8080'
Write-Host ''
Write-Host '=====================================' -ForegroundColor Green
Write-Host '  FESTIFY BACKEND SERVER' -ForegroundColor Green
Write-Host '  Port: 8080' -ForegroundColor Green
Write-Host '  Press Ctrl+C to stop' -ForegroundColor Yellow
Write-Host '=====================================' -ForegroundColor Green
Write-Host ''
"@

foreach ($key in $backendEnv.Keys) {
    $backendCommand += "`n`$env:$key = '$($backendEnv[$key])'"
}

$backendCommand += @"

`nWrite-Host 'Starting backend...' -ForegroundColor Cyan
java -jar target\festify-backend-0.0.1-SNAPSHOT.jar
"@

# Build frontend command with better formatting
$frontendCommand = @"
Set-Location '$frontendDir'
`$Host.UI.RawUI.WindowTitle = 'Festify Frontend - Port 9002'
Write-Host ''
Write-Host '=====================================' -ForegroundColor Magenta
Write-Host '  FESTIFY FRONTEND SERVER' -ForegroundColor Magenta
Write-Host '  Port: 9002' -ForegroundColor Magenta
Write-Host '  Press Ctrl+C to stop' -ForegroundColor Yellow
Write-Host '=====================================' -ForegroundColor Magenta
Write-Host ''
Write-Host 'Starting frontend...' -ForegroundColor Cyan
npm run dev
"@

Write-Host "Commands prepared!" -ForegroundColor Green
Write-Host ""

# ===================================
# Step 4: Launch servers
# ===================================
Write-Host "[STEP 4] Launching servers..." -ForegroundColor Magenta
Write-Host "=" * 50
Write-Host ""

Write-Host "Starting Backend Server (Port 8080)..." -ForegroundColor Yellow
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand
    Write-Host "  Backend window opened!" -ForegroundColor Green
}
catch {
    Write-Host "  ERROR: Failed to start backend: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server (Port 9002)..." -ForegroundColor Yellow
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand
    Write-Host "  Frontend window opened!" -ForegroundColor Green
}
catch {
    Write-Host "  ERROR: Failed to start frontend: $_" -ForegroundColor Red
}

Write-Host ""

# ===================================
# Step 5: Final status
# ===================================
Write-Host "=" * 50
Write-Host "LAUNCH COMPLETE!" -ForegroundColor Green
Write-Host "=" * 50
Write-Host ""
Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:9002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting for servers to initialize..." -ForegroundColor Yellow
Write-Host "  Backend: ~10-15 seconds" -ForegroundColor Gray
Write-Host "  Frontend: ~5-10 seconds" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop servers:" -ForegroundColor Yellow
Write-Host "  - Close the server windows, or" -ForegroundColor Gray
Write-Host "  - Press Ctrl+C in each window" -ForegroundColor Gray
Write-Host ""
Write-Host "To restart:" -ForegroundColor Yellow
Write-Host "  - Just run this script again!" -ForegroundColor Gray
Write-Host "  - It will auto-cleanup and restart" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to close this launcher window"
