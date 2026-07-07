// components/KeyStats.jsx
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Globe, 
  Building2,
  Activity,
  BarChart
} from "lucide-react";

const KeyStats = ({ profile, quote, analysis }) => {
  const change = quote.c - quote.pc;
  const changePercent = quote.pc ? ((change / quote.pc) * 100).toFixed(2) : 0;
  const isPositive = change >= 0;

  const stats = [
    {
      label: "Current Price",
      value: `$${quote.c?.toFixed(2) || 'N/A'}`,
      icon: <DollarSign size={18} className="text-blue-400" />,
      color: "border-blue-500/30"
    },
    {
      label: "Day High",
      value: `$${quote.h?.toFixed(2) || 'N/A'}`,
      icon: <TrendingUp size={18} className="text-green-400" />,
      color: "border-green-500/30"
    },
    {
      label: "Day Low",
      value: `$${quote.l?.toFixed(2) || 'N/A'}`,
      icon: <TrendingDown size={18} className="text-red-400" />,
      color: "border-red-500/30"
    },
    {
      label: "Previous Close",
      value: `$${quote.pc?.toFixed(2) || 'N/A'}`,
      icon: <Activity size={18} className="text-purple-400" />,
      color: "border-purple-500/30"
    },
    {
      label: "Market Cap",
      value: profile.marketCapitalization > 1e12 
        ? `$${(profile.marketCapitalization / 1e12).toFixed(2)}T` 
        : `$${(profile.marketCapitalization / 1e9).toFixed(2)}B`,
      icon: <BarChart size={18} className="text-yellow-400" />,
      color: "border-yellow-500/30"
    },
    {
      label: "Exchange",
      value: profile.exchange || 'N/A',
      icon: <Building2 size={18} className="text-cyan-400" />,
      color: "border-cyan-500/30"
    },
    {
      label: "Country",
      value: profile.country || 'N/A',
      icon: <Globe size={18} className="text-indigo-400" />,
      color: "border-indigo-500/30"
    },
    {
      label: "IPO Date",
      value: profile.ipo || 'N/A',
      icon: <Calendar size={18} className="text-pink-400" />,
      color: "border-pink-500/30"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`bg-slate-900 rounded-xl p-4 border ${stat.color} hover:bg-slate-800/50 transition`}
        >
          <div className="flex items-center gap-2 mb-2">
            {stat.icon}
            <span className="text-xs text-slate-400">{stat.label}</span>
          </div>
          <p className="text-lg font-bold truncate">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default KeyStats;