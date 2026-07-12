// utils/financialHealth.js

export const calculateFinancialHealth = (financials) => {
  if (!financials || Object.keys(financials).length === 0) return null;

  let score = 50;
  let factors = [];

  // ROE
  const roe = financials.roeTTM;
  if (roe !== undefined && roe !== null) {
    const roePct = roe > 1 ? roe * 100 : roe;
    if (roePct > 15) {
      score += 15;
      factors.push('Strong ROE');
    } else if (roePct > 5) {
      score += 5;
      factors.push('Moderate ROE');
    } else {
      score -= 10;
      factors.push('Low ROE');
    }
  }

  // Debt/Equity – adjusted thresholds
  const de = financials.totalDebtToEquityQuarterly;
  if (de !== undefined && de !== null) {
    const deRatio = de > 10 ? de / 100 : de;
    if (deRatio < 0.5) {
      score += 10;
      factors.push('Low debt');
    } else if (deRatio < 1.5) {
      score += 5;
      factors.push('Moderate debt');
    } else {
      score -= 5;
      factors.push('High debt');
    }
  }

  // Current Ratio – added neutral zone
  const cr = financials.currentRatioQuarterly;
  if (cr !== undefined && cr !== null) {
    if (cr > 1.5) {
      score += 10;
      factors.push('Strong liquidity');
    } else if (cr > 1.0) {
      score += 5;
      factors.push('Adequate liquidity');
    } else if (cr > 0.8) {
      // neutral, no change
      factors.push('Acceptable liquidity');
    } else {
      score -= 10;
      factors.push('Weak liquidity');
    }
  }

  // Net Margin
  const pm = financials.netMarginTTM;
  if (pm !== undefined && pm !== null) {
    const pmPct = pm > 1 ? pm * 100 : pm;
    if (pmPct > 15) {
      score += 10;
      factors.push('High profit margin');
    } else if (pmPct > 5) {
      factors.push('Moderate profit margin');
    } else {
      score -= 10;
      factors.push('Low profit margin');
    }
  }

  // Revenue Growth
  const rg = financials.revenueGrowthTTMYoy;
  if (rg !== undefined && rg !== null) {
    const rgPct = rg > 1 ? rg * 100 : rg;
    if (rgPct > 15) {
      score += 10;
      factors.push('Strong revenue growth');
    } else if (rgPct > 5) {
      factors.push('Moderate revenue growth');
    } else if (rgPct < 0) {
      score -= 10;
      factors.push('Declining revenue');
    }
  }

  // Clamp score to 0–100
  const clampedScore = Math.min(Math.max(score, 0), 100);

  return {
    score: clampedScore,
    factors,
    level: clampedScore >= 70 ? 'Excellent' : clampedScore >= 50 ? 'Moderate' : 'Weak',
  };
};