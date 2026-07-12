// server/src/routes/analyzeRoutes.js
import express from "express";
import { analyzeCompany } from "../controllers/analyzeController.js";

const router = express.Router();

// POST - Main analysis endpoint (used by frontend)
router.post("/", analyzeCompany);

// GET - For testing/debugging (optional)
router.get("/", (req, res) => {
  res.json({
    message: "Analyze endpoint is working. Use POST with { symbol: 'AAPL' }",
    example: {
      method: "POST",
      body: { symbol: "AAPL" }
    }
  });
});

export default router;