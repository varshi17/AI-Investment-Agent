// services/geminiService.js
import ai from "../config/gemini.js";

// ─── Retry logic for rate limiting ──────────────────────────────
async function generateWithRetry(generateFn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await generateFn();
      return result;
    } catch (error) {
      // Check if it's a 429 with a retryDelay
      if (error.status === 429 && error.errorDetails) {
        const retryInfo = error.errorDetails.find(d => d['@type']?.includes('RetryInfo'));
        if (retryInfo?.retryDelay) {
          const delaySeconds = parseFloat(retryInfo.retryDelay);
          if (!isNaN(delaySeconds) && delaySeconds > 0) {
            const delayMs = delaySeconds * 1000;
            console.warn(`⏳ Rate limited (attempt ${attempt}), retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue; // retry
          }
        }
      }
      // If not retriable or max attempts reached, rethrow
      if (attempt === maxAttempts) throw error;
      // Fallback: exponential backoff
      const backoff = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.warn(`⚠️ Retry attempt ${attempt} after ${backoff}ms`);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }
  throw new Error(`Failed after ${maxAttempts} attempts`);
}
// ─────────────────────────────────────────────────────────────────

export const analyzeWithGemini = async (symbol, research) => {
  try {
    const { profile, quote, metrics, scores, news, recommendations } = research;

    const marketCapString = profile.marketCapString || 'N/A';

    const prompt = `
You are a senior Wall Street equity research analyst.

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
Analyst Consensus:
${JSON.stringify(recommendations)}

=======================
Recent News (top 5):
${news.slice(0, 5).map(n => `- ${n.headline}`).join('\n')}

=======================
Explain the investment in a professional institutional research style.
Keep the summary concise.
Do not exaggerate.
Do not mention score calculations.
Focus on business quality, growth, valuation, competitive advantages and risks.

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

    // ─── Use retry wrapper ──────────────────────────────────────
    const generateFn = () => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const response = await generateWithRetry(generateFn);
    // ────────────────────────────────────────────────────────────

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
      return generateFallbackResponse(research);
    }

    // ─── Compute recommendation ──────────────────────────────────
    const overallScore = scores.overall?.score ?? 50;
    const financialHealthScore = scores.financialHealth?.score ?? 50;
    const growthScore = scores.growth?.score ?? 50;
    const riskScore = scores.risk?.score ?? 50;

    let recommendation;
    if (overallScore >= 90) recommendation = "STRONG BUY";
    else if (overallScore >= 75) recommendation = "BUY";
    else if (overallScore >= 60) recommendation = "HOLD";
    else if (overallScore >= 50) recommendation = "REDUCE";
    else recommendation = "SELL";

    // ─── Confidence ──────────────────────────────────────────────
    let confidence = Math.round(
      overallScore * 0.5 +
      financialHealthScore * 0.3 +
      growthScore * 0.2
    );
    confidence = Math.min(confidence, 98); // cap at 98%

    // ─── Overall object for frontend ─────────────────────────────
    const overall = {
      score: overallScore,
      level: recommendation,
    };

    console.log(`✅ Analysis complete for ${symbol}:`);
    console.log(`   - Recommendation: ${recommendation}`);
    console.log(`   - Confidence: ${confidence}%`);

    // Return the combined analysis
    return {
      ...parsed,
      recommendation,
      confidence,
      overall,                    // frontend can use analysis.overall.level
      // Also expose individual scores for flexibility
      overallScore,
      financialHealth: financialHealthScore,
      growth: growthScore,
      risk: riskScore,
    };
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return generateFallbackResponse(research);
  }
};

function generateFallbackResponse(research) {
  const scores = research.scores || {};
  const overallScore = scores.overall?.score ?? 50;
  const financialHealthScore = scores.financialHealth?.score ?? 50;
  const growthScore = scores.growth?.score ?? 50;

  let recommendation;
  if (overallScore >= 90) recommendation = "STRONG BUY";
  else if (overallScore >= 80) recommendation = "BUY";
  else if (overallScore >= 65) recommendation = "HOLD";
  else if (overallScore >= 50) recommendation = "REDUCE";
  else recommendation = "SELL";

  let confidence = Math.min(
    Math.round(overallScore * 0.5 + financialHealthScore * 0.3 + growthScore * 0.2),
    98
  );

  return {
    summary: `${research.profile?.name || 'The company'} remains fundamentally stable based on current financial metrics.`,
    strengths: [],
    weaknesses: [],
    opportunities: [],
    risks: ['Market volatility'],
    investment_thesis: "Investment decision should rely on backend financial analysis.",
    recommendation,
    confidence,
    overall: {
      score: overallScore,
      level: recommendation,
    },
    overallScore,
    financialHealth: financialHealthScore,
    growth: growthScore,
    risk: scores.risk?.score ?? 50,
  };
}