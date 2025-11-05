# Backend Deployment Guide

This guide covers deploying the Novabase backend to various platforms. Choose the option that best fits your needs.

## Prerequisites

1. **Database Setup**: You'll need a PostgreSQL database. Options:
   - **Supabase** (Recommended - Free tier): https://supabase.com
   - **Neon** (Serverless PostgreSQL): https://neon.tech
   - **Railway** (Includes PostgreSQL): https://railway.app
   - **Render** (Includes PostgreSQL): https://render.com

2. **Environment Variables**: You'll need to set these in your deployment platform:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-secret-jwt-key-here-minimum-32-characters
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   PORT=5000
   ```

---

## Option 1: Deploy to Render (Recommended - Easiest)

Render offers a free tier and is very easy to use.

### Steps:

1. **Create a Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name it (e.g., "novabase-db")
   - Choose "Free" plan
   - Select region closest to you
   - Click "Create Database"
   - **Copy the "Internal Database URL"** - you'll need this

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `broker` repository
   - Configure:
     - **Name**: `novabase-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=<paste-internal-database-url-from-step-2>
     JWT_SECRET=<generate-a-random-32-character-string>
     FRONTEND_URL=https://your-frontend.vercel.app
     NODE_ENV=production
     PORT=5000
     ```
   - Click "Create Web Service"

4. **Update Frontend API URL**
   - Go to your Vercel dashboard
   - Navigate to your frontend project → Settings → Environment Variables
   - Add/Update:
     ```
     NEXT_PUBLIC_API_URL=https://novabase-backend.onrender.com
     ```
   - Redeploy your frontend

5. **Initialize Database**
   - After deployment, you'll need to run the database schema
   - Option A: Use Render's Shell (under your database service)
   - Option B: Connect locally and run:
     ```bash
     psql <your-database-url> < database/schema.sql
     ```

---

## Option 2: Deploy to Railway

Railway is another excellent option with a generous free tier.

### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `broker` repository

3. **Add PostgreSQL Database**
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create a database
   - Copy the connection string from the "Variables" tab

4. **Deploy Backend Service**
   - Click "+ New" → "GitHub Repo"
   - Select your repository
   - Railway will detect it's a Node.js project
   - Click on the service → Settings
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=<railway-postgres-url>
     JWT_SECRET=<generate-random-32-char-string>
     FRONTEND_URL=https://your-frontend.vercel.app
     NODE_ENV=production
     PORT=5000
     ```
   - Railway will auto-deploy

5. **Initialize Database**
   - Use Railway's database tab to connect
   - Or use their CLI: `railway run psql < database/schema.sql`

6. **Update Frontend**
   - Get your backend URL from Railway dashboard
   - Update Vercel environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
     ```

---

## Option 3: Deploy to DigitalOcean App Platform

DigitalOcean offers a straightforward deployment with a $5/month minimum.

### Steps:

1. **Create DigitalOcean Account**
   - Go to https://www.digitalocean.com
   - Sign up

2. **Create Managed Database**
   - Go to "Databases" → "Create Database Cluster"
   - Choose PostgreSQL
   - Select the smallest plan ($15/month)
   - Note the connection string

3. **Deploy App**
   - Go to "App Platform" → "Create App"
   - Connect GitHub repository
   - Configure:
     - **Source**: `backend` directory
     - **Build Command**: `npm install`
     - **Run Command**: `npm start`
   - Add Environment Variables (same as above)
   - Deploy

---

## Option 4: Deploy to Heroku

Heroku is well-established but requires a credit card for free tier.

### Steps:

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create novabase-backend
   ```

4. **Add PostgreSQL Addon**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```
   Or use Heroku Git:
   ```bash
   heroku git:remote -a novabase-backend
   git push heroku main
   ```

7. **Initialize Database**
   ```bash
   heroku pg:psql < ../database/schema.sql
   ```

---

## Generating JWT Secret

Generate a secure random string for JWT_SECRET:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Online:**
- Visit https://randomkeygen.com/ and use a "CodeIgniter Encryption Keys"

---

## Testing Your Deployment

1. **Health Check**
   ```bash
   curl https://your-backend-url.com/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Authentication**
   - Try signing up through your frontend
   - Check backend logs for any errors

---

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is set correctly
- Check if database requires SSL (most cloud databases do)
- Verify database is accessible from your deployment platform

### CORS Errors
- Ensure `FRONTEND_URL` matches your Vercel deployment URL exactly (no trailing slash)
- Check that credentials are enabled in CORS settings

### Environment Variables Not Working
- Restart your service after adding environment variables
- Ensure variable names match exactly (case-sensitive)
- Check deployment logs for errors

---

## Recommended Setup

For a production-ready setup:
- **Database**: Supabase (free tier, managed, easy)
- **Backend**: Render (free tier, easy deployment)
- **Frontend**: Vercel (already deployed)

This gives you a completely free setup to start with!

---

## Database Initialization

After deploying, you need to run the schema:

**Option 1: Using psql locally**
```bash
psql <your-database-url> < database/schema.sql
```

**Option 2: Using Render Shell**
- Go to your database service on Render
- Click "Connect" → "Shell"
- Copy and paste the contents of `database/schema.sql`

**Option 3: Using Railway CLI**
```bash
railway run psql < database/schema.sql
```

---

## Next Steps

1. Deploy backend using one of the options above
2. Set up your PostgreSQL database
3. Update frontend `NEXT_PUBLIC_API_URL` in Vercel
4. Run database schema
5. Test the full application




