// components/RecommendationBadge.jsx
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const RecommendationBadge = ({ recommendation, size = "md" }) => {
  const styles = {
    INVEST: {
      bg: "bg-green-500/20",
      border: "border-green-500/50",
      text: "text-green-400",
      icon: <CheckCircle size={size === "lg" ? 20 : 16} />,
      label: "INVEST"
    },
    WATCH: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/50",
      text: "text-yellow-400",
      icon: <AlertCircle size={size === "lg" ? 20 : 16} />,
      label: "WATCH"
    },
    PASS: {
      bg: "bg-red-500/20",
      border: "border-red-500/50",
      text: "text-red-400",
      icon: <XCircle size={size === "lg" ? 20 : 16} />,
      label: "PASS"
    }
  };

  const style = styles[recommendation] || styles.WATCH;
  const sizeClasses = size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-sm";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-2 rounded-full border ${style.bg} ${style.border} ${sizeClasses} font-semibold ${style.text}`}
    >
      {style.icon}
      {style.label}
    </motion.div>
  );
};

export default RecommendationBadge;