Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FESTIFY BACKEND API TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$base = "http://localhost:8080"
$passed = 0
$failed = 0

function TestAPI($name, $url) {
    Write-Host "[TEST] $name" -ForegroundColor Yellow
    try {
        $result = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5
        Write-Host "  SUCCESS" -ForegroundColor Green
        $script:passed++
        return $result
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

Write-Host "Testing Public Endpoints..." -ForegroundColor Cyan
TestAPI "Hello" "$base/api/hello"
$cats = TestAPI "Categories" "$base/api/categories"
$colls = TestAPI "Colleges" "$base/api/colleges"
$evts = TestAPI "Events" "$base/api/events"

if ($cats) { Write-Host "  -> Found $($cats.Count) categories" -ForegroundColor Magenta }
if ($colls) { Write-Host "  -> Found $($colls.Count) colleges" -ForegroundColor Magenta }
if ($evts) { Write-Host "  -> Found $($evts.Count) events" -ForegroundColor Magenta }

Write-Host ""
Write-Host "Testing Entity Endpoints..." -ForegroundColor Cyan
TestAPI "Registrations" "$base/api/registrations"
TestAPI "Teams" "$base/api/teams"
TestAPI "Tickets" "$base/api/tickets"
TestAPI "Payments" "$base/api/payments"

Write-Host ""
Write-Host "Testing Health..." -ForegroundColor Cyan
TestAPI "Actuator" "$base/actuator/health"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESULTS" -ForegroundColor Cyan
Write-Host "  Total: $($passed + $failed)" -ForegroundColor White
Write-Host "  Passed: $passed" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
