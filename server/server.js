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

// Root Welcome & Status Page
app.get('/', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const dbStatus = dbConnected ? 'Connected (Operational)' : 'Initializing / In-Memory';
  
  // If client expects JSON (like curl or API client)
  if (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html')) {
    return res.status(200).json({
      success: true,
      service: 'SkillSwap API Server',
      status: 'online',
      database: dbStatus,
      frontendUrl: 'https://skill-swap-taupe-two.vercel.app',
      healthCheck: '/api/health',
      timestamp: new Date().toISOString(),
    });
  }

  // HTML Status Page for web browsers
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkillSwap API Server - Status Online</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #090d16;
          color: #f1f5f9;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .container {
          max-width: 580px;
          width: 100%;
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(99, 102, 241, 0.15);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        h1 {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }
        p.subtitle {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .status-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }
        .status-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 14px;
        }
        .status-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .status-val {
          font-size: 13px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="badge">
          <div class="dot"></div>
          SkillSwap API is Live
        </div>
        <h1>SkillSwap Backend Server</h1>
        <p class="subtitle">
          This is the REST API service powered by Node.js, Express, and MongoDB. The web user interface is hosted on Vercel.
        </p>

        <div class="status-grid">
          <div class="status-card">
            <div class="status-label">Database</div>
            <div class="status-val">${dbStatus}</div>
          </div>
          <div class="status-card">
            <div class="status-label">Environment</div>
            <div class="status-val">${process.env.NODE_ENV || 'production'}</div>
          </div>
        </div>

        <div class="actions">
          <a href="https://skill-swap-taupe-two.vercel.app" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
            🚀 Open SkillSwap Web App (Vercel) &rarr;
          </a>
          <a href="/api/health" class="btn btn-secondary">
            🔍 Check JSON Health Status (/api/health)
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});

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
