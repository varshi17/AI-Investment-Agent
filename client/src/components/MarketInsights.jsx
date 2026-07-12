// components/MarketInsights.jsx
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Globe } from "lucide-react";

const MarketInsights = () => {
  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: "$189.50", change: "+1.2%" },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$245.80", change: "-0.8%" },
    { symbol: "MSFT", name: "Microsoft", price: "$378.20", change: "+0.5%" },
    { symbol: "NVDA", name: "NVIDIA", price: "$495.60", change: "+2.1%" },
    { symbol: "AMZN", name: "Amazon", price: "$145.30", change: "+0.9%" }
  ];

  const exchanges = ["NASDAQ", "NYSE", "LSE", "TSE", "SIX"];

  return (
    <div className="flex flex-col items-center gap-10 w-full px-4 md:px-8 lg:px-16 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="inline-block text-xs font-semibold text-[#2F4156] bg-[#C8D9E6] px-4 py-1.5 rounded-full mb-4 border border-[#567C8D]/20">
          Live Data
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2F4156] mb-4">
          Market <span className="text-[#567C8D]">Insights</span>
        </h2>
        <p className="text-[#567C8D] text-base md:text-lg">
          Track popular stocks and market trends in real-time
        </p>
      </motion.div>

      {/* Popular Stocks Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-7xl mx-auto mb-8 gap-y-4">
        {popularStocks.map((stock, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="bg-white rounded-3xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold text-[#2F4156]">{stock.symbol}</span>
              <TrendingUp className="text-[#567C8D]" size={16} />
            </div>
            <p className="text-sm text-[#567C8D] truncate">{stock.name}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-2xl font-bold text-[#2F4156]">{stock.price}</span>
              <span className={`text-sm font-medium ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Exchanges and Metrics */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-[#567C8D]" size={20} />
            <h3 className="text-xl font-bold text-[#2F4156]">Supported Exchanges</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {exchanges.map((exchange, index) => (
              <span key={index} className="px-3 py-1.5 bg-[#F5EFEB] rounded-full text-sm text-[#2F4156] border border-[#C8D9E6]">
                {exchange}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-[#2F4156]" size={20} />
            <h3 className="text-xl font-bold text-[#2F4156]">Key Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#567C8D]">Market Cap</p>
              <p className="text-2xl font-bold text-[#2F4156]">$45.2T</p>
            </div>
            <div>
              <p className="text-xs text-[#567C8D]">Volume</p>
              <p className="text-2xl font-bold text-[#2F4156]">12.4B</p>
            </div>
            <div>
              <p className="text-xs text-[#567C8D]">Valuation</p>
              <p className="text-2xl font-bold text-[#2F4156]">$38.7T</p>
            </div>
            <div>
              <p className="text-xs text-[#567C8D]">Growth</p>
              <p className="text-2xl font-bold text-green-400">+8.2%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketInsights;