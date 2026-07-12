// components/PerformanceMetrics.jsx
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const PerformanceMetrics = ({ analysis, quote, profile, scores, metrics }) => {
  // Use scores from backend
  const overall = scores?.overall?.score ?? 50;
  const financialHealth = scores?.financialHealth?.score ?? 50;
  const growth = scores?.growth?.score ?? 50;
  const risk = scores?.risk?.score ?? 50;
  const riskInverted = 100 - risk; // so high score = low risk

  const metricItems = [
    {
      label: "Overall Score",
      value: overall,
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
      label: "Growth Score",
      value: growth,
      icon: <TrendingUp size={16} className="text-[#567C8D]" />,
      color: "#8b5cf6"
    },
    {
      label: "Risk (low = high score)",
      value: riskInverted,
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