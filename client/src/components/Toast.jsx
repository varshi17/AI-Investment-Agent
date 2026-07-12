// components/Toast.jsx
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

const Toast = ({ message, type = "info", onClose }) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon
  };
  
  const colors = {
    success: "bg-green-500/20 border-green-500 text-green-400",
    error: "bg-red-500/20 border-red-500 text-red-400",
    info: "bg-blue-500/20 border-blue-500 text-blue-400"
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 p-4 rounded-xl border ${colors[type]} bg-white shadow-xl max-w-md`}
      >
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-[#2F4156]">{message}</p>
          <button onClick={onClose} className="text-[#567C8D] hover:text-[#2F4156]">×</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;