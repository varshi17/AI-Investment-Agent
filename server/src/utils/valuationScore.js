// utils/valuationScore.js

export const calculateValuationScore = (financials) => {
  if (!financials || Object.keys(financials).length === 0) return null;

  let score = 50;
  let factors = [];

  const pe = financials.peNormalizedAnnual ?? financials.peTTM;
  if (pe !== undefined && pe !== null && pe > 0) {
    if (pe < 15) {
      score += 20;
      factors.push('Attractive PE');
    } else if (pe < 25) {
      score += 5;
      factors.push('Fair PE');
    } else {
      score -= 15;
      factors.push('Expensive PE');
    }
  }

  const dy = financials.dividendYieldIndicatedAnnual;
  if (dy !== undefined && dy !== null && dy > 0) {
    if (dy > 3) {
      score += 10;
      factors.push('Good dividend yield');
    } else {
      factors.push('Dividend yield');
    }
  }

  return {
    score: Math.min(Math.max(score, 0), 100),
    factors,
    level: score >= 70 ? 'Undervalued' : score >= 50 ? 'Fairly Valued' : 'Overvalued',
  };
};