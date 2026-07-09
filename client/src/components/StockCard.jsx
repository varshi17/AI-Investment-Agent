// components/StockChart.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ historical }) => {
  if (!historical || historical.s !== "ok") {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold">30 Day Price Chart</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800/30 rounded-xl">
          <AlertCircle className="text-slate-400 mb-2" size={32} />
          <p className="text-slate-400">Historical data unavailable</p>
          <p className="text-xs text-slate-500 mt-1">Try again later or check symbol</p>
        </div>
      </div>
    );
  }

  const labels = historical.t.map((time) =>
    new Date(time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const prices = historical.c;
  const isPositive = prices[prices.length - 1] > prices[0];

  const data = {
    labels,
    datasets: [
      {
        label: "Closing Price",
        data: prices,
        borderColor: isPositive ? '#22c55e' : '#ef4444',
        backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isPositive ? '#22c55e' : '#ef4444',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          maxTicksLimit: 8,
          font: {
            size: 11
          }
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          },
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold">30 Day Price Chart</h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Open:</span>
            <span className="font-medium">${historical.o?.[0]?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Close:</span>
            <span className="font-medium" style={{ color: isPositive ? '#22c55e' : '#ef4444' }}>
              ${historical.c?.[historical.c.length - 1]?.toFixed(2) || 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default StockChart;