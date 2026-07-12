// server/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import analyzeRoutes from "./routes/analyzeRoutes.js";

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ===== ROOT ENDPOINT =====
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Investment Research Agent API",
    version: "1.0.0",
    endpoints: {
      analyze: {
        path: "/api/analyze",
        method: "POST",
        description: "Analyze a stock using AI",
        body: { symbol: "AAPL" }
      },
      health: {
        path: "/health",
        method: "GET",
        description: "Health check endpoint"
      }
    }
  });
});

// ===== ROUTES =====
app.use("/api/analyze", analyzeRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
  console.warn(`⚠️ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: "NOT_FOUND",
    message: `Route ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err);
  console.error('Stack:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: err.message,
      details: err.details || null,
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    return res.status(400).json({
      success: false,
      error: "INVALID_JSON",
      message: "Invalid JSON payload",
      timestamp: new Date().toISOString()
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.code || "INTERNAL_ERROR",
    message: err.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details || null
    })
  });
});

// ===== REMOVE app.listen() - Server is started in server.js =====
export default app;