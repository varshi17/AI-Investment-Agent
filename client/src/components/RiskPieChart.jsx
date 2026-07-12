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
    <div className="bg-white rounded-2xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-4">
        <PieChart className="text-[#567C8D]" size={20} />
        <h3 className="text-lg font-semibold text-[#2F4156]">Risk vs Opportunity</h3>
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
            <span className="text-xl font-bold text-[#2F4156]">{total}</span>
            <span className="text-xs text-[#567C8D]">Total Factors</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-[#2F4156]">Risks: {risks.length}</span>
            <span className="text-xs text-[#567C8D] ml-auto">{riskPercentage.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-[#2F4156]">Opportunities: {opportunities.length}</span>
            <span className="text-xs text-[#567C8D] ml-auto">{opportunityPercentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-1" size={16} />
          <span className="text-xs text-[#567C8D]">Risks</span>
          <p className="font-semibold text-[#2F4156]">{risks.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
          <ShieldCheck className="text-green-400 mx-auto mb-1" size={16} />
          <span className="text-xs text-[#567C8D]">Opportunities</span>
          <p className="font-semibold text-[#2F4156]">{opportunities.length}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskPieChart;