// components/PerformanceMetrics.jsx
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const PerformanceMetrics = ({ analysis, quote, profile, scores, metrics }) => {
  const currentPrice = Number(quote.currentPrice || 0);
  const dayHigh = Number(quote.dayHigh || 0);
  const dayLow = Number(quote.dayLow || 0);

  // Use scores for financial health and confidence
  const confidence = analysis?.confidence ?? scores?.overall?.score ?? 50;
  const financialHealth = scores?.financialHealth?.score ?? 50;

  // Market position: percentage of current price relative to day high
  const marketPosition = dayHigh > 0 ? Math.min(100, ((currentPrice || 0) / (dayHigh || 1)) * 100) : 50;

  // Growth potential: range between day high and low
  const growthPotential = dayLow > 0 ? Math.min(100, ((dayHigh - dayLow) / (dayLow || 1)) * 100) : 50;

  const metricItems = [
    {
      label: "AI Confidence",
      value: confidence,
      icon: <Activity size={16} className="text-[#567C8D]" />,
      color: "#3b82f6"
    },
    {
      label: "Financial Health",
      value: financialHealth,
      icon: <DollarSign size={16} className="text-green-400" />,
      color: "#22c55e"
    },
    {
      label: "Market Position",
      value: marketPosition,
      icon: <TrendingUp size={16} className="text-[#567C8D]" />,
      color: "#8b5cf6"
    },
    {
      label: "Growth Potential",
      value: growthPotential,
      icon: <TrendingDown size={16} className="text-yellow-400" />,
      color: "#eab308"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="text-[#567C8D]" size={20} />
        <h3 className="text-lg font-semibold text-[#2F4156]">Performance Metrics</h3>
      </div>

      <div className="space-y-4">
        {metricItems.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-1">
              {metric.icon}
              <span className="text-sm text-[#567C8D] flex-1">{metric.label}</span>
              <span className="text-sm font-semibold text-[#2F4156]">{metric.value.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#C8D9E6]">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#F5EFEB] rounded-lg p-2 text-center">
            <span className="text-xs text-[#567C8D]">P/E Ratio</span>
            <p className="font-semibold text-sm text-[#2F4156]">{metrics?.peRatio ?? 'N/A'}</p>
          </div>
          <div className="bg-[#F5EFEB] rounded-lg p-2 text-center">
            <span className="text-xs text-[#567C8D]">Revenue Growth</span>
            <p className="font-semibold text-sm text-[#2F4156]">
              {metrics?.revenueGrowth != null ? `${(metrics.revenueGrowth * 100).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;