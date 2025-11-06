# Load environment variables from .env file and start the backend
Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan

# Read .env file and set environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.+?)\s*$') {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
        Write-Host "  Set $name" -ForegroundColor Green
    }
}

Write-Host "`nStarting Festify Backend Server..." -ForegroundColor Cyan
Write-Host "Server will run on http://localhost:8080" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Start the Java application
java -jar target\festify-backend-0.0.1-SNAPSHOT.jar
