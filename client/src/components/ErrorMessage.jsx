// components/ErrorMessage.jsx
import { AlertTriangle, X } from "lucide-react";

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-50 px-5 py-4">
      <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#2F4156]">Analysis failed</p>
        <p className="text-sm text-[#567C8D] mt-0.5">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#567C8D] hover:text-[#2F4156] transition p-1 shrink-0"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;