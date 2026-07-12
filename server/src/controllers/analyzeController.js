// controllers/analyzeController.js
import { analyzeWithGemini } from "../services/geminiService.js";
import companySymbols from "../utils/companySymbols.js";
import { collectResearch } from "../services/researchService.js";
import { getHistoricalData } from "../services/finnhubService.js";

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

export const analyzeCompany = async (req, res) => {
  try {
    // ─── DISABLE CACHE FOR DEMO ──────────────────────────────────
    cache.clear(); // <-- ensures we always get fresh data

    const { symbol, company } = req.body;

    if (!symbol && !company) {
      return res.status(400).json({
        success: false,
        error: "SYMBOL_REQUIRED",
        message: "Please provide a stock symbol or company name",
        suggestions: ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"],
      });
    }

    let resolvedSymbol = symbol;
    if (!resolvedSymbol && company) {
      const lowerCompany = company.toLowerCase();
      resolvedSymbol = companySymbols[lowerCompany] || company.toUpperCase();
    }

    if (!resolvedSymbol) {
      return res.status(400).json({
        success: false,
        error: "INVALID_SYMBOL",
        message: `Could not resolve "${company}" to a valid stock symbol`,
        suggestions: Object.keys(companySymbols).slice(0, 5),
      });
    }

    resolvedSymbol = resolvedSymbol.toUpperCase();

    console.log(`🔍 Analyzing: ${resolvedSymbol}`);

    let research;
    try {
      research = await collectResearch(resolvedSymbol);
    } catch (researchError) {
      console.error("Research Error:", researchError);
      if (researchError.message.includes("FINNHUB_API_KEY")) {
        return res.status(401).json({
          success: false,
          error: "API_KEY_ERROR",
          message: "Finnhub API key is invalid or not set. Please check your .env file.",
          solution: "Add FINNHUB_API_KEY=your_key to .env file",
        });
      }
      throw researchError;
    }

    if (!research.profile || !research.profile.name) {
      return res.status(404).json({
        success: false,
        error: "DATA_NOT_FOUND",
        message: `No data found for symbol "${resolvedSymbol}". Please verify the symbol is correct.`,
        suggestions: ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA"],
        debug: {
          symbol: resolvedSymbol,
          hasProfile: !!research.profile,
          hasQuote: !!research.quote,
        },
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `${resolvedSymbol} | Price: ${research.quote.currentPrice}, News: ${research.news.length}`
      );
    }

    // ─── Fetch historical and AI analysis with fallback ──────────
    let historical = null;
    let analysis = null;

    try {
      [historical, analysis] = await Promise.all([
        getHistoricalData(resolvedSymbol),
        analyzeWithGemini(resolvedSymbol, research),
      ]);
    } catch (err) {
      console.error("Error in historical or Gemini:", err);
      historical = { s: "no_data" };
      analysis = {
        summary: "Analysis unavailable.",
        strengths: [],
        weaknesses: [],
        opportunities: [],
        risks: [],
        investment_thesis: "",
        recommendation: "HOLD",
        confidence: 50,
        overall: { score: 50, level: "HOLD" },
      };
    }

    const responseData = {
      analysis,
      profile: research.profile,
      quote: research.quote,
      metrics: research.metrics,
      scores: research.scores,
      chart: historical,
      news: research.news,
      recommendations: research.recommendations || [],
      metadata: {
        symbol: resolvedSymbol,
        analyzedAt: new Date().toISOString(),
        api: "Finnhub",
        ai: "Gemini 2.5 Flash",
        version: "2.0",
        cached: false,
      },
    };

    // (optional) store in cache if you want, but we cleared it
    cache.set(resolvedSymbol, {
      timestamp: Date.now(),
      data: responseData,
    });

    console.log(`✅ Analysis complete for: ${resolvedSymbol}`);

    return res.status(200).json({
      success: true,
      fromCache: false,
      ...responseData,
    });
  } catch (error) {
    console.error("❌ Analyze Error:", error);

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(504).json({
        success: false,
        error: "TIMEOUT_ERROR",
        message: "The analysis request timed out. Please try again.",
        retryAfter: 5,
      });
    }

    if (error.message?.includes("Gemini") || error.message?.includes("AI")) {
      return res.status(503).json({
        success: false,
        error: "AI_SERVICE_UNAVAILABLE",
        message: "AI analysis service is currently unavailable. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: error.message || "An unexpected error occurred. Please try again.",
      timestamp: new Date().toISOString(),
    });
  }
};