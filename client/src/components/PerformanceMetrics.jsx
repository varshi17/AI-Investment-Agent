// components/PerformanceMetrics.jsx
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const PerformanceMetrics = ({ analysis, quote, profile }) => {
  const metrics = [
    {
      label: "AI Confidence",
      value: analysis.confidence || 50,
      icon: <Activity size={16} className="text-blue-400" />,
      color: "#3b82f6"
    },
    {
      label: "Financial Health",
      value: analysis.financial_score || 50,
      icon: <DollarSign size={16} className="text-green-400" />,
      color: "#22c55e"
    },
    {
      label: "Market Position",
      value: Math.min(100, ((quote.c || 0) / (quote.h || 1)) * 100),
      icon: <TrendingUp size={16} className="text-purple-400" />,
      color: "#8b5cf6"
    },
    {
      label: "Growth Potential",
      value: Math.min(100, ((quote.h - quote.l) / (quote.l || 1)) * 100),
      icon: <TrendingDown size={16} className="text-yellow-400" />,
      color: "#eab308"
    }
  ];

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="text-blue-400" size={20} />
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-1">
              {metric.icon}
              <span className="text-sm text-slate-400 flex-1">{metric.label}</span>
              <span className="text-sm font-semibold">{metric.value.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
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

      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <span className="text-xs text-slate-400">P/E Ratio</span>
            <p className="font-semibold text-sm">{analysis.key_metrics?.pe_ratio || 'N/A'}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <span className="text-xs text-slate-400">Target Price</span>
            <p className="font-semibold text-sm">${analysis.key_metrics?.target_price || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;