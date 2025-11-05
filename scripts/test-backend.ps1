# Test backend health endpoint

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "Testing backend health endpoint..." -ForegroundColor Green
Write-Host "URL: $BackendUrl/api/health" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/health" -Method Get
    Write-Host "✓ Backend is healthy!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Backend health check failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. Backend is deployed and running" -ForegroundColor Yellow
    Write-Host "  2. URL is correct (include https://)" -ForegroundColor Yellow
    Write-Host "  3. Check Render logs for errors" -ForegroundColor Yellow
}



