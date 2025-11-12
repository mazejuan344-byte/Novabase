# Database Migrations

This directory contains database migration scripts for updating the database schema.

## Running Migrations

### Option 1: Using the Migration Runner (Recommended)

```bash
# From the project root
node database/migrations/run_migration.js database/migrations/001_add_support_tickets.sql
```

### Option 2: Using psql directly

```bash
# Local development
psql -U postgres -d cryptex -f database/migrations/001_add_support_tickets.sql

# Or with connection string
psql $DATABASE_URL -f database/migrations/001_add_support_tickets.sql
```

### Option 3: Using Render/Railway Shell

1. Connect to your database shell
2. Copy and paste the SQL from the migration file
3. Execute it

## Available Migrations

### 001_add_support_tickets.sql
- Adds `support_tickets` table for customer support chat functionality
- Creates necessary indexes for performance
- Safe to run multiple times (uses `IF NOT EXISTS`)

## Checking Migration Status

To check if the support_tickets table exists:

```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'support_tickets'
);
```

## Rollback

If you need to rollback a migration, you can drop the table:

```sql
DROP TABLE IF EXISTS support_tickets CASCADE;
```

**⚠️ Warning:** This will delete all support tickets. Only use this in development.

## Adding New Migrations

1. Create a new migration file: `002_migration_name.sql`
2. Use `IF NOT EXISTS` clauses to make migrations idempotent
3. Test the migration on a development database first
4. Document the migration in this README

