# Quick Backend Deployment Guide

## Easiest Method: Render (Recommended)

### Step 1: Set Up Database (5 minutes)

1. Go to https://supabase.com (or https://neon.tech)
2. Create a free account
3. Create a new project
4. Go to Settings → Database
5. Copy the "Connection string" (URI format)
   - It looks like: `postgresql://postgres:[password]@[host]:5432/postgres`

### Step 2: Deploy Backend to Render (10 minutes)

1. **Sign up at Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `broker` repository
   
3. **Configure Service**
   - **Name**: `novabase-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
4. **Add Environment Variables**
   Click "Add Environment Variable" for each:
   
   ```
   DATABASE_URL = <paste-your-supabase-connection-string>
   ```
   
   ```
   JWT_SECRET = <generate-using-command-below>
   ```
   
   ```
   FRONTEND_URL = https://your-frontend-name.vercel.app
   ```
   
   ```
   NODE_ENV = production
   ```
   
   ```
   PORT = 5000
   ```

5. **Generate JWT Secret**
   
   **Windows PowerShell:**
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```
   
   **Mac/Linux:**
   ```bash
   openssl rand -base64 32
   ```
   
   **Or use online:** https://randomkeygen.com/ (use CodeIgniter Encryption Keys)

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)
   - Copy your backend URL (e.g., `https://novabase-backend.onrender.com`)

### Step 3: Initialize Database (5 minutes)

1. **Using Supabase Dashboard:**
   - Go to Supabase → SQL Editor
   - Click "New Query"
   - Copy and paste the entire contents of `database/schema.sql`
   - Click "Run"

2. **Or using psql (if you have it installed):**
   ```bash
   psql <your-database-url> < database/schema.sql
   ```

### Step 4: Update Frontend (2 minutes)

1. Go to your Vercel dashboard
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Add/Update:
   ```
   NEXT_PUBLIC_API_URL = https://novabase-backend.onrender.com
   ```
5. Go to Deployments → Redeploy (or push a new commit)

### Step 5: Test

1. Visit your frontend URL
2. Try signing up for a new account
3. Check backend logs on Render dashboard if there are errors

---

## Alternative: Railway (Also Easy)

### Quick Steps:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "+ New" → "Database" → "Add PostgreSQL"
6. Click "+ New" → "GitHub Repo" → Select your repo
7. In the service settings:
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm start`
   - Add environment variables (same as Render)
8. Get your backend URL and update frontend

---

## Troubleshooting

**"Cannot connect to database"**
- Check DATABASE_URL is correct
- Ensure database allows connections from Render's IP
- Supabase/Neon usually allow all IPs by default

**"CORS error"**
- Make sure FRONTEND_URL matches your Vercel URL exactly
- No trailing slash in FRONTEND_URL

**"JWT_SECRET not set"**
- Ensure all environment variables are saved
- Restart the service after adding variables

**Database not initialized**
- Run the schema.sql file in your database
- Check Supabase SQL Editor or Railway database console

---

## Cost

- **Render**: Free tier (spins down after 15 min inactivity, but free)
- **Supabase**: Free tier (500MB database, plenty for starting)
- **Vercel**: Free tier (already using)
- **Total**: $0/month to start!

---

## Production Considerations

For production, consider:
- Upgrading to paid Render plan (no spin-down)
- Using a managed database service
- Setting up proper monitoring
- Adding error tracking (Sentry, etc.)




