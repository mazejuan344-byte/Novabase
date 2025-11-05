# Novabase - Crypto Investment Broker Platform

A full-stack crypto investment broker platform with secure authentication, user dashboard, admin panel, and transaction management.

## 🚀 Features

- **Landing Page**: Animated tech background with modern design
- **Authentication**: Unified sign-in for users and admins with role-based access
- **User Dashboard**: Deposit/withdrawal flows, portfolio tracking, transaction history
- **Admin Panel**: User management, transaction approval, crypto address management
- **Security**: JWT authentication, password hashing, input validation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL
- **Authentication**: JWT with role-based access control
- **Deployment**: Vercel-ready (frontend), Railway/Heroku (backend)

## 📦 Installation

1. Install dependencies:
```bash
npm run install:all
```

2. Set up environment variables:

Create `backend/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/novabase
JWT_SECRET=your-secret-key-here
PORT=5000
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Set up PostgreSQL database:
```bash
# Run the database schema
psql -U postgres -d novabase -f database/schema.sql
```

4. Run development servers:
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 📁 Project Structure

```
broker/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── database/          # PostgreSQL schema
└── shared/            # Shared types and utilities
```

## 🔐 Default Admin Account

After setting up the database, create an admin user:
- Email: admin@novabase.com
- Password: (set via database or API)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

### Backend
1. Deploy to Railway, Heroku, or similar
2. Set `DATABASE_URL` and `JWT_SECRET`
3. Update frontend API URL

## 📝 License

ISC



