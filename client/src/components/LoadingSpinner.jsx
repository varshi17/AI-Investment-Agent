// LoadingSpinner.jsx - Enhanced version
import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ message = "Analyzing stock data..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <LoaderCircle className="animate-spin text-blue-500" size={60} />
      <p className="mt-4 text-slate-400 animate-pulse">{message}</p>
      <div className="mt-2 flex gap-1">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;