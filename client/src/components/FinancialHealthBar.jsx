// components/FinancialHealthBar.jsx
import { motion } from "framer-motion";
import { BadgeDollarSign } from "lucide-react";

const FinancialHealthBar = ({ score = 50, label = "Financial Health Score" }) => {
  const getColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const color = getColor(score);
  const statusLabel = getLabel(score);

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <BadgeDollarSign className="text-green-400" size={20} />
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold" style={{ color }}>
            {score}/100
          </span>
          <span className="text-sm text-slate-400">{statusLabel}</span>
        </div>

        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500">
          <span>0</span>
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthBar;