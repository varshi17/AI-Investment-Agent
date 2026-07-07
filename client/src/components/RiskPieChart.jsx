// components/RiskPieChart.jsx
import { motion } from "framer-motion";
import { PieChart, AlertTriangle, ShieldCheck } from "lucide-react";

const RiskPieChart = ({ risks = [], opportunities = [] }) => {
  const total = risks.length + opportunities.length;
  const riskPercentage = total > 0 ? (risks.length / total) * 100 : 50;
  const opportunityPercentage = total > 0 ? (opportunities.length / total) * 100 : 50;

  const circumference = 2 * Math.PI * 40;
  const riskOffset = (riskPercentage / 100) * circumference;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <PieChart className="text-purple-400" size={20} />
        <h3 className="text-lg font-semibold">Risk vs Opportunity</h3>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Risk segment */}
            <motion.circle
              cx="64"
              cy="64"
              r="40"
              stroke="#ef4444"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - riskOffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            {/* Opportunity segment */}
            <motion.circle
              cx="64"
              cy="64"
              r="40"
              stroke="#22c55e"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -opportunityPercentage / 100 * circumference }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{total}</span>
            <span className="text-xs text-slate-400">Total Factors</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Risks: {risks.length}</span>
            <span className="text-xs text-slate-400 ml-auto">{riskPercentage.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Opportunities: {opportunities.length}</span>
            <span className="text-xs text-slate-400 ml-auto">{opportunityPercentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-2 text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-1" size={16} />
          <span className="text-xs text-slate-400">Risks</span>
          <p className="font-semibold">{risks.length}</p>
        </div>
        <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-2 text-center">
          <ShieldCheck className="text-green-400 mx-auto mb-1" size={16} />
          <span className="text-xs text-slate-400">Opportunities</span>
          <p className="font-semibold">{opportunities.length}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskPieChart;