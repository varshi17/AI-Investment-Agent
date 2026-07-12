// services/researchService.js
import {
  getCompanyProfile,
  getStockQuote,
  getCompanyNews,
  getBasicFinancials,
  getRecommendationTrends,
} from "./finnhubService.js";

import { calculateFinancialHealth } from "../utils/financialHealth.js";
import { calculateGrowthScore } from "../utils/growthScore.js";
import { calculateValuationScore } from "../utils/valuationScore.js";
import { calculateOverallScore } from "../utils/overallScore.js";

import { formatMarketCap, formatVolume } from "../utils/formatters.js";

// ===== Helper Functions =====

function calculateVolatility(quote) {
  if (!quote || !quote.h || !quote.l || quote.l === 0) return null;
  const volatility = ((quote.h - quote.l) / quote.l) * 100;
  return parseFloat(volatility.toFixed(2));
}

function getMarketPosition(marketCap) {
  if (!marketCap) return 'Unknown';
  const inDollars = marketCap * 1000000;
  if (inDollars >= 200e9) return 'Mega Cap (Leader)';
  if (inDollars >= 10e9) return 'Large Cap (Major Player)';
  if (inDollars >= 2e9) return 'Mid Cap (Growing)';
  if (inDollars >= 300e6) return 'Small Cap (Emerging)';
  return 'Micro Cap (Niche)';
}

// Improved risk calculation (backend decides)
function calculateRiskScore({ profile, quote, financials }) {
  let risk = 50;

  // Debt/Equity
  const de = financials.totalDebtToEquityQuarterly;
  if (de !== undefined && de !== null) {
    const deRatio = de > 10 ? de / 100 : de;
    if (deRatio > 1.0) risk += 20;
    else if (deRatio > 0.5) risk += 10;
    else risk -= 10;
  }

  // Current Ratio
  const cr = financials.currentRatioQuarterly;
  if (cr !== undefined && cr !== null) {
    if (cr < 1.0) risk += 15;
    else if (cr < 1.5) risk += 5;
    else risk -= 10;
  }

  // Net Margin
  const pm = financials.netMarginTTM;
  if (pm !== undefined && pm !== null) {
    const pmPct = pm > 1 ? pm * 100 : pm;
    if (pmPct < 5) risk += 10;
    else if (pmPct < 10) risk += 5;
    else risk -= 5;
  }

  // Volatility
  const volatility = quote && quote.h && quote.l && quote.l > 0
    ? ((quote.h - quote.l) / quote.l) * 100
    : 0;
  if (volatility > 5) risk += 10;
  else if (volatility > 3) risk += 5;
  else risk -= 5;

  // Market Cap
  if (profile.marketCapitalization > 50000) risk -= 10;
  else if (profile.marketCapitalization < 2000) risk += 10;

  risk = Math.max(0, Math.min(100, risk));
  return {
    score: risk,
    level: risk > 65 ? 'High' : risk > 40 ? 'Medium' : 'Low',
  };
}

