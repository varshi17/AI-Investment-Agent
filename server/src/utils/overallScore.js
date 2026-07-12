// utils/overallScore.js

export const calculateOverallScore = ({ financialHealth, growth, valuation, risk }) => {
  const fh = financialHealth?.score ?? 50;
  const g = growth?.score ?? 50;
  const v = valuation?.score ?? 50;
  const r = risk?.score ?? 50;

  const overall = (fh * 0.35) + (g * 0.30) + (v * 0.25) + ((100 - r) * 0.10);

  const score = Math.min(Math.max(Math.round(overall), 0), 100);

  let level;
  if (score >= 75) level = 'BUY';
  else if (score >= 55) level = 'HOLD';
  else level = 'SELL';

  return { score, level };
};