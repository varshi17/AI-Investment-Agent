// app.js - Simplified version (no new packages needed)
import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();

// Basic middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Investment Research Agent API 🚀",
    version: "1.0.0",
    endpoints: {
      analyze: "/api/analyze (POST)",
      health: "/health (GET)"
    }
  });
});

// Routes
app.use("/api/analyze", analyzeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "NOT_FOUND",
    message: `Route ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err);
  res.status(500).json({
    success: false,
    error: "INTERNAL_ERROR",
    message: err.message || "An unexpected error occurred",
    timestamp: new Date().toISOString()
  });
});

export default app;