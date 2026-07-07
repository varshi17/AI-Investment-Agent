// controllers/analyzeController.js
import { analyzeWithGemini } from "../services/geminiService.js";
import companySymbols from "../utils/companySymbols.js";
import { collectResearch } from "../services/researchService.js";
import {
  getCompanyProfile,
  getStockQuote,
  getCompanyNews,
  getHistoricalData,
} from "../services/finnhubService.js";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const analyzeCompany = async (req, res) => {
  try {
    const { symbol, company } = req.body;

    console.log(`📥 Request body:`, req.body);

    // Validate input
    if (!symbol && !company) {
      return res.status(400).json({
        success: false,
        error: "SYMBOL_REQUIRED",
        message: "Please provide a stock symbol or company name",
        suggestions: ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"]
      });
    }

    // Resolve symbol
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
        suggestions: Object.keys(companySymbols).slice(0, 5)
      });
    }

    // Convert to uppercase
    resolvedSymbol = resolvedSymbol.toUpperCase();

    // Check cache
    const cacheKey = resolvedSymbol;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return res.status(200).json({
        success: true,
        fromCache: true,
        ...cached.data
      });
    }

    console.log(`🔍 Analyzing: ${resolvedSymbol}`);

    // Collect research data
    let research;
    try {
      research = await collectResearch(resolvedSymbol);
    } catch (researchError) {
      console.error('Research Error:', researchError);
      
      // Check if it's an API key issue
      if (researchError.message.includes('FINNHUB_API_KEY')) {
        return res.status(401).json({
          success: false,
          error: "API_KEY_ERROR",
          message: "Finnhub API key is invalid or not set. Please check your .env file.",
          solution: "Add FINNHUB_API_KEY=your_key to .env file"
        });
      }
      
      throw researchError;
    }

    // Check if we have valid data
    if (!research.profile || !research.profile.name) {
      return res.status(404).json({
        success: false,
        error: "DATA_NOT_FOUND",
        message: `No data found for symbol "${resolvedSymbol}". Please verify the symbol is correct.`,
        suggestions: ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA"],
        debug: {
          symbol: resolvedSymbol,
          hasProfile: !!research.profile,
          hasQuote: !!research.quote
        }
      });
    }

    // Get historical data for chart
    let historical = null;
    try {
      historical = await getHistoricalData(resolvedSymbol);
    } catch (historicalError) {
      console.warn('⚠️ Historical data unavailable:', historicalError.message);
      historical = { s: 'no_data' };
    }

    // Generate AI analysis
    let analysis;
    try {
      analysis = await analyzeWithGemini(resolvedSymbol, research);
    } catch (aiError) {
      console.error('AI Analysis Error:', aiError);
      // Fallback analysis
      analysis = {
        company_explanation: `${research.profile.name} is a company in the ${research.profile.finnhubIndustry || 'technology'} sector.`,
        financial_health: "Financial analysis is currently unavailable. Please try again later.",
        market_position: "Market position analysis is temporarily unavailable.",
        recent_news_impact: "News impact analysis is temporarily unavailable.",
        risks: ["Data not available"],
        opportunities: ["Data not available"],
        recommendation: "WATCH",
        confidence: 50,
        financial_score: 50,
        key_metrics: {},
        investment_thesis: "Analysis temporarily unavailable. Please try again."
      };
    }

    // Prepare response
    const responseData = {
      analysis,
      profile: research.profile,
      quote: research.quote || { c: 0, h: 0, l: 0, pc: 0 },
      historical: historical,
      news: research.news || [],
      metadata: {
        symbol: resolvedSymbol,
        analyzedAt: new Date().toISOString(),
        dataSource: "Finnhub + Gemini AI",
        usingMockData: !research.profile.logo || research.profile.logo.includes('clearbit')
      }
    };

    // Cache the response
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    console.log(`✅ Analysis complete for: ${resolvedSymbol}`);

    return res.status(200).json({
      success: true,
      fromCache: false,
      ...responseData
    });

  } catch (error) {
    console.error("❌ Analyze Error:", error);

    // Specific error handling
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        error: "TIMEOUT_ERROR",
        message: "The analysis request timed out. Please try again.",
        retryAfter: 5
      });
    }

    if (error.message?.includes('Gemini') || error.message?.includes('AI')) {
      return res.status(503).json({
        success: false,
        error: "AI_SERVICE_UNAVAILABLE",
        message: "AI analysis service is currently unavailable. Please try again later."
      });
    }

    return res.status(500).json({
      success: false,
      error: "INTERNAL_ERROR",
      message: error.message || "An unexpected error occurred. Please try again.",
      timestamp: new Date().toISOString()
    });
  }
};