const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const adminRoutes = require('./routes/admin');
const cryptoRoutes = require('./routes/crypto');
const supportRoutes = require('./routes/support');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (required for Render and other hosting providers)
app.set('trust proxy', true);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash
      process.env.FRONTEND_URL?.replace(/\/$/, '') + '/', // Add trailing slash
      'http://localhost:3000'
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting - Environment-based configuration
// Can be disabled via DISABLE_RATE_LIMIT environment variable
const isDevelopment = process.env.NODE_ENV !== 'production';
const disableRateLimit = process.env.DISABLE_RATE_LIMIT === 'true';

// Auth endpoints - Only rate limit unauthenticated endpoints (sign-in/sign-up)
// This prevents brute force attacks while allowing legitimate users
// All other routes (users, transactions, admin, crypto, support) are EXCLUDED
// because they require authentication (JWT tokens), which already provides protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50 : 30, // Reasonable limit for auth attempts
  message: {
    error: 'Too many sign-in attempts',
    message: 'Too many authentication attempts. Please try again in a few minutes.',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful sign-ins/sign-ups
  skipFailedRequests: false, // Count failed attempts to prevent brute force
  skip: (req) => {
    if (disableRateLimit) return true;
    // Only rate limit sign-in and sign-up endpoints
    // All other auth endpoints (if any) are excluded
    return !req.path.match(/\/api\/auth\/(signin|signup)$/);
  }
});

// Apply rate limiting ONLY for auth endpoints (to prevent brute force)
// All other routes are automatically excluded - no rate limiter applied to them
// Excluded routes: /api/users, /api/transactions, /api/admin, /api/crypto, /api/support, /api/health
if (!disableRateLimit) {
  app.use('/api/auth', authLimiter); // Only auth routes get rate limited
  console.log('✅ Rate limiting enabled for authentication endpoints only');
  console.log('✅ All authenticated routes excluded: /api/users, /api/transactions, /api/admin, /api/crypto, /api/support');
} else {
  console.log('⚠️  Rate limiting is DISABLED (DISABLE_RATE_LIMIT=true)');
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (auth routes are before general limiter to use authLimiter)
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/transactions', authenticateToken, transactionRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/crypto', authenticateToken, cryptoRoutes);
app.use('/api/support', authenticateToken, supportRoutes);

// Test route for support table (can be removed after testing)
const supportTestRoutes = require('./routes/support-test');
app.use('/api/support', authenticateToken, supportTestRoutes);

// Health check (no rate limiting)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export for Vercel serverless function
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

