# 🚀 Quick Start Guide - Cryptex Platform

Follow these steps to get your platform running:

## Step 1: Install Dependencies

Open a terminal in the project root and run:

```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ..\backend
npm install
```

Or use the automated script:
```powershell
.\scripts\setup.bat
```

## Step 2: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not installed):
   - Download from: https://www.postgresql.org/download/windows/
   - Or use: `winget install PostgreSQL.PostgreSQL`

2. **Create the database**:
   ```powershell
   # Open PostgreSQL command line
   psql -U postgres

   # Create database
   CREATE DATABASE cryptex;

   # Exit psql
   \q
   ```

3. **Run the schema**:
   ```powershell
   psql -U postgres -d cryptex -f database\schema.sql
   ```

## Step 3: Configure Environment Variables

### Backend Configuration

Create `backend\.env` file:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cryptex
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Replace `your_password` with your actual PostgreSQL password.**

### Frontend Configuration

Create `frontend\.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 4: Start the Application

### Option A: Run Both Servers (Recommended)

From the root directory:
```powershell
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000) simultaneously.

### Option B: Run Separately

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API Health Check**: http://localhost:5000/api/health

## Step 6: Create Your First Account

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. You'll be automatically logged in

## Step 7: Create an Admin User (Optional)

To access the admin panel:

1. **Sign up as a regular user** first
2. **Update the role in PostgreSQL**:
   ```sql
   -- Connect to database
   psql -U postgres -d cryptex

   -- Update your user to admin
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

   -- Exit
   \q
   ```

3. **Sign out and sign back in** - you'll now see the admin panel

## 🎯 What's Next?

Once everything is running:

1. **Test the User Dashboard**:
   - Try depositing crypto (you'll see a deposit address)
   - View transactions
   - Check your profile

2. **Test Admin Features** (if you created an admin):
   - Go to `/admin` route
   - View all users
   - Approve/reject transactions
   - Manage crypto addresses

3. **Customize**:
   - Update crypto deposit addresses in admin panel
   - Modify investment plans
   - Customize the landing page

## ❌ Troubleshooting

### "Cannot find module 'react'"
**Solution**: Run `cd frontend && npm install`

### "Port 5000 already in use"
**Solution**: Change `PORT=5000` to a different port in `backend/.env`

### "Database connection failed"
**Solution**: 
- Check PostgreSQL is running: `Get-Service postgresql*`
- Verify `DATABASE_URL` in `backend/.env` is correct
- Ensure database `cryptex` exists

### "CORS errors"
**Solution**: Make sure `FRONTEND_URL` in `backend/.env` matches your frontend URL

### TypeScript errors in IDE
**Solution**: These will disappear once you run `npm install` in the frontend directory

## 📚 Additional Resources

- See `SETUP.md` for detailed setup instructions
- See `FEATURES.md` for complete feature list
- See `README.md` for project overview

## 🚀 Ready for Production?

When ready to deploy:
1. **Frontend**: Connect to Vercel (already configured)
2. **Backend**: Deploy to Railway or Heroku
3. **Database**: Use managed PostgreSQL (Railway, Supabase, etc.)

See `SETUP.md` for production deployment details.



