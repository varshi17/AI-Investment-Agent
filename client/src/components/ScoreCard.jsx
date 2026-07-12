// components/ScoreCard.jsx
import { motion } from "framer-motion";

const ScoreCard = ({ label, score, level, color }) => {
  const getColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  const bgColor = color || getColor(score || 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 border border-[#C8D9E6] shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-wider text-[#567C8D]">{label}</span>
        <span className="text-2xl font-bold text-[#2F4156]" style={{ color: bgColor }}>
          {score !== undefined && score !== null ? score : 'N/A'}
        </span>
        {level && (
          <span className="text-xs font-medium text-[#567C8D] mt-0.5">{level}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ScoreCard;