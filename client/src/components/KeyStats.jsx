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
  const currentPrice = Number(quote.currentPrice || 0);
  const previousClose = Number(quote.previousClose || 0);
  const dayHigh = Number(quote.dayHigh || 0);
  const dayLow = Number(quote.dayLow || 0);
  const volume = Number(quote.volume || 0);
  
  const change = currentPrice - previousClose;
  const changePercent = previousClose > 0
    ? ((change / previousClose) * 100).toFixed(2)
    : "0.00";
  const isPositive = change >= 0;

  const stats = [
    {
      label: "Current Price",
      value: currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : "N/A",
      icon: <DollarSign size={18} className="text-[#567C8D]" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "Day High",
      value: dayHigh > 0 ? `$${dayHigh.toFixed(2)}` : "N/A",
      icon: <TrendingUp size={18} className="text-green-400" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "Day Low",
      value: dayLow > 0 ? `$${dayLow.toFixed(2)}` : "N/A",
      icon: <TrendingDown size={18} className="text-red-400" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "Previous Close",
      value: previousClose > 0 ? `$${previousClose.toFixed(2)}` : "N/A",
      icon: <Activity size={18} className="text-[#567C8D]" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "Market Cap",
      value: profile.marketCapString || "N/A",
      icon: <BarChart size={18} className="text-yellow-400" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "Exchange",
      value: profile.exchange || 'N/A',
      icon: <Building2 size={18} className="text-[#567C8D]" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "Country",
      value: profile.country || 'N/A',
      icon: <Globe size={18} className="text-[#567C8D]" />,
      color: "border-[#C8D9E6]"
    },
    {
      label: "IPO Date",
      value: profile.ipo || 'N/A',
      icon: <Calendar size={18} className="text-[#567C8D]" />,
      color: "border-[#C8D9E6]"
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
          className={`bg-white rounded-xl p-4 border ${stat.color} hover:bg-[#F5EFEB] transition shadow-sm hover:shadow-xl`}
        >
          <div className="flex items-center gap-2 mb-2">
            {stat.icon}
            <span className="text-xs text-[#567C8D]">{stat.label}</span>
          </div>
          <p className="text-lg font-bold text-[#2F4156] truncate">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default KeyStats;