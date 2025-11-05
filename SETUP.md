# Cryptex Platform Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```bash
createdb cryptex
```

2. Run the schema:
```bash
psql -U postgres -d cryptex -f database/schema.sql
```

3. Create an admin user (optional):
```sql
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@cryptex.com', '$2a$10$YourHashedPasswordHere', 'admin');
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/cryptex
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers

**Option 1: Run separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Run concurrently**
```bash
# From root directory
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## Creating Admin User

To create an admin user, you can:

1. Use the signup endpoint and manually update the role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

2. Or use the API after creating a regular user:
```bash
curl -X PUT http://localhost:5000/api/admin/users/{userId} \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend

1. Deploy to Railway, Heroku, or similar
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
3. Update frontend API URL to point to backend

### Database

Use a managed PostgreSQL service:
- Railway PostgreSQL
- Supabase
- AWS RDS
- Heroku Postgres

## Troubleshooting

### Port Already in Use
Change the port in `backend/.env` or `frontend/package.json`

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

### CORS Errors
Update `FRONTEND_URL` in backend `.env` to match your frontend URL

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Verify all environment variables are set

## Security Notes

- Never commit `.env` files
- Use strong `JWT_SECRET` in production
- Enable HTTPS in production
- Regularly update dependencies
- Use environment-specific database credentials





