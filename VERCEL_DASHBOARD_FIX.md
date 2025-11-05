# Fix Vercel Routes-Manifest Error

## The Issue
The build succeeds, but Vercel can't find `routes-manifest.json`. The error path shows `,next` which indicates a path resolution problem.

## Solution: Fix Vercel Dashboard Settings

The issue is in your **Vercel Dashboard settings**. Here's what to check:

### Step 1: Go to Project Settings
1. Go to your Vercel project dashboard
2. Click **Settings** → **General**

### Step 2: Verify These Settings

**Root Directory:**
- Must be: `frontend`
- This tells Vercel where your Next.js app is

**Framework Preset:**
- Must be: `Next.js`
- Auto-detected, but verify it's set

**Build Command:**
- Should be: `npm run build` OR leave **BLANK** (auto-detected)
- Do NOT include `cd frontend` if Root Directory is already `frontend`

**Output Directory:**
- Must be: **BLANK** or `.next`
- Do NOT set to `public` or anything else
- Vercel auto-detects `.next` for Next.js

**Install Command:**
- Should be: `npm install` OR leave **BLANK** (auto-detected)

### Step 3: Clear Cache and Redeploy
1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Select **Redeploy**
4. Check **"Use existing Build Cache"** - UNCHECK this (clear cache)
5. Click **Redeploy**

## Why This Happens

The error path `/vercel/path0/frontend/,next/routes-manifest.json` shows a comma before `next`, which means:
- Vercel is incorrectly constructing the path
- This usually happens when Output Directory is set incorrectly
- Or when Root Directory + Output Directory conflict

## Alternative: If Still Not Working

If the above doesn't work, try:

1. **Delete and recreate the project** in Vercel:
   - Import from GitHub again
   - Set Root Directory to `frontend` during import
   - Don't set Output Directory (leave blank)

2. **Or manually set Output Directory**:
   - In Settings → General
   - Output Directory: `.next` (explicitly set)
   - This should match the `distDir` in next.config.js

## Current Configuration

- ✅ `next.config.js` has `distDir: '.next'` 
- ✅ No `vercel.json` (letting Vercel auto-detect)
- ✅ Build command is correct in package.json

The issue is definitely in the **Vercel Dashboard settings**, not in your code.



