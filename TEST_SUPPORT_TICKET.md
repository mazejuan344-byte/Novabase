# Testing Support Tickets in Supabase

## Current Status ✅

Your `support_tickets` table exists and is empty - **this is normal!**

The table will only have data when:
- Users send support messages through your app
- You manually insert test data

## How to Test

### Option 1: Test Through Your App (Recommended)

1. **Make sure your backend is deployed** with the support routes
2. **Go to your frontend** (deployed or local)
3. **Log in as a user**
4. **Go to:** `/dashboard/support`
5. **Send a test message**
6. **Check Supabase Table Editor** - you should see the ticket appear!

### Option 2: Create Test Ticket Directly in Supabase

If you want to test the table structure:

1. **Go to Supabase Table Editor**
2. **Click on `support_tickets` table**
3. **Click "Insert row"** (or use SQL Editor)

**SQL Method:**
```sql
-- First, get a user_id from your users table
SELECT id, email FROM users LIMIT 1;

-- Then insert a test ticket (replace USER_ID with actual ID)
INSERT INTO support_tickets (user_id, subject, message, priority)
VALUES (
  (SELECT id FROM users LIMIT 1),  -- Replace with actual user_id
  'Test Support Request',
  'This is a test message to verify the support system works.',
  'medium'
);

-- Check if it was created
SELECT * FROM support_tickets;
```

### Option 3: Verify Table Structure

Check that all columns exist:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'support_tickets'
ORDER BY ordinal_position;
```

**Expected columns:**
- `id` (integer, primary key)
- `user_id` (integer, foreign key to users)
- `subject` (varchar)
- `message` (text)
- `status` (varchar, default: 'open')
- `priority` (varchar, default: 'medium')
- `admin_response` (text, nullable)
- `admin_id` (integer, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Troubleshooting

### If tickets aren't being created when users send messages:

1. **Check backend logs** for errors:
   - Look for "Create ticket error:"
   - Check for database connection issues

2. **Verify backend is deployed** with latest code:
   - Make sure support routes are included
   - Check that `backend/routes/support.js` exists

3. **Test the API endpoint directly:**
   ```bash
   # Using curl or Postman (replace with your backend URL and token)
   curl -X POST https://your-backend-url.com/api/support/tickets \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "subject": "Test Ticket",
       "message": "Testing support system",
       "priority": "medium"
     }'
   ```

4. **Check database connection:**
   - Verify `DATABASE_URL` is correct in backend environment
   - Make sure Supabase allows connections

### If you see errors:

**"Table does not exist":**
- Migration might not have run completely
- Re-run the migration in Supabase SQL Editor

**"Foreign key constraint violation":**
- Make sure you have users in the `users` table
- The `user_id` must reference an existing user

**"Permission denied":**
- Check database connection credentials
- Verify Supabase connection string is correct

## Quick Test Checklist

- [ ] Table exists in Supabase ✅ (you confirmed this)
- [ ] Table structure is correct (check columns)
- [ ] Backend is deployed with support routes
- [ ] Test sending a message through the app
- [ ] Check if ticket appears in Supabase
- [ ] Verify ticket has correct data

## Next Steps

1. **Test through your app:**
   - Send a support message
   - Check if it appears in Supabase

2. **If it doesn't work:**
   - Check backend logs
   - Verify API endpoint is accessible
   - Test with the test endpoint: `/api/support/test-table`

3. **Once working:**
   - Users can create tickets
   - Admins can view and respond
   - System is fully functional!

## Summary

✅ **Table exists** - Migration successful!
✅ **Table is empty** - This is normal until users send messages
⏭️ **Next:** Test by sending a message through your app

The empty table is expected - it will populate as users interact with the support system!

