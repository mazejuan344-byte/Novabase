# Deploy Backend to Vercel - Step by Step

## Prerequisites
✅ You have your frontend already deployed on Vercel
✅ You have a Supabase database set up
✅ You have your DATABASE_URL connection string

---

## Step 1: Prepare Your Backend Code

I've already:
- ✅ Created `backend/vercel.json` configuration
- ✅ Updated `backend/server.js` to work with Vercel

**Next:** Make sure your backend code is pushed to GitHub.

---

## Step 2: Deploy Backend to Vercel

1. **Go to https://vercel.com**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository:**
   - If not connected, click "Connect GitHub" and authorize
   - Find and select your repository (the one with your backend)
   - Click "Import"

4. **Configure the project:**
   - **Project Name:** `novabase-backend` (or any name)
   - **Root Directory:** Click "Edit" → Set to `backend`
   - **Framework Preset:** Leave as "Other" or "Node.js"
   - **Build Command:** Leave blank (Vercel will auto-detect)
   - **Output Directory:** Leave blank
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   Click "Add" for each variable:

   **Variable 1:**
   ```
   Name: DATABASE_URL
   Value: [paste your Supabase connection string]
   ```

   **Variable 2:**
   ```
   Name: JWT_SECRET
   Value: BcOp7b5N8X5BeBJukP3eYo7oYQ9TEOki
   ```

   **Variable 3:**
   ```
   Name: FRONTEND_URL
   Value: https://your-frontend-name.vercel.app
   ```
   (Replace with your actual Vercel frontend URL)

   **Variable 4:**
   ```
   Name: NODE_ENV
   Value: production
   ```

6. **Click "Deploy"**
   - Wait 2-3 minutes for deployment
   - Vercel will build and deploy your backend

7. **Get your backend URL:**
   - After deployment, you'll see a URL like: `https://novabase-backend.vercel.app`
   - **Copy this URL** - you'll need it in Step 3

---

## Step 3: Update Frontend to Use Backend

1. **Go back to your Vercel dashboard**
2. **Click on your frontend project**
3. **Go to Settings → Environment Variables**
4. **Add/Update:**
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://novabase-backend.vercel.app
   ```
   (Use your actual backend URL from Step 2)

5. **Go to Deployments tab**
6. **Click "Redeploy"** on the latest deployment

---

## Step 4: Initialize Database

1. **Go to Supabase**
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New query"**
4. **Open `database/schema.sql`** from your project
5. **Copy ALL contents** and paste into Supabase SQL Editor
6. **Click "Run"** (or Ctrl+Enter)

✅ Database is now initialized!

---

## Step 5: Test

1. **Visit your frontend URL**
2. **Try signing up** for a new account
3. **Check for errors:**
   - If it works: ✅ Success!
   - If errors: Check Vercel logs (Deployments → Click deployment → Logs)

---

## Benefits of Using Vercel for Both

✅ **Everything in one place** - Frontend and backend in same dashboard
✅ **Free tier** - Generous free tier for both
✅ **Fast deployments** - Usually 1-2 minutes
✅ **Easy updates** - Push to GitHub, auto-deploys
✅ **Better integration** - Same CDN, same region

---

## Troubleshooting

**"Function timeout" errors:**
- Vercel serverless functions have a 10s timeout on free tier
- Your endpoints should be fast enough, but if needed, upgrade to Pro

**"Database connection failed":**
- Check DATABASE_URL is correct
- Make sure password is replaced in connection string
- Verify Supabase allows connections

**"CORS errors":**
- Make sure FRONTEND_URL matches your frontend Vercel URL exactly
- No trailing slash

**"Module not found" errors:**
- Make sure Root Directory is set to `backend`
- All dependencies should be in `backend/package.json`

---

## Quick Checklist

- [ ] Backend code pushed to GitHub
- [ ] Root Directory set to `backend` in Vercel
- [ ] All environment variables added
- [ ] Backend deployed successfully
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] Frontend redeployed
- [ ] Database schema run in Supabase
- [ ] Tested signup/login

---

You're all set! 🎉




