@echo off
REM Festify Application Launcher
REM This batch file launches the PowerShell launcher script

echo Starting Festify Application...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start-festify.ps1"
pause
