# Vercel Deployment Fix Guide

## The Warnings You're Seeing

The npm warnings about deprecated packages are **harmless** and won't stop your build. They're just notifications that some dependencies have newer versions available.

## Key Configuration Steps

### 1. Set Root Directory in Vercel Dashboard

**IMPORTANT:** Make sure Vercel is configured to use the `frontend` directory:

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Scroll to **Root Directory**
4. Click **Edit** and set it to: `frontend`
5. Save

### 2. Build Settings

In Vercel Dashboard → Settings → General:
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (or leave blank - auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (or leave blank)

### 3. Environment Variables

Add these in **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual backend URL once deployed.

### 4. Remove Conflicting vercel.json

I've removed the `frontend/vercel.json` file because:
- Vercel auto-detects Next.js projects
- The localhost API rewrite won't work in production
- It can cause conflicts with Vercel's auto-detection

## If Build Still Fails

### Check Build Logs

1. Go to your Vercel project → **Deployments** tab
2. Click on the failed deployment
3. Check the **Build Logs** section
4. Look for actual **errors** (not warnings)

### Common Issues:

**Issue: "Cannot find module"**
- Solution: Make sure Root Directory is set to `frontend`

**Issue: TypeScript errors**
- Solution: Run `npm run build` locally first to catch errors
- Fix any TypeScript errors before deploying

**Issue: Missing environment variables**
- Solution: Add `NEXT_PUBLIC_API_URL` in Vercel dashboard

**Issue: Build timeout**
- Solution: This is rare, but if it happens, check for infinite loops in your code

## Quick Test Locally

Before deploying, test the build locally:

```bash
cd frontend
npm install
npm run build
```

If this works locally, it should work on Vercel.

## Next Steps

1. ✅ Set Root Directory to `frontend` in Vercel dashboard
2. ✅ Add `NEXT_PUBLIC_API_URL` environment variable
3. ✅ Push changes to GitHub (if you made any)
4. ✅ Redeploy in Vercel

The npm warnings are normal and can be ignored - they're just deprecation notices from dependencies.

