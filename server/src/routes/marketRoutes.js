// server/src/routes/marketRoutes.js
import express from 'express';
import YahooFinance from 'yahoo-finance2';   // Note: capital Y – it's a class

const router = express.Router();

// Create an instance (required for v3)
const yahooFinance = new YahooFinance();

// List of symbols to fetch – you can add more (e.g. 'TSLA', 'NVDA', 'AMZN')
// You can also set them via environment variable POPULAR_SYMBOLS
const POPULAR_SYMBOLS = process.env.POPULAR_SYMBOLS
  ? process.env.POPULAR_SYMBOLS.split(',')
  : ['AAPL', 'MSFT', 'GOOGL'];

// Fallback mock data – used when all API calls fail
const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.50, change: 1.2 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.20, change: 0.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 145.30, change: 0.9 }
];

// Simple in‑memory cache to avoid hitting the API on every request
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 60000; // 60 seconds

// GET /api/market/popular
router.get('/popular', async (req, res) => {
  console.log('📊 Fetching popular stocks...');

  try {
    // Return cached data if it's still fresh
    if (cache.data && (Date.now() - cache.timestamp) < CACHE_TTL) {
      console.log('✅ Returning cached data');
      return res.json({ success: true, data: cache.data });
    }

    // Fetch all symbols in parallel
    const results = await Promise.all(
      POPULAR_SYMBOLS.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quote(symbol); // call on the instance
          return {
            symbol: quote.symbol,
            name: quote.longName || quote.shortName || symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent,
          };
        } catch (err) {
          console.warn(`⚠️ Could not fetch ${symbol}:`, err.message);
          return null; // skip this symbol
        }
      })
    );

    // Remove any null entries (failed fetches)
    const validQuotes = results.filter(q => q !== null);

    // If we got at least one real quote, use them; otherwise fallback to mock
    const finalData = validQuotes.length > 0 ? validQuotes : MOCK_STOCKS;

    // Update cache
    cache.data = finalData;
    cache.timestamp = Date.now();

    res.json({ success: true, data: finalData });
  } catch (error) {
    console.error('❌ Error fetching popular stocks:', error);
    // On any error, return mock data so the frontend never shows an empty state
    res.json({ success: true, data: MOCK_STOCKS });
  }
});

export default router;