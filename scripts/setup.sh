#!/bin/bash

echo "🚀 Setting up Cryptex Platform..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "✅ Dependencies installed!"
echo ""
echo "📝 Next steps:"
echo "1. Set up PostgreSQL database and run: psql -U postgres -d cryptex -f database/schema.sql"
echo "2. Create backend/.env with your database URL and JWT_SECRET"
echo "3. Create frontend/.env.local with NEXT_PUBLIC_API_URL"
echo "4. Run 'npm run dev' from the root directory"
echo ""
echo "See SETUP.md for detailed instructions."



