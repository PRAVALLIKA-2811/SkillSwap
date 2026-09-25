const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

const app = express();

// Enable CORS for Vercel, Render, and Localhost environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://skill-swap-taupe-two.vercel.app',
  'https://skillswap-1-01s6.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow Vercel preview/production domains, Render domains, localhost, and exact matches
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// Pre-flight handling
app.options('*', cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'online',
    database: dbStatus,
    service: 'SkillSwap API Server',
    timestamp: new Date().toISOString(),
  });
});

// Database connection readiness check middleware for all /api routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Database connection is initializing or unavailable. Please verify MONGODB_URI in server/.env',
    });
  }
  next();
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Serve static frontend in production if client/dist exists
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(clientDistPath, 'index.html'));
  });
}

// 404 Route handler for undefined API endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
  });
});

// Custom Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Start server immediately on 0.0.0.0 for Render port detection
const server = app.listen(PORT, HOST, () => {
  console.log(`=============================================`);
  console.log(`  SkillSwap API Server running on http://${HOST}:${PORT}`);
  console.log(`  Health check: /api/health`);
  console.log(`=============================================`);
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('Database connection error during startup:', err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