// ===== Main Research Function =====
export const collectResearch = async (symbol) => {
  console.log(`🔍 Collecting research for ${symbol}...`);

  try {
    // Fetch all data in parallel
    const [profile, quote, news, financials, recommendations] = await Promise.all([
      getCompanyProfile(symbol),
      getStockQuote(symbol),
      getCompanyNews(symbol),
      getBasicFinancials(symbol),
      getRecommendationTrends(symbol),
    ]);

    if (!profile || !profile.name) {
      throw new Error(`Could not fetch profile data for ${symbol}`);
    }

    // Calculate scores
    const financialHealth = calculateFinancialHealth(financials);
    const growth = calculateGrowthScore(financials);
    const valuation = calculateValuationScore(financials);
    const risk = calculateRiskScore({ profile, quote, financials });
    const overall = calculateOverallScore({ financialHealth, growth, valuation, risk });

    console.log(`✅ Research collected for ${symbol}`);

    // Build research object
    const research = {
      profile: {
        name: profile.name || 'N/A',
        ticker: profile.ticker || symbol,
        exchange: profile.exchange || 'N/A',
        industry: profile.finnhubIndustry || 'N/A',
        country: profile.country || 'N/A',
        ipo: profile.ipo || 'N/A',
        marketCapitalization: profile.marketCapitalization || 0,
        marketCapString: formatMarketCap(profile.marketCapitalization || 0),
        logo: profile.logo || null,
        weburl: profile.weburl || null,
        phone: profile.phone || null,
        employees: profile.employees || null,
        ceo: profile.ceo || null,
        sector: profile.sector || 'N/A',
      },

      quote: {
        currentPrice: quote.c || 0,
        previousClose: quote.pc || 0,
        dayHigh: quote.h || 0,
        dayLow: quote.l || 0,
        open: quote.o || 0,
        volume: quote.v || 0,
        timestamp: quote.t || Math.floor(Date.now() / 1000),
        change: quote.c && quote.pc ? (quote.c - quote.pc).toFixed(2) : 0,
        changePercent: quote.c && quote.pc
          ? (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2)
          : 0,
        volumeString: formatVolume(quote.v || 0),
        isPositive: quote.c > quote.pc,
      },

      // Simplified news
      news: news && news.length > 0
        ? news.map((item) => ({
            headline: item.headline || 'No headline',
            summary: item.summary || 'No summary available',
            source: item.source || 'Unknown source',
            date: item.datetime
              ? new Date(item.datetime * 1000).toLocaleDateString()
              : 'N/A',
          }))
        : [],

      // Real metrics from Finnhub
      metrics: {
        peRatio: financials.peNormalizedAnnual ?? financials.peTTM ?? null,
        eps: financials.epsTTM ?? null,
        roe: financials.roeTTM ?? null,
        roa: financials.roaTTM ?? null,
        debtToEquity: financials.totalDebtToEquityQuarterly ?? null,
        currentRatio: financials.currentRatioQuarterly ?? null,
        revenueGrowth: financials.revenueGrowthTTMYoy ?? null,
        profitMargin: financials.netMarginTTM ?? null,
        dividendYield: financials.dividendYieldIndicatedAnnual ?? null,
        week52High: financials["52WeekHigh"] ?? null,
        week52Low: financials["52WeekLow"] ?? null,
        volatility: calculateVolatility(quote),
        marketPosition: getMarketPosition(profile.marketCapitalization),
      },

      scores: {
        financialHealth: financialHealth || { score: 50, level: 'Moderate', factors: [] },
        growth: growth || { score: 50, level: 'Moderate', factors: [] },
        valuation: valuation || { score: 50, level: 'Fairly Valued', factors: [] },
        risk: risk || { score: 50, level: 'Medium', factors: [] },
        overall: overall || { score: 50, level: 'Hold' },
      },

      recommendations: recommendations || [],
    };

    // Return only the essential parts (smaller response)
    return {
      profile: research.profile,
      quote: research.quote,
      metrics: research.metrics,
      scores: research.scores,
      news: research.news,
      recommendations: research.recommendations,
    };
  } catch (error) {
    console.error(`❌ Research collection failed for ${symbol}:`, error.message);
    throw error;
  }
};

// ===== Additional Exports (for compatibility) =====

export const getResearchSummary = (research) => {
  if (!research) return null;
  return {
    companyName: research.profile.name,
    ticker: research.profile.ticker,
    currentPrice: research.quote.currentPrice,
    changePercent: research.quote.changePercent,
    marketCap: research.profile.marketCapString,
    recommendation: research.metrics.marketPosition,
    newsCount: research.news.length,
  };
};

export const getInvestmentFactors = (research) => {
  const factors = { positive: [], negative: [], neutral: [] };
  const { financialHealth, growth, valuation, risk } = research.scores || {};

  if (financialHealth?.level === 'Excellent' || financialHealth?.score >= 70)
    factors.positive.push('Strong financial health');
  else if (financialHealth?.level === 'Weak' || financialHealth?.score < 40)
    factors.negative.push('Weak financial health');
  else factors.neutral.push('Moderate financial health');

  if (growth?.level === 'High' || growth?.score >= 70)
    factors.positive.push('High growth potential');
  else if (growth?.level === 'Low' || growth?.score < 40)
    factors.negative.push('Low growth potential');
  else factors.neutral.push('Moderate growth');

  if (valuation?.level === 'Undervalued' || valuation?.score >= 70)
    factors.positive.push('Attractive valuation');
  else if (valuation?.level === 'Overvalued' || valuation?.score < 40)
    factors.negative.push('Expensive valuation');
  else factors.neutral.push('Fair valuation');

  if (risk?.level === 'Low') factors.positive.push('Low risk');
  else if (risk?.level === 'High') factors.negative.push('High risk');
  else factors.neutral.push('Moderate risk');

  const cap = research.profile.marketCapitalization;
  if (cap > 50000) factors.positive.push('Large cap (stability)');
  else if (cap < 2000) factors.negative.push('Small cap (volatility)');
  else factors.neutral.push('Mid cap');

  const dy = research.metrics.dividendYield;
  if (dy && dy > 0.03) factors.positive.push('Attractive dividend yield');
  else if (dy && dy > 0) factors.neutral.push('Pays dividend');

  return factors;
};