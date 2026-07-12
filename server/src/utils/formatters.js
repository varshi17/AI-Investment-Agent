// utils/formatters.js

// export function formatMarketCap(valueInMillions) {
//     if (!valueInMillions || valueInMillions === 0) return 'N/A';
//     const inDollars = valueInMillions * 1000000;
//     if (inDollars >= 1e12) {
//         return `$${(inDollars / 1e12).toFixed(2)} Trillion`;
//     } else if (inDollars >= 1e9) {
//         return `$${(inDollars / 1e9).toFixed(2)} Billion`;
//     } else if (inDollars >= 1e6) {
//         return `$${(inDollars / 1e6).toFixed(2)} Million`;
//     } else {
//         return `$${inDollars.toFixed(2)}`;
//     }
// }

// export function formatVolume(volume) {
//     if (!volume) return 'N/A';
//     if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
//     if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
//     if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
//     return volume.toString();
// }


// utils/formatters.js

export const formatMarketCap = (marketCapInMillions) => {
  if (!marketCapInMillions) return 'N/A';
  const value = marketCapInMillions * 1e6;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
};

export const formatVolume = (volume) => {
  if (!volume) return 'N/A';
  if (volume >= 1e9) return (volume / 1e9).toFixed(1) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(1) + 'K';
  return volume.toString();
};