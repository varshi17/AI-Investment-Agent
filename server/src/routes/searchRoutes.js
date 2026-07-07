// routes/searchRoutes.js
import express from "express";
import { searchStocks } from "../services/finnhubService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const results = await searchStocks(q);
    
    // Format response for frontend
    const formatted = results.map(item => ({
      symbol: item.symbol,
      description: item.description,
      type: item.type
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;