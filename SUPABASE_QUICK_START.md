# Quick Start: Add Support System to Supabase

## Step 1: Run Migration in Supabase (2 minutes)

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor:**
   - Click **"SQL Editor"** (left sidebar)
   - Click **"New query"**

3. **Copy and Paste:**
   - Open: `database/migrations/001_add_support_tickets.sql`
   - Copy everything
   - Paste into Supabase SQL Editor
   - Click **"Run"** ✅

## Step 2: Deploy Backend Code

Your backend code already has the support routes. Just make sure:

1. **Code is pushed to GitHub** (already done ✅)
2. **Backend is deployed** (Render/Vercel/etc.)
3. **Environment variables are set:**
   - `DATABASE_URL` (your Supabase connection string)
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

## Step 3: Test

1. **Go to your deployed frontend**
2. **Log in as a user**
3. **Go to: `/dashboard/support`**
4. **Send a test message**
5. **Check if it works!**

## That's It! 🎉

The support system should now work on your Supabase database.

## If You Get Errors

**"Table does not exist":**
- Run the migration in Supabase SQL Editor (Step 1)

**"Server error":**
- Check backend logs
- Verify `DATABASE_URL` is correct
- Make sure backend is restarted after code changes

**"Permission denied":**
- Check database connection string
- Verify Supabase password is correct

## Need Help?

See `SUPABASE_MIGRATION.md` for detailed instructions.

