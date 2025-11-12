# Run Migration on Supabase Database

Since you're using Supabase, here are the easiest ways to add the support_tickets table:

## Method 1: Using Supabase SQL Editor (Easiest - Recommended)

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor:**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Run the Migration:**
   - Open the file: `database/migrations/001_add_support_tickets.sql`
   - Copy **ALL** the contents
   - Paste into the Supabase SQL Editor
   - Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)

4. **Verify it worked:**
   - You should see: "Success. No rows returned"
   - The table is now created!

## Method 2: Using Migration Script (From Your Computer)

If you have your `DATABASE_URL` set up locally:

1. **Make sure your `.env` file has the Supabase connection string:**
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   (Replace `[YOUR-PASSWORD]` with your actual Supabase password)

2. **Run the migration:**
   ```bash
   cd backend
   node run-migration.js
   ```

3. **Verify:**
   ```bash
   node check-migration.js
   ```

## Method 3: Using Supabase CLI (If Installed)

If you have Supabase CLI installed:

```bash
supabase db push
# Or
supabase migration up
```

## What the Migration Does

Creates the `support_tickets` table with:
- All necessary columns (id, user_id, subject, message, status, priority, etc.)
- Foreign key relationships to users table
- Indexes for better performance
- Default values and constraints

## Verify Migration Success

After running the migration, verify it worked:

### Option 1: Using Supabase Dashboard
1. Go to **Table Editor** in Supabase
2. You should see `support_tickets` in the list of tables
3. Click on it to see the structure

### Option 2: Using SQL Query
In Supabase SQL Editor, run:
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'support_tickets'
);
```
Should return: `true`

### Option 3: Check Table Structure
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'support_tickets'
ORDER BY ordinal_position;
```

## After Migration

1. **Deploy your backend code** (if not already deployed)
   - The support routes are already in the code
   - Just make sure your backend is using the latest code

2. **Test the support system:**
   - Users can now create tickets at `/dashboard/support`
   - Admins can view/respond at `/admin/support`

## Troubleshooting

### "Table already exists" Error
- This is fine! It means the table was already created
- You can safely ignore this

### "Permission denied" Error
- Make sure you're using the correct database password
- Check that your connection string is correct

### "Connection failed" Error
- Verify your `DATABASE_URL` is correct
- Check that Supabase allows connections from your IP
- Make sure SSL is enabled (Supabase requires it)

## Quick Checklist

- [ ] Migration file copied (`database/migrations/001_add_support_tickets.sql`)
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked "Run"
- [ ] Verified table exists (Table Editor or SQL query)
- [ ] Backend code deployed with support routes
- [ ] Tested support system

## Next Steps

After migration:
1. ✅ Table created in Supabase
2. ✅ Deploy backend code (if not already)
3. ✅ Test support system
4. ✅ Users can now send support messages!

