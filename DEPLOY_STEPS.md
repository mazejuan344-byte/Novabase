# Step-by-Step Backend Deployment

Follow these steps in order. I'll guide you through each one.

## Prerequisites ✅
- Node.js v24.11.0 ✅
- npm v11.6.1 ✅
- Backend code ready ✅

---

## Step 1: Set Up Database (Supabase - Free)

1. **Go to https://supabase.com**
2. **Click "Start your project"** (or Sign up)
3. **Create a new project:**
   - Organization: Create new (or use existing)
   - Project name: `novabase` (or any name)
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

4. **Get your database connection string:**
   - Once project is ready, go to **Settings** (gear icon) → **Database**
   - Scroll down to "Connection string"
   - Click the tab that says **"URI"**
   - Copy the connection string (looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)
   - **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the password you created
   - **Save this somewhere safe** - you'll need it in Step 2

---

## Step 2: Deploy Backend to Render

1. **Go to https://render.com**
2. **Sign up** (use GitHub - it's easiest)
3. **After signing up, click "New +" → "Web Service"**
4. **Connect your repository:**
   - Click "Connect account" if you haven't
   - Select your GitHub account
   - Find and select your `broker` repository
   - Click "Connect"

5. **Configure the service:**
   - **Name:** `novabase-backend` (or any name you like)
   - **Region:** Choose closest to you
   - **Branch:** `main` (or `master` if that's your default)
   - **Root Directory:** `backend` ⚠️ **IMPORTANT - type this exactly**
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

6. **Add Environment Variables:**
   Click "Add Environment Variable" for each:

   **Variable 1:**
   ```
   Key: DATABASE_URL
   Value: [paste your Supabase connection string from Step 1]
   ```

   **Variable 2:**
   ```
   Key: JWT_SECRET
   Value: [see command below to generate]
   ```

   **Variable 3:**
   ```
   Key: FRONTEND_URL
   Value: https://your-frontend-name.vercel.app
   ```
   (Replace with your actual Vercel frontend URL)

   **Variable 4:**
   ```
   Key: NODE_ENV
   Value: production
   ```

   **Variable 5:**
   ```
   Key: PORT
   Value: 5000
   ```

7. **Generate JWT_SECRET:**
   
   Open PowerShell and run:
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```
   
   Copy the output and paste it as the JWT_SECRET value.

8. **Click "Create Web Service"**
   - Render will start building and deploying
   - Wait 2-3 minutes
   - Check the logs to see if it's successful

9. **Get your backend URL:**
   - Once deployed, you'll see a URL like: `https://novabase-backend.onrender.com`
   - **Copy this URL** - you'll need it in Step 4

---

## Step 3: Initialize Database

1. **Go back to Supabase**
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New query"**
4. **Open the file `database/schema.sql`** from your project
5. **Copy ALL the contents** of that file
6. **Paste into the Supabase SQL Editor**
7. **Click "Run"** (or press Ctrl+Enter)
8. **You should see "Success. No rows returned"**

✅ Database is now set up!

---

## Step 4: Update Frontend to Use Backend

1. **Go to https://vercel.com**
2. **Sign in** and go to your dashboard
3. **Find your frontend project** and click on it
4. **Go to Settings** → **Environment Variables**
5. **Add/Update:**
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://novabase-backend.onrender.com
   ```
   (Use your actual Render backend URL from Step 2)

6. **Go to Deployments tab**
7. **Click the three dots** on the latest deployment → **Redeploy**

---

## Step 5: Test Everything

1. **Visit your frontend URL** (Vercel)
2. **Try to sign up** for a new account
3. **Check for errors:**
   - If it works: ✅ You're done!
   - If there are errors: Check the logs:
     - Render dashboard → Your service → Logs
     - Vercel dashboard → Your deployment → Logs

---

## Troubleshooting

**Backend won't start:**
- Check Render logs for errors
- Make sure Root Directory is exactly `backend`
- Verify all environment variables are set

**Database connection errors:**
- Double-check DATABASE_URL (make sure password is correct)
- Try the "Connection pooling" URL from Supabase instead of direct connection

**CORS errors:**
- Make sure FRONTEND_URL matches your Vercel URL exactly
- No trailing slash in FRONTEND_URL

**Can't sign up/login:**
- Check backend logs on Render
- Verify database schema was run (Step 3)
- Check if JWT_SECRET is set

---

## Quick Commands Reference

**Generate JWT Secret (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Test backend health:**
```bash
curl https://your-backend.onrender.com/api/health
```

---

## Need Help?

If you get stuck at any step, let me know:
1. Which step you're on
2. What error message you're seeing
3. Screenshots if possible





