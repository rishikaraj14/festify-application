@echo off
REM mvnw.cmd - prefer system mvn, otherwise use bundled mvn in workspace if present.
SETLOCAL ENABLEDELAYEDEXPANSION

:: If M2_HOME is set, use it
if defined M2_HOME (
  "%M2_HOME%\bin\mvn" %*
  goto :EOF
)
:: If mvn is on PATH, use it
where mvn >nul 2>nul
if %ERRORLEVEL%==0 (
  mvn %*
  goto :EOF
)
:: Try to use bundled mvn located relative to this script (common workspace layout)
set SCRIPT_DIR=%~dp0
set BUNDLED="%SCRIPT_DIR%maven-mvnd-1.0.3-windows-amd64\maven-mvnd-1.0.3-windows-amd64\mvn\bin\mvn.cmd"
if exist %BUNDLED% (
  %BUNDLED% %*
  goto :EOF
)
echo Maven not found on PATH, M2_HOME not set, and bundled mvn not found at %BUNDLED%.
echo Please install Maven or place a bundled Maven at that path.
exit /b 1
