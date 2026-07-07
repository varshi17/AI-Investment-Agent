// services/researchService.js
import {
  getCompanyProfile,
  getStockQuote,
  getCompanyNews,
} from "./finnhubService.js";

export const collectResearch = async (symbol) => {
  console.log(`🔍 Collecting research for ${symbol}...`);
  
  try {
    // Get all data in parallel for better performance
    const [profile, quote, news] = await Promise.all([
      getCompanyProfile(symbol),
      getStockQuote(symbol),
      getCompanyNews(symbol)
    ]);

    // Validate we have minimum required data
    if (!profile || !profile.name) {
      throw new Error(`Could not fetch profile data for ${symbol}`);
    }

    console.log(`✅ Research collected for ${symbol}`);
    
    return {
      profile,
      quote,
      news,
    };
  } catch (error) {
    console.error(`❌ Research collection failed for ${symbol}:`, error.message);
    throw error;
  }
};