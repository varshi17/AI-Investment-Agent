// services/geminiService.js
import ai from "../config/gemini.js";

export const analyzeWithGemini = async (symbol, research) => {
  try {
    const { profile, quote, metrics, scores, news } = research;

    const marketCapString = profile.marketCapString || 'N/A';

    const prompt = `
You are a senior Wall Street equity research analyst.

The numerical investment scores below have already been calculated by the backend.
DO NOT modify them.
DO NOT calculate new scores.
Explain what they mean.

Company: ${profile.name} (${profile.ticker})
Industry: ${profile.industry || 'N/A'}
Current Price: $${quote.currentPrice || 0}
Market Cap: ${marketCapString}

=======================
Financial Metrics:
- PE Ratio: ${metrics.peRatio ?? 'N/A'}
- ROE: ${metrics.roe ?? 'N/A'}
- Debt/Equity: ${metrics.debtToEquity ?? 'N/A'}
- Revenue Growth: ${metrics.revenueGrowth ?? 'N/A'}
- Profit Margin: ${metrics.profitMargin ?? 'N/A'}

=======================
Calculated Scores:
- Overall: ${scores.overall?.score ?? 'N/A'}
- Financial Health: ${scores.financialHealth?.score ?? 'N/A'}
- Growth: ${scores.growth?.score ?? 'N/A'}
- Valuation: ${scores.valuation?.score ?? 'N/A'}
- Risk: ${scores.risk?.score ?? 'N/A'}

=======================
Recent News (top 5):
${news.slice(0, 5).map(n => `- ${n.headline}`).join('\n')}

=======================
Return ONLY JSON with these fields:
{
  "summary": "Brief summary of the company's overall state (1 sentence).",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "risks": ["risk1", "risk2"],
  "investment_thesis": "Concise thesis for potential investment (1–2 sentences)."
}
`;

    console.log(`🤖 Sending request to Gemini AI for ${symbol}...`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/JSON/g, "")
      .trim();

    const start = cleanText.indexOf("{");
    const end = cleanText.lastIndexOf("}");

    let parsed = {};
    if (start !== -1 && end !== -1) {
      const json = cleanText.substring(start, end + 1);
      parsed = JSON.parse(json);
    } else {
      console.error('❌ No JSON found in Gemini response, using fallback.');
      return generateFallbackResponse(scores);
    }

    // ===== Backend computes recommendation and confidence from scores =====
    const overallScore = scores.overall?.score ?? 50;
    const financialHealthScore = scores.financialHealth?.score ?? 50;
    const growthScore = scores.growth?.score ?? 50;

    let recommendation;
    if (overallScore >= 80) recommendation = 'INVEST';
    else if (overallScore >= 65) recommendation = 'WATCH';
    else recommendation = 'PASS';

    const confidence = Math.round(
      overallScore * 0.7 +
      financialHealthScore * 0.2 +
      growthScore * 0.1
    );

    console.log(`✅ Analysis complete for ${symbol}:`);
    console.log(`   - Recommendation: ${recommendation}`);
    console.log(`   - Confidence: ${confidence}%`);

    return {
      summary: parsed.summary || 'Analysis complete.',
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      opportunities: parsed.opportunities || [],
      risks: parsed.risks || ['Market volatility', 'Competition'],
      investment_thesis: parsed.investment_thesis || 'See financial metrics for details.',
      recommendation,
      confidence,
      // also include the backend level string (BUY/HOLD/SELL) for frontend mapping
      level: scores.overall?.level || 'Hold',
    };
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return generateFallbackResponse(research.scores);
  }
};

function generateFallbackResponse(scores) {
  const overallScore = scores?.overall?.score ?? 50;
  const financialHealthScore = scores?.financialHealth?.score ?? 50;
  const growthScore = scores?.growth?.score ?? 50;

  let recommendation;
  if (overallScore >= 80) recommendation = 'INVEST';
  else if (overallScore >= 65) recommendation = 'WATCH';
  else recommendation = 'PASS';

  const confidence = Math.round(
    overallScore * 0.7 +
    financialHealthScore * 0.2 +
    growthScore * 0.1
  );

  return {
    summary: 'AI analysis is temporarily unavailable.',
    strengths: [],
    weaknesses: [],
    opportunities: [],
    risks: ['Unable to analyze current news.'],
    investment_thesis: 'Analysis generated using backend financial metrics only.',
    recommendation,
    confidence,
    level: scores?.overall?.level || 'Hold',
  };
}