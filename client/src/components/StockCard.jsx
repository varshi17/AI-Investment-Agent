// components/StockCard.jsx
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const StockCard = ({ symbol, name, price, change, changePercent }) => {
    const isPositive = change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold">{symbol}</h3>
                    <p className="text-slate-400 text-sm mt-1">{name}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">${price?.toFixed(2) || 'N/A'}</p>
                    <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? (
                            <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                            {change?.toFixed(2)} ({changePercent?.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StockCard;