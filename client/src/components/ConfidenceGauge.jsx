// components/ConfidenceGauge.jsx
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const ConfidenceGauge = ({ confidence = 50, label = "AI Confidence Score" }) => {
  const circumference = 2 * Math.PI * 45;
  const progress = (confidence / 100) * circumference;
  const color = confidence >= 70 ? '#22c55e' : confidence >= 40 ? '#eab308' : '#ef4444';

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="text-blue-400" size={20} />
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#1e293b"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold"
              style={{ color }}
            >
              {confidence}%
            </motion.span>
          </div>
        </div>
        
        <div className="flex-1 ml-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Low</span>
              <span className="text-slate-400">High</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <motion.div
                  key={level}
                  className="h-2 flex-1 rounded-full"
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: level * 20 <= confidence ? 1 : 0.3,
                    backgroundColor: level * 20 <= confidence 
                      ? color 
                      : '#1e293b'
                  }}
                  transition={{ duration: 0.5, delay: level * 0.1 }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceGauge;