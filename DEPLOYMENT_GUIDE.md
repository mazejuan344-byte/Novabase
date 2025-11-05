# 🚀 Complete Deployment Guide - Novabase

This guide covers the **best deployment options** for your Next.js frontend + Express backend + PostgreSQL database.

---

## 📊 Quick Comparison

| Option | Frontend | Backend | Database | Cost | Best For |
|-------|----------|---------|----------|------|----------|
| **Option 1: Recommended** | Vercel | Render | Supabase | **FREE** | Best balance |
| **Option 2: Simplest** | Railway | Railway | Railway | **FREE** | One platform |
| **Option 3: All Vercel** | Vercel | Vercel | Supabase | **FREE** | Simple, but limited |

---

## 🏆 Option 1: Vercel (Frontend) + Render (Backend) + Supabase (Database) - **RECOMMENDED**

**Why this is best:**
- ✅ Vercel is **perfect** for Next.js (optimized, fast CDN)
- ✅ Render has **generous free tier** for Node.js backends
- ✅ Supabase provides **free PostgreSQL** with great tools
- ✅ All three platforms have **excellent free tiers**
- ✅ Easy to scale when needed

### Step 1: Deploy Frontend to Vercel

1. **Push code to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to https://vercel.com** and sign in with GitHub

3. **Click "Add New..." → "Project"**

4. **Import your repository:**
   - Select your `broker` repository
   - Click "Import"

5. **Configure Frontend:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

6. **Add Environment Variables** (add these later after backend is deployed):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

7. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your frontend will be live at: `https://your-project.vercel.app`

---

### Step 2: Set Up Database (Supabase)

1. **Go to https://supabase.com** and sign up (free tier)

2. **Create New Project:**
   - Click "New Project"
   - Name: `novabase`
   - Database Password: (save this securely!)
   - Region: Choose closest to you
   - Click "Create new project"

3. **Get Database URL:**
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Copy the "URI" connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

4. **Initialize Database:**
   - Go to **SQL Editor** in left sidebar
   - Click "New query"
   - Open `database/schema.sql` from your project
   - Copy **ALL** contents and paste into Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)

---

### Step 3: Deploy Backend to Render

1. **Go to https://render.com** and sign up with GitHub

2. **Create PostgreSQL Database** (optional - or use Supabase):
   - Click "New +" → "PostgreSQL"
   - Name: `novabase-db`
   - Plan: **Free**
   - Click "Create Database"
   - Copy the "Internal Database URL"

3. **Deploy Backend Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `broker` repository

4. **Configure Backend:**
   - **Name**: `novabase-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

5. **Add Environment Variables:**
   Click "Add Environment Variable" for each:
   
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
   (Use your Supabase connection string from Step 2)
   
   ```
   JWT_SECRET=[Generate a random 32+ character string]
   ```
   (Use PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`)
   
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
   (Use your Vercel frontend URL from Step 1)
   
   ```
   NODE_ENV=production
   ```
   
   ```
   PORT=5000
   ```

6. **Click "Create Web Service"**
   - Render will build and deploy (takes 3-5 minutes)
   - Your backend will be live at: `https://novabase-backend.onrender.com`

---

### Step 4: Connect Frontend to Backend

1. **Go back to Vercel Dashboard**
2. **Click on your frontend project** → **Settings** → **Environment Variables**
3. **Add/Update:**
   ```
   NEXT_PUBLIC_API_URL=https://novabase-backend.onrender.com
   ```
4. **Go to Deployments** tab
5. **Click "Redeploy"** on the latest deployment

---

### Step 5: Test Everything

1. **Visit your frontend URL**: `https://your-project.vercel.app`
2. **Try signing up** for a new account
3. **Check backend logs** in Render dashboard if issues occur
4. **Check frontend logs** in Vercel dashboard if issues occur

---

## 🎯 Option 2: Railway (Everything) - **SIMPLEST**

