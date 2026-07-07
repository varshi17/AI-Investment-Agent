// services/geminiService.js
import ai from "../config/gemini.js";

export const analyzeWithGemini = async (symbol, research) => {
  try {
    const { profile, quote, news } = research;
    
    // Calculate basic metrics
    const change = quote.c - quote.pc;
    const changePercent = ((change / quote.pc) * 100).toFixed(2);
    const marketCap = profile.marketCapitalization;
    const marketCapString = marketCap > 1e9 
      ? `$${(marketCap / 1e9).toFixed(2)} Billion` 
      : `$${(marketCap / 1e6).toFixed(2)} Million`;

    const prompt = `
You are a Senior Equity Research Analyst with 20 years of experience at Goldman Sachs. 
Provide a professional analysis for ${profile.name} (${symbol}).

KEY METRICS:
- Current Price: $${quote.c}
- Previous Close: $${quote.pc}
- Change: ${changePercent}%
- Market Cap: ${marketCapString}
- Exchange: ${profile.exchange}
- Industry: ${profile.finnhubIndustry}
- Country: ${profile.country}

Company Profile:
${JSON.stringify(profile, null, 2)}

Latest News (Last 7 days):
${JSON.stringify(news, null, 2)}

Based on the data, provide a comprehensive analysis in the following JSON format:

{
  "company_explanation": "Brief overview of what the company does (2-3 sentences)",
  "financial_health": "Detailed financial analysis including revenue, earnings, margins, debt levels, and growth prospects",
  "market_position": "Analysis of competitive position, market share, and industry trends",
  "recent_news_impact": "Summarize key news events and their potential impact on the stock",
  "risks": ["List 3-4 specific risks facing the company"],
  "opportunities": ["List 3-4 growth opportunities"],
  "recommendation": "INVEST or WATCH or PASS",
  "confidence": 0-100,
  "financial_score": 0-100,
  "key_metrics": {
    "pe_ratio": "Current P/E ratio if available",
    "dividend_yield": "Current dividend yield if available",
    "target_price": "Estimated fair value"
  },
  "investment_thesis": "A concise 2-sentence thesis for why to invest or not"
}

Make your analysis specific, data-driven, and professional. Be realistic - not every company should be an INVEST.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const cleanText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanText);
      // Validate required fields
      const requiredFields = ['recommendation', 'confidence', 'financial_score'];
      for (const field of requiredFields) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      return parsed;
    } catch (parseError) {
      console.error('❌ Gemini Parse Error:', parseError);
      // Fallback response
      return {
        company_explanation: `Analysis for ${profile.name} (${symbol})`,
        financial_health: "Unable to parse detailed analysis. Please review the data manually.",
        market_position: "Market position analysis unavailable.",
        recent_news_impact: "News impact analysis unavailable.",
        risks: ["Limited data available"],
        opportunities: ["Limited data available"],
        recommendation: "WATCH",
        confidence: 50,
        financial_score: 50,
        key_metrics: {},
        investment_thesis: "Insufficient data for a complete analysis."
      };
    }
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
};