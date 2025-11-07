# Frontend API Integration Test Script
# Tests all API endpoints from frontend perspective

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FRONTEND API INTEGRATION TESTING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080"
$global:testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET"
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method $Method -UseBasicParsing -ErrorAction Stop
        $global:testResults += [PSCustomObject]@{
            Test = $Name
            Status = "PASS"
            StatusCode = $response.StatusCode
            Color = "Green"
        }
        Write-Host "[OK] " -ForegroundColor Green -NoNewline
        Write-Host "$Name - Status: $($response.StatusCode)"
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $global:testResults += [PSCustomObject]@{
            Test = $Name
            Status = "FAIL"
            StatusCode = $statusCode
            Color = "Red"
        }
        Write-Host "[FAIL] " -ForegroundColor Red -NoNewline
        Write-Host "$Name - Status: $statusCode"
    }
}

Write-Host ""
Write-Host "Testing Public Endpoints (No Auth Required)..." -ForegroundColor Yellow
Write-Host "=" * 50

Test-Endpoint "Health Check" "$baseUrl/api/hello"
Test-Endpoint "Get Categories" "$baseUrl/api/categories"
Test-Endpoint "Get Colleges" "$baseUrl/api/colleges"
Test-Endpoint "Get Events" "$baseUrl/api/events"
Test-Endpoint "Get Registrations" "$baseUrl/api/registrations"
Test-Endpoint "Get Teams" "$baseUrl/api/teams"
Test-Endpoint "Get Tickets" "$baseUrl/api/tickets"
Test-Endpoint "Get Payments" "$baseUrl/api/payments"
Test-Endpoint "Actuator Health" "$baseUrl/actuator/health"

Write-Host ""
Write-Host "Testing CORS Headers..." -ForegroundColor Yellow
Write-Host "=" * 50

try {
    $headers = @{
        'Origin' = 'http://localhost:9002'
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/api/categories" -Method GET -Headers $headers -UseBasicParsing
    
    $corsOrigin = $response.Headers['Access-Control-Allow-Origin']
    $corsCredentials = $response.Headers['Access-Control-Allow-Credentials']
    
    if ($corsOrigin -eq 'http://localhost:9002') {
        Write-Host "[OK] CORS Origin: $corsOrigin" -ForegroundColor Green
        $global:testResults += [PSCustomObject]@{
            Test = "CORS Origin Header"
            Status = "PASS"
            StatusCode = 200
            Color = "Green"
        }
    }
    else {
        Write-Host "[FAIL] CORS Origin: $corsOrigin (Expected: http://localhost:9002)" -ForegroundColor Red
        $global:testResults += [PSCustomObject]@{
            Test = "CORS Origin Header"
            Status = "FAIL"
            StatusCode = 200
            Color = "Red"
        }
    }
    
    if ($corsCredentials -eq 'true') {
        Write-Host "[OK] CORS Credentials: $corsCredentials" -ForegroundColor Green
    }
    else {
        Write-Host "[WARN] CORS Credentials: $corsCredentials" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "[FAIL] CORS Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    $global:testResults += [PSCustomObject]@{
        Test = "CORS Headers"
        Status = "FAIL"
        StatusCode = "N/A"
        Color = "Red"
    }
}

Write-Host ""
Write-Host "=" * 50
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 50

$passed = ($global:testResults | Where-Object { $_.Status -like "*PASS*" }).Count
$failed = ($global:testResults | Where-Object { $_.Status -like "*FAIL*" }).Count
$total = $global:testResults.Count

Write-Host ""
$global:testResults | ForEach-Object {
    Write-Host "[$($_.Status)]" -ForegroundColor $_.Color -NoNewline
    Write-Host " - $($_.Test) (Status: $($_.StatusCode))"
}

Write-Host ""
Write-Host "Total Tests: $total" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "Success Rate: $([math]::Round(($passed/$total)*100, 2))%" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Frontend can successfully communicate with backend!" -ForegroundColor Green
}
else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "Please check the backend configuration and restart if necessary." -ForegroundColor Yellow
}

Write-Host ""