**Why this is good:**
- ✅ **One platform** for everything
- ✅ **Very easy** setup
- ✅ **Free tier** with $5 credit/month
- ✅ Auto-detects and configures everything

### Steps:

1. **Go to https://railway.app** and sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `broker` repository

3. **Add PostgreSQL Database:**
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Railway creates database automatically
   - Click on database → "Variables" tab
   - Copy the `DATABASE_URL`

4. **Deploy Frontend:**
   - Click "+ New" → "GitHub Repo"
   - Select your repository again
   - Click on service → **Settings**:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
   - Add Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app
     ```
   - Railway auto-deploys

5. **Deploy Backend:**
   - Click "+ New" → "GitHub Repo"
   - Select your repository again
   - Click on service → **Settings**:
     - **Root Directory**: `backend`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=[from step 3]
     JWT_SECRET=[generate random string]
     FRONTEND_URL=https://your-frontend-service.up.railway.app
     NODE_ENV=production
     PORT=5000
     ```

6. **Initialize Database:**
   - Click on database service
   - Go to "Data" tab
   - Click "Query" → Paste contents of `database/schema.sql` → Run

7. **Update Frontend API URL:**
   - Go to frontend service → Settings → Variables
   - Update `NEXT_PUBLIC_API_URL` with your backend Railway URL

---

## 🔧 Option 3: All on Vercel

**Why this works:**
- ✅ Everything in one place
- ✅ Free tier
- ⚠️ **Limitation**: Serverless functions have 10s timeout on free tier
- ⚠️ Not ideal for long-running backend processes

See `VERCEL_DEPLOY.md` for detailed steps.

---

## 🔐 Environment Variables Checklist

### Frontend (Vercel):
- ✅ `NEXT_PUBLIC_API_URL` - Your backend URL

### Backend (Render/Railway):
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `JWT_SECRET` - Random 32+ character string
- ✅ `FRONTEND_URL` - Your frontend Vercel URL
- ✅ `NODE_ENV` - `production`
- ✅ `PORT` - `5000` (or leave default)

---

## 🛠️ Generating JWT Secret

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Online:**
- Visit https://randomkeygen.com/
- Use a "CodeIgniter Encryption Keys" (256-bit)

---

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database created and schema initialized
- [ ] All environment variables set correctly
- [ ] Frontend connected to backend (`NEXT_PUBLIC_API_URL`)
- [ ] Backend CORS configured (`FRONTEND_URL`)
- [ ] Test signup/login functionality
- [ ] Check backend logs for errors
- [ ] Test API endpoints

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database requires SSL (Supabase does)
- Ensure password is URL-encoded in connection string

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches frontend URL **exactly**
- No trailing slash in `FRONTEND_URL`
- Check backend CORS configuration

### Frontend Can't Reach Backend
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend is deployed and running
- Check backend health endpoint: `https://your-backend.onrender.com/api/health`

### Environment Variables Not Working
- **Restart services** after adding environment variables
- Variable names are **case-sensitive**
- Check deployment logs for errors

### Render Backend Goes to Sleep (Free Tier)
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid plan for production

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Vercel** | Generous free tier | $20/month for Pro |
| **Render** | Free tier (sleeps after inactivity) | $7/month for always-on |
| **Railway** | $5 credit/month | Pay-as-you-go |
| **Supabase** | 500MB database, 2GB bandwidth | $25/month for Pro |

**Recommended for production**: Upgrade to paid Render ($7/month) for always-on backend.

---

## 🎯 Final Recommendation

**For starting out (FREE):**
- Frontend: **Vercel**
- Backend: **Render** (free tier)
- Database: **Supabase**

**For production:**
- Frontend: **Vercel** (Pro plan)
- Backend: **Render** (Starter plan - $7/month)
- Database: **Supabase** (Pro plan if needed)

**For simplicity:**
- Everything on **Railway** (one platform, easy management)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)

---

**Need help?** Check the deployment logs in your platform's dashboard for specific error messages.

