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

// General API limit - Very lenient to prevent blocking legitimate users
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 2000 : 1000, // Very high limits to prevent blocking
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and support routes
    // Support messages are critical and should never be blocked
    const isHealthCheck = req.path === '/api/health';
    const isSupportRoute = req.path.startsWith('/api/support');
    return isHealthCheck || isSupportRoute || disableRateLimit;
  }
});

// Auth endpoints - Very lenient for sign-in
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 200 : 100, // Much higher limit for auth
  message: {
    error: 'Too many sign-in attempts',
    message: 'Too many sign-in attempts. Please try again in a few minutes.',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful sign-ins
  skipFailedRequests: false, // Count failed attempts to prevent brute force
  skip: () => disableRateLimit // Skip if disabled
});

// Apply rate limiting only if not disabled
if (!disableRateLimit) {
  app.use('/api/auth', authLimiter); // Auth routes
  app.use('/api/', generalLimiter); // All other routes (applies after auth)
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

