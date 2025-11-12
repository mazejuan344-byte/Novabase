# Troubleshooting Support System Server Error

## Common Causes

### 1. Database Table Doesn't Exist (Most Common)

**Error:** "Support tickets table does not exist"

**Solution:** Run the database migration on your server:

```bash
# From the backend directory
node run-migration.js
```

Or using psql:
```bash
psql $DATABASE_URL -f ../database/migrations/001_add_support_tickets.sql
```

### 2. Check if Table Exists

Test endpoint to check table:
```bash
# Make a GET request to (while logged in):
GET /api/support/test-table
```

Or check directly in database:
```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'support_tickets'
);
```

### 3. Validation Errors

**Error:** "Subject is required" or "Message is required"

**Solution:** The frontend now ensures these fields are always provided, but if you see this:
- Make sure you're entering a message
- The subject will default to "Support Request" if empty

### 4. Database Connection Issues

**Error:** Connection timeout or database error

**Solution:**
- Check your `DATABASE_URL` environment variable
- Verify database is accessible
- Check database credentials

## Quick Fix Steps

1. **Check backend logs** for the specific error:
   ```bash
   # Check your backend server logs
   # Look for "Create ticket error:"
   ```

2. **Run the migration** if table doesn't exist:
   ```bash
   cd backend
   node run-migration.js
   ```

3. **Test the table** using the test endpoint:
   ```bash
   # In browser console or Postman (while logged in):
   fetch('/api/support/test-table', {
     headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
   })
   ```

4. **Check the error message** - The improved error handling will now show:
   - "Support tickets table does not exist" - Run migration
   - "Invalid user ID" - Authentication issue
   - "Message cannot be empty" - Validation issue
   - Other specific database errors

## What Was Fixed

✅ **Better error messages** - Now shows specific error causes
✅ **Validation improvements** - Ensures subject and message are always provided
✅ **Default values** - Subject defaults to "Support Request" if empty
✅ **Test endpoint** - `/api/support/test-table` to check table existence
✅ **Frontend error handling** - Shows detailed error messages to users

## Testing

After fixing, test by:

1. **Send a test message** from the support page
2. **Check backend logs** for any errors
3. **Verify in database**:
   ```sql
   SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 1;
   ```

## Still Having Issues?

1. Check backend server logs for the exact error
2. Verify database connection is working
3. Ensure migration was run successfully
4. Check that user is authenticated (req.user.id exists)
5. Verify the support_tickets table structure matches the migration

