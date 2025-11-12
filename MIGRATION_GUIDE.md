# Database Migration Guide - Support System

This guide explains how to update your database to add the support tickets functionality.

## Quick Start

### Option 1: Using npm script (Recommended)

```bash
# Check if support_tickets table exists
npm run migrate:check

# Run the migration
npm run migrate
```

### Option 2: Using psql directly

```bash
# Local development
psql -U postgres -d cryptex -f database/migrations/001_add_support_tickets.sql

# With connection string
psql $DATABASE_URL -f database/migrations/001_add_support_tickets.sql
```

### Option 3: Using PowerShell script (Windows)

```powershell
.\scripts\migrate-db.ps1
```

### Option 4: Using Bash script (Linux/Mac)

```bash
chmod +x scripts/migrate-db.sh
./scripts/migrate-db.sh
```

### Option 5: Using Node.js migration runner

```bash
node database/migrations/run_migration.js database/migrations/001_add_support_tickets.sql
```

## What the Migration Does

The migration adds:

1. **`support_tickets` table** with the following fields:
   - `id` - Primary key
   - `user_id` - Reference to the user who created the ticket
   - `subject` - Ticket subject/title
   - `message` - User's message
   - `status` - Ticket status (open, in_progress, resolved, closed)
   - `priority` - Ticket priority (low, medium, high, urgent)
   - `admin_response` - Admin's response to the ticket
   - `admin_id` - Reference to the admin who responded
   - `created_at` - Creation timestamp
   - `updated_at` - Last update timestamp

2. **Indexes** for better performance:
   - Index on `user_id`
   - Index on `status`
   - Index on `created_at`
   - Index on `admin_id`

## Verifying the Migration

After running the migration, verify it worked:

```sql
-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'support_tickets'
);

-- View table structure
\d support_tickets

-- Or using SQL
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'support_tickets';
```

## Troubleshooting

### Error: Table already exists

If you see an error that the table already exists, this is usually safe to ignore. The migration uses `IF NOT EXISTS` clauses, so it's idempotent (safe to run multiple times).

### Error: Permission denied

Make sure your database user has the necessary permissions:
- `CREATE TABLE`
- `CREATE INDEX`
- `ALTER TABLE` (if needed)

### Error: Connection refused

Check that:
1. Your database is running
2. `DATABASE_URL` is set correctly in your `.env` file
3. Your database credentials are correct

### Error: Relation does not exist (users table)

Make sure you've run the main schema first:
```bash
psql -U postgres -d cryptex -f database/schema.sql
```

## Rolling Back

If you need to rollback the migration (remove the support_tickets table):

```sql
DROP TABLE IF EXISTS support_tickets CASCADE;
```

**⚠️ Warning:** This will delete all support tickets. Only use this in development.

## Production Deployment

For production deployments:

1. **Backup your database first:**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Run the migration:**
   ```bash
   npm run migrate
   ```

3. **Verify the migration:**
   ```bash
   npm run migrate:check
   ```

4. **Test the support system:**
   - Create a test ticket as a user
   - Respond to it as an admin
   - Verify it works correctly

## Next Steps

After running the migration:

1. Restart your backend server
2. Test the support system:
   - Users can create tickets at `/dashboard/support`
   - Admins can view and respond at `/admin/support`
3. Verify everything works as expected

## Support

If you encounter any issues:

1. Check the migration logs
2. Verify your database connection
3. Ensure all dependencies are installed
4. Check that your database user has the necessary permissions

