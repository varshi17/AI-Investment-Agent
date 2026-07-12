// services/financialScoreService.js

export const calculateFinancialScore = (metrics, quote, profile) => {
  let score = 50;
  const factors = [];
  
  const pe = metrics?.metric?.pe;
  if (pe && pe > 0) {
    if (pe < 15) { score += 10; factors.push({ name: 'Low PE Ratio', positive: true }); }
    else if (pe < 25) { score += 5; factors.push({ name: 'Moderate PE Ratio', positive: true }); }
    else { score -= 5; factors.push({ name: 'High PE Ratio', positive: false }); }
  }
  
  const eps = metrics?.metric?.eps;
  if (eps !== undefined && eps !== null) {
    if (eps > 5) { score += 10; factors.push({ name: 'Strong EPS', positive: true }); }
    else if (eps > 2) { score += 5; factors.push({ name: 'Positive EPS', positive: true }); }
    else { score -= 5; factors.push({ name: 'Weak EPS', positive: false }); }
  }
  
  const debtEquity = metrics?.metric?.debtToEquity;
  if (debtEquity !== undefined && debtEquity !== null) {
    if (debtEquity < 0.5) { score += 10; factors.push({ name: 'Low Debt', positive: true }); }
    else if (debtEquity < 1) { score += 5; factors.push({ name: 'Moderate Debt', positive: true }); }
    else { score -= 5; factors.push({ name: 'High Debt', positive: false }); }
  }
  
  const roe = metrics?.metric?.roe;
  if (roe !== undefined && roe !== null) {
    if (roe > 0.2) { score += 10; factors.push({ name: 'Strong ROE', positive: true }); }
    else if (roe > 0.1) { score += 5; factors.push({ name: 'Moderate ROE', positive: true }); }
    else { score -= 5; factors.push({ name: 'Low ROE', positive: false }); }
  }
  
  const marketCap = profile?.marketCapitalization || 0;
  if (marketCap > 100000) { score += 10; factors.push({ name: 'Large Cap', positive: true }); }
  else if (marketCap > 10000) { score += 5; factors.push({ name: 'Mid Cap', positive: true }); }
  else { score -= 5; factors.push({ name: 'Small Cap', positive: false }); }
  
  const changePercent = quote?.changePercent || 0;
  if (changePercent > 0) { score += 5; factors.push({ name: 'Positive Momentum', positive: true }); }
  else { score -= 5; factors.push({ name: 'Negative Momentum', positive: false }); }
  
  const volume = quote?.volume || 0;
  if (volume > 5000000) { score += 5; factors.push({ name: 'High Volume', positive: true }); }
  
  return {
    score: Math.min(Math.max(score, 0), 100),
    factors,
    level: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
  };
};

export const getRecommendation = (score, confidence) => {
  if (score >= 70 && confidence >= 60) return 'INVEST';
  if (score >= 40 && confidence >= 40) return 'WATCH';
  return 'PASS';
};