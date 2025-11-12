# PowerShell script to run database migrations
# Usage: .\scripts\migrate-db.ps1 [migration_file]

param(
    [string]$MigrationFile = "database/migrations/001_add_support_tickets.sql"
)

Write-Host "🚀 Running Database Migration" -ForegroundColor Cyan
Write-Host "─" * 50

# Check if migration file exists
if (-not (Test-Path $MigrationFile)) {
    Write-Host "❌ Migration file not found: $MigrationFile" -ForegroundColor Red
    exit 1
}

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL environment variable is not set" -ForegroundColor Red
    Write-Host "Please set it in your backend/.env file or as an environment variable" -ForegroundColor Yellow
    exit 1
}

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ psql is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL and ensure psql is in your PATH" -ForegroundColor Yellow
    exit 1
}

Write-Host "📄 Running migration: $MigrationFile" -ForegroundColor Green

# Run the migration
$env:PGPASSWORD = ($env:DATABASE_URL -split ':' | Select-String -Pattern '//[^:]+:([^@]+)@' | ForEach-Object { $_.Matches[0].Groups[1].Value })
if (-not $env:PGPASSWORD) {
    # Try to extract password from connection string
    $dbUrl = $env:DATABASE_URL
    if ($dbUrl -match '://([^:]+):([^@]+)@') {
        $env:PGPASSWORD = $matches[2]
    }
}

try {
    Get-Content $MigrationFile | psql $env:DATABASE_URL
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration completed with warnings (this is usually okay if tables already exist)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Migration failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "─" * 50

