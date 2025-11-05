# Fix Vercel Output Directory Error

## The Problem
Vercel is looking for a "public" output directory, but Next.js uses ".next" by default.

## Solution: Fix Vercel Dashboard Settings

### Step 1: Go to Vercel Project Settings

1. Open your Vercel project dashboard
2. Go to **Settings** → **General**

### Step 2: Verify/Update These Settings

**Root Directory:**
- Set to: `frontend`
- This is critical!

**Framework Preset:**
- Should be: `Next.js` (auto-detected)
- If not, select it manually

**Build Command:**
- Leave BLANK or set to: `npm run build`
- Vercel will auto-detect this for Next.js

**Output Directory:**
- **IMPORTANT:** Leave this BLANK or set to: `.next`
- DO NOT set it to "public"
- Next.js outputs to `.next` by default

**Install Command:**
- Leave BLANK (defaults to `npm install`)

### Step 3: Save and Redeploy

1. Click **Save** at the bottom
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment

## Why This Happens

Vercel might be configured for a different framework (like a static site) that uses a "public" folder. Next.js projects:
- Build to `.next` directory
- Don't need Output Directory specified (Vercel auto-detects)
- Use the framework preset "Next.js"

## If Still Not Working

1. **Delete and recreate the project** in Vercel:
   - Make sure Root Directory = `frontend`
   - Framework Preset = `Next.js`
   - Output Directory = BLANK (not "public")

2. **Or add a minimal vercel.json** in the `frontend` folder:
   ```json
   {
     "framework": "nextjs"
   }
   ```

The key is making sure Output Directory is either blank or `.next`, NOT `public`.



