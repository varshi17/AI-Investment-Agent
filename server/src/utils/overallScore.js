// utils/overallScore.js

export const calculateOverallScore = ({ financialHealth, growth, valuation, risk }) => {
  const fh = financialHealth?.score ?? 50;
  const g = growth?.score ?? 50;
  const v = valuation?.score ?? 50;
  const r = risk?.score ?? 50;

  // Weighted average – adjust weights as needed
  const overall = (fh * 0.3) + (g * 0.25) + (v * 0.25) + ((100 - r) * 0.2);

  const score = Math.min(Math.max(Math.round(overall), 0), 100);

  let level;
  if (score >= 80) level = 'Strong Buy';
  else if (score >= 65) level = 'Buy';
  else if (score >= 45) level = 'Hold';
  else if (score >= 25) level = 'Sell';
  else level = 'Strong Sell';

  return { score, level };
};