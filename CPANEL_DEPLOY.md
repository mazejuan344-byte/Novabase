# Deploy to cPanel (Namecheap) - Complete Guide

## ⚠️ Important Considerations

**cPanel hosting for Node.js apps is more complex than Vercel/Render because:**
- Requires Node.js support (not all cPanel hosts support it well)
- Requires manual configuration
- No automatic deployments
- May have limitations on the free/shared hosting plans

**Recommended:** If you want easy deployment, use Vercel (frontend) + Render (backend) - both free and easier.

**However, if you want to use your Namecheap domain, you can:**
1. Use cPanel for hosting (if Node.js is supported)
2. OR use Vercel/Render and point your domain to them (easier!)

---

## Option 1: Use Vercel/Render + Point Domain (EASIEST)

This is the **recommended approach** - you get easy deployment AND your custom domain.

### Steps:

1. **Deploy Frontend to Vercel** (as we discussed)
2. **Deploy Backend to Render** (as we discussed)
3. **Point Your Domain:**
   - In Vercel: Go to your project → Settings → Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Vercel will give you DNS records to add
   - In Namecheap: Go to Domain List → Manage → Advanced DNS
   - Add the DNS records Vercel provides
   - Wait 24-48 hours for DNS propagation

**Result:** Your site is on `yourdomain.com` but hosted on Vercel (free, fast, easy!)

---

## Option 2: Host on cPanel (More Complex)

### Prerequisites:

1. **Check if your Namecheap hosting supports Node.js:**
   - Most shared hosting plans **don't** support Node.js well
   - You need a VPS or a hosting plan that explicitly supports Node.js
   - Contact Namecheap support to confirm

2. **What you'll need:**
   - Node.js version manager (Node Version Manager) in cPanel
   - PostgreSQL database access (or use Supabase/Neon remotely)
   - SSH access (for easier deployment)
   - Ability to set environment variables

---

## Step-by-Step: Deploy to cPanel

### Step 1: Prepare Your Code

1. **Build your Next.js frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Your backend is already ready** (just needs environment variables)

### Step 2: Access cPanel

1. Log into your Namecheap cPanel (usually `yourdomain.com/cpanel`)
2. Look for **"Node.js"** or **"Node.js Selector"** in the cPanel interface
   - If you don't see it, your hosting plan may not support Node.js

### Step 3: Deploy Backend

1. **Upload backend files:**
   - Use File Manager or FTP
   - Upload your `backend` folder to `public_html/api` or `public_html/backend`

2. **Set up Node.js app:**
   - In cPanel, find "Node.js Selector" or "Setup Node.js App"
   - Click "Create Application"
   - Set:
     - **Node.js version:** Latest LTS (18.x or 20.x)
     - **Application root:** `/home/username/public_html/backend`
     - **Application URL:** `/api` or `/backend`
     - **Application startup file:** `server.js`
   - Click "Create"

3. **Set environment variables:**
   - In the Node.js app settings, find "Environment Variables"
   - Add:
     ```
     DATABASE_URL=your_supabase_connection_string
     JWT_SECRET=your_jwt_secret
     FRONTEND_URL=https://yourdomain.com
     NODE_ENV=production
     PORT=5000
     ```

4. **Install dependencies:**
   - In cPanel, find "Terminal" or use SSH
   - Navigate to your backend folder
   - Run: `npm install --production`

5. **Start the app:**
   - In Node.js app settings, click "Restart"

### Step 4: Deploy Frontend

**Option A: Static Export (Recommended for cPanel)**

1. **Update Next.js config for static export:**
   ```javascript
   // frontend/next.config.js
   module.exports = {
     output: 'export',
     // ... other config
   }
   ```

2. **Build:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Upload to cPanel:**
   - Upload contents of `frontend/out` folder to `public_html/`
   - This makes your site static (no server-side features)

**Option B: Node.js App (If supported)**

1. Upload entire `frontend` folder
2. Set up as Node.js app (similar to backend)
3. Set startup file: `server.js` or use Next.js build

### Step 5: Configure Database

**Recommended:** Use Supabase (free, remote) instead of cPanel database
- Your backend will connect to Supabase remotely
- No need to set up PostgreSQL on cPanel

### Step 6: Update API URLs

1. **In frontend code**, update API URL:
   ```javascript
   // frontend/lib/api.ts
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yourdomain.com/api'
   ```

2. **Set environment variable** in frontend (if using Next.js on cPanel)

---

## Limitations of cPanel Hosting

⚠️ **Important Limitations:**

1. **Shared hosting plans** often don't support Node.js well
2. **No automatic deployments** - must upload manually
3. **Performance** - shared hosting is slower than Vercel/Render
4. **No serverless scaling** - limited by your hosting plan
5. **More maintenance** - you manage everything

---

## Recommended Alternative: Vercel + Custom Domain

**This is the BEST approach:**

1. ✅ Deploy frontend to Vercel (free, fast)
2. ✅ Deploy backend to Render (free, easy)
3. ✅ Point your Namecheap domain to Vercel
4. ✅ Get professional hosting + your custom domain
5. ✅ Zero maintenance, automatic deployments

### Steps to Point Domain:

1. **In Vercel:**
   - Project → Settings → Domains
   - Add `yourdomain.com` and `www.yourdomain.com`
   - Vercel shows DNS records needed

2. **In Namecheap:**
   - Domain List → Manage → Advanced DNS
   - Add A record or CNAME as Vercel instructs
   - Usually: A record pointing to Vercel IP

3. **Wait 24-48 hours** for DNS propagation

4. **Done!** Your site is live on your domain

---

## My Recommendation

**For your use case, I recommend:**

1. **Deploy frontend to Vercel** (we can do this now)
2. **Deploy backend to Render** (we can do this now)
3. **Point your Namecheap domain to Vercel** (takes 5 minutes to set up)

**Why?**
- ✅ Free hosting
- ✅ Professional performance
- ✅ Automatic deployments
- ✅ Your custom domain
- ✅ Zero maintenance
- ✅ Better than shared hosting

**Would you like me to help you:**
- A) Deploy to Vercel/Render and point your domain (recommended)
- B) Deploy to cPanel (more complex, but I can guide you)

Let me know which you prefer!



