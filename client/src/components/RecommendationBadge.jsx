// components/RecommendationBadge.jsx
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const RecommendationBadge = ({ recommendation, confidence, size = "md", showStrength = true }) => {
  // ===== FIX: Map common backend values to INVEST/WATCH/PASS =====
  const normalizedRec = (() => {
    const value = (recommendation || "").toUpperCase().trim();
    if (value === "BUY" || value === "STRONG BUY" || value === "INVEST") return "INVEST";
    if (value === "HOLD" || value === "WATCH" || value === "NEUTRAL") return "WATCH";
    if (value === "SELL" || value === "STRONG SELL" || value === "PASS" || value === "AVOID") return "PASS";
    // If already INVEST/WATCH/PASS, keep as is
    if (["INVEST", "WATCH", "PASS"].includes(value)) return value;
    // Default to WATCH
    return "WATCH";
  })();

  // Determine strength based on confidence
  const getStrength = (conf) => {
    if (conf == null) return "Unknown";
    if (conf >= 70) return "Strong";
    if (conf >= 40) return "Moderate";
    return "Weak";
  };

  const strength = getStrength(confidence);
  const strengthColor = confidence >= 70 ? "text-green-400" : confidence >= 40 ? "text-yellow-400" : "text-red-400";
  const strengthIcon = confidence >= 70 ? <TrendingUp size={12} /> : confidence >= 40 ? <Minus size={12} /> : <TrendingDown size={12} />;

  // Get recommendation style details
  const getRecommendationDetails = (rec) => {
    const details = {
      INVEST: {
        bg: "bg-green-500/20",
        border: "border-green-500/50",
        text: "text-green-400",
        hoverBg: "hover:bg-green-500/30",
        icon: <CheckCircle size={size === "lg" ? 20 : 16} />,
        label: "INVEST",
        description: "Strong buy recommendation"
      },
      WATCH: {
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/50",
        text: "text-yellow-400",
        hoverBg: "hover:bg-yellow-500/30",
        icon: <AlertCircle size={size === "lg" ? 20 : 16} />,
        label: "WATCH",
        description: "Hold / Monitor"
      },
      PASS: {
        bg: "bg-red-500/20",
        border: "border-red-500/50",
        text: "text-red-400",
        hoverBg: "hover:bg-red-500/30",
        icon: <XCircle size={size === "lg" ? 20 : 16} />,
        label: "PASS",
        description: "Avoid / Sell"
      }
    };
    return details[rec] || details.WATCH;
  };

  const style = getRecommendationDetails(normalizedRec);

  const sizeClasses = size === "lg" 
    ? "px-8 py-4 text-lg" 
    : size === "sm" 
      ? "px-3 py-1.5 text-xs" 
      : "px-4 py-2 text-sm";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.4 
      }}
      whileHover={{ scale: 1.03 }}
      className={`flex flex-col items-center gap-1 ${size === "lg" ? 'p-2' : 'p-1'}`}
    >
      {/* Main Badge */}
      <div className={`
        flex items-center gap-2 rounded-full border 
        ${style.bg} ${style.border} ${style.hoverBg} 
        ${sizeClasses} font-semibold ${style.text}
        transition-all duration-300
        shadow-lg shadow-${normalizedRec.toLowerCase()}-500/10
        hover:shadow-xl hover:shadow-${normalizedRec.toLowerCase()}-500/20
      `}>
        {style.icon}
        {style.label}
      </div>

      {/* Confidence & Strength Indicator */}
      {showStrength && (confidence || confidence === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-1"
        >
          <div className={`flex items-center gap-1 text-xs ${strengthColor}`}>
            {strengthIcon}
            <span className="font-medium">{strength}</span>
          </div>
          
          <div className="w-px h-3 bg-[#C8D9E6]" />
          
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-[#C8D9E6] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.max(confidence || 0, 0), 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full ${
                  (confidence || 0) >= 70 ? 'bg-green-500' :
                  (confidence || 0) >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>
            <span className="text-xs text-[#567C8D] font-mono">
              {confidence || 0}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Tooltip/Description for lg size */}
      {size === "lg" && style.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-[#567C8D] mt-0.5"
        >
          {style.description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default RecommendationBadge;