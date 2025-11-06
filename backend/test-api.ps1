# ===================================
# FESTIFY BACKEND API TEST SCRIPT
# ===================================

$baseUrl = "http://localhost:8080/api"
$testsPassed = 0
$testsFailed = 0

Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "  FESTIFY BACKEND API TESTING`n" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

function Test-API {
    param([string]$Name, [string]$Url)
    Write-Host "[TEST] $Name" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 5
        Write-Host "  ✓ SUCCESS`n" -ForegroundColor Green
        $script:testsPassed++
        return $response
    } catch {
        Write-Host "  ✗ FAILED: $($_.Exception.Message)`n" -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
}

Write-Host "1. PUBLIC ENDPOINTS`n" -ForegroundColor Cyan

Test-API -Name "Hello World" -Url "$baseUrl/hello"
$categories = Test-API -Name "Get Categories" -Url "$baseUrl/categories"
$colleges = Test-API -Name "Get Colleges" -Url "$baseUrl/colleges"
$events = Test-API -Name "Get Events" -Url "$baseUrl/events"

if ($categories) { Write-Host "  Found $($categories.Count) categories`n" -ForegroundColor Magenta }
if ($colleges) { Write-Host "  Found $($colleges.Count) colleges`n" -ForegroundColor Magenta }
if ($events) { Write-Host "  Found $($events.Count) events`n" -ForegroundColor Magenta }

Write-Host "`n2. ENTITY ENDPOINTS`n" -ForegroundColor Cyan

if ($categories -and $categories.Count -gt 0) {
    Test-API -Name "Get Category by ID" -Url "$baseUrl/categories/$($categories[0].id)"
}

if ($events -and $events.Count -gt 0) {
    Test-API -Name "Get Event by ID" -Url "$baseUrl/events/$($events[0].id)"
}

Test-API -Name "Get Registrations" -Url "$baseUrl/registrations"
Test-API -Name "Get Teams" -Url "$baseUrl/teams"
Test-API -Name "Get Tickets" -Url "$baseUrl/tickets"
Test-API -Name "Get Payments" -Url "$baseUrl/payments"

Write-Host "`n3. HEALTH CHECK`n" -ForegroundColor Cyan
Test-API -Name "Actuator Health" -Url "http://localhost:8080/actuator/health"

Write-Host "`n====================================`n" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "  Total: $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host "  Passed: $testsPassed" -ForegroundColor Green
Write-Host "  Failed: $testsFailed" -ForegroundColor Red
Write-Host "`n====================================`n" -ForegroundColor Cyan

