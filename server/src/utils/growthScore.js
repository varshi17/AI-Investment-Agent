// utils/growthScore.js

export const calculateGrowthScore = (financials) => {
  if (!financials || Object.keys(financials).length === 0) return null;

  let score = 50;
  let factors = [];

  const rg = financials.revenueGrowthTTMYoy;
  if (rg !== undefined && rg !== null) {
    const rgPct = rg > 1 ? rg * 100 : rg;
    if (rgPct > 15) {
      score += 20;
      factors.push('High revenue growth');
    } else if (rgPct > 5) {
      score += 10;
      factors.push('Moderate revenue growth');
    } else if (rgPct > 0) {
      score += 5;
      factors.push('Low revenue growth');
    } else {
      score -= 15;
      factors.push('Revenue decline');
    }
  }

  const eps = financials.epsTTM;
  if (eps !== undefined && eps !== null && eps > 0) {
    score += 10;
    factors.push('Profitable');
  } else if (eps !== undefined && eps !== null && eps < 0) {
    score -= 10;
    factors.push('Loss-making');
  }

  const dy = financials.dividendYieldIndicatedAnnual;
  if (dy !== undefined && dy !== null && dy > 0) {
    if (dy > 3) {
      score += 8;
      factors.push('High dividend yield');
    } else {
      score += 3;
      factors.push('Pays dividend');
    }
  }

  // Clamp score to 0–100 and use clamped value for level
  const clampedScore = Math.min(Math.max(score, 0), 100);

  return {
    score: clampedScore,
    factors,
    level: clampedScore >= 70 ? 'High' : clampedScore >= 50 ? 'Moderate' : 'Low',
  };
};