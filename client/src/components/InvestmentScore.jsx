// components/InvestmentScore.jsx - New component
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const InvestmentScore = ({ analysis }) => {
  const { recommendation, confidence, financial_score } = analysis;
  
  // Calculate overall score
  const overallScore = Math.round((confidence + financial_score) / 2);
  
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreLabel = (score) => {
    if (score >= 70) return 'Strong Buy';
    if (score >= 40) return 'Neutral';
    return 'Avoid';
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Investment Score</h3>
        <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">AI Confidence</span>
            <span className="text-white">{confidence}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full mt-1">
            <motion.div
              className="h-2 rounded-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Financial Health</span>
            <span className="text-white">{financial_score}/100</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full mt-1">
            <motion.div
              className="h-2 rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${financial_score}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
        
        <div className="pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Recommendation</span>
            <div className={`flex items-center gap-2 font-semibold ${getScoreColor(overallScore)}`}>
              {overallScore >= 70 && <TrendingUp size={16} />}
              {overallScore >= 40 && overallScore < 70 && <Minus size={16} />}
              {overallScore < 40 && <TrendingDown size={16} />}
              {getScoreLabel(overallScore)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentScore;