# Generate a secure JWT secret for backend deployment

Write-Host "Generating JWT Secret..." -ForegroundColor Green
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
Write-Host ""
Write-Host "Your JWT_SECRET:" -ForegroundColor Yellow
Write-Host $jwtSecret -ForegroundColor Cyan
Write-Host ""
Write-Host "Copy this value and use it as your JWT_SECRET environment variable." -ForegroundColor Green
Write-Host ""

# Copy to clipboard
$jwtSecret | Set-Clipboard
Write-Host "✓ Secret has been copied to your clipboard!" -ForegroundColor Green





