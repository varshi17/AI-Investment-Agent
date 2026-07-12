// components/MarketInsights.jsx
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const MarketInsights = () => {
  const [popularStocks, setPopularStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularStocks = async () => {
      try {
        const response = await fetch('/api/market/popular');
        const data = await response.json();
        if (data.success) {
          setPopularStocks(data.data);
        } else {
          setError(data.message || 'Failed to fetch stocks');
        }
      } catch (err) {
        setError('Network error – please try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStocks();
    // Optionally refresh every 60 seconds
    const interval = setInterval(fetchPopularStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  // Hardcoded exchanges (you could also fetch these from backend)
  const exchanges = ["NASDAQ", "NYSE", "LSE", "TSE", "SIX"];

  return (
    <div className="flex flex-col items-center gap-10 w-full px-4 md:px-8 lg:px-16 py-14">
      {/* Header remains the same */}
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#567C8D]" size={40} />
          <span className="ml-3 text-[#567C8D]">Loading market data...</span>
        </div>
      ) : error ? (
        <div className="text-red-400 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-[#567C8D] text-white rounded-lg hover:bg-[#2F4156] transition"
          >
            Retry
          </button>
        </div>
      ) : popularStocks.length === 0 ? (
        <p className="text-[#567C8D]">No popular stocks available at the moment.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-7xl mx-auto mb-8 gap-y-4">
          {popularStocks.map((stock, index) => {
            const change = stock.change ?? 0;
            const isPositive = change >= 0;
            return (
              <motion.div
                key={stock.symbol || index}
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
                  <span className="text-2xl font-bold text-[#2F4156]">
                    ${stock.price?.toFixed(2) ?? 'N/A'}
                  </span>
                  <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Exchanges and Metrics – you can also make these dynamic if you fetch from backend */}
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