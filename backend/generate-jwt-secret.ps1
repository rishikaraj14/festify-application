# Generate JWT Secret for Railway Deployment
# Run this script to generate a secure JWT secret

Write-Host "`n=== JWT Secret Generator ===" -ForegroundColor Cyan
Write-Host "Generating a secure 64-character random string for JWT_SECRET...`n" -ForegroundColor Yellow

# Generate random secret
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

Write-Host "Your JWT Secret:" -ForegroundColor Green
Write-Host $secret -ForegroundColor White

Write-Host "`nCopy this and add it to Railway environment variables:" -ForegroundColor Yellow
Write-Host "JWT_SECRET=$secret" -ForegroundColor Cyan

Write-Host "`nSteps to add in Railway:" -ForegroundColor Yellow
Write-Host "1. Go to your Railway project" -ForegroundColor White
Write-Host "2. Click on your service" -ForegroundColor White
Write-Host "3. Go to 'Variables' tab" -ForegroundColor White
Write-Host "4. Click 'New Variable'" -ForegroundColor White
Write-Host "5. Add: JWT_SECRET=$secret" -ForegroundColor White

Write-Host "`n=== IMPORTANT ===" -ForegroundColor Red
Write-Host "Keep this secret safe and never commit it to Git!" -ForegroundColor Red
Write-Host "Store it securely in Railway environment variables only.`n" -ForegroundColor Red

# Optional: Copy to clipboard if available
try {
    Set-Clipboard -Value $secret
    Write-Host "✅ Secret copied to clipboard!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not copy to clipboard. Please copy manually." -ForegroundColor Yellow
}

Write-Host ""
