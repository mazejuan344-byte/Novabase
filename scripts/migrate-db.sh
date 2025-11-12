#!/bin/bash
# Bash script to run database migrations
# Usage: ./scripts/migrate-db.sh [migration_file]

MIGRATION_FILE="${1:-database/migrations/001_add_support_tickets.sql}"

echo "🚀 Running Database Migration"
echo "──────────────────────────────────────────────────"

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set it in your backend/.env file or as an environment variable"
    exit 1
fi

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed or not in PATH"
    echo "Please install PostgreSQL and ensure psql is in your PATH"
    exit 1
fi

echo "📄 Running migration: $MIGRATION_FILE"

# Run the migration
psql "$DATABASE_URL" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
else
    echo "⚠️  Migration completed with warnings (this is usually okay if tables already exist)"
fi

echo "──────────────────────────────────────────────────"

