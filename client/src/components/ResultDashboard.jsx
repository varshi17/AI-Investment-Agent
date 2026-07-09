// components/ResultDashboard.jsx
import { motion } from "framer-motion";
import StockChart from "./StockChart";
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Target,
  TrendingDown,
  DollarSign,
  Globe,
  Calendar,
  Activity,
  Award,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Newspaper,
  ExternalLink,
  Clock,
  User
} from "lucide-react";

import RecommendationBadge from "./RecommendationBadge";
import ConfidenceGauge from "./ConfidenceGauge";
import FinancialHealthBar from "./FinancialHealthBar";
import RiskPieChart from "./RiskPieChart";
import PerformanceMetrics from "./PerformanceMetrics";
import KeyStats from "./KeyStats";

const ResultDashboard = ({ result }) => {
  const profile = result.profile || {};
  const quote = result.quote || {};
  const analysis = result.analysis || {};
  const news = result.news || [];

  const change = quote.c - quote.pc;
  const changePercent = quote.pc ? ((change / quote.pc) * 100).toFixed(2) : 0;
  const isPositive = change >= 0;

  // Debug: Log news data
  console.log("📰 News Data:", news);
  console.log("📰 News Count:", news?.length);

  // Function to handle news click
  const handleNewsClick = (url, headline) => {
    if (!url || url === '#' || url === '') {
      // If no valid URL, show a toast or alert
      alert(`🔗 Full article: "${headline}"\n\nPlease visit the source website for the complete article.`);
      return;
    }
    // Open in new tab if valid URL
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to get valid URL or fallback
  const getValidUrl = (url, headline) => {
    if (url && url !== '#' && url.startsWith('http')) {
      return url;
    }
    // Return a search URL as fallback
    return `https://news.google.com/search?q=${encodeURIComponent(headline)}`;
  };

  return (
    <motion.div
      className="space-y-4 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===== HEADER WITH STOCK INFO ===== */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/10 p-2 flex items-center justify-center border-2 border-blue-500/30">
              <img
                src={profile.logo || `https://ui-avatars.com/api/?name=${profile.name || 'Stock'}&size=64&background=1e293b&color=3b82f6&bold=true`}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-contain"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${profile.name || 'Stock'}&size=64&background=1e293b&color=3b82f6&bold=true`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name || 'N/A'}</h1>
                <span className="text-sm font-mono bg-slate-700 px-3 py-1 rounded-full text-slate-300">
                  {profile.ticker || 'N/A'}
                </span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">
                  {profile.exchange || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-slate-400">{profile.finnhubIndustry || 'N/A'}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-sm text-slate-400">IPO: {profile.ipo || 'N/A'}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-sm text-slate-400">{profile.country || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end">
                <span className="text-3xl font-bold">${quote.c?.toFixed(2) || '0.00'}</span>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {changePercent}%
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Prev Close: ${quote.pc?.toFixed(2) || '0.00'} • Vol: {formatVolume(quote.v)}
              </div>
            </div>
            <RecommendationBadge recommendation={analysis.recommendation} />
          </div>
        </div>
      </div>

      {/* ===== KEY STATS GRID ===== */}
      <KeyStats profile={profile} quote={quote} analysis={analysis} />

      {/* ===== AI ANALYSIS ROW ===== */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ConfidenceGauge confidence={analysis.confidence || 50} />
        <FinancialHealthBar score={analysis.financial_score || 50} />
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-yellow-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Recommendation</h4>
          </div>
          <div className="flex flex-col items-center justify-center h-24">
            <RecommendationBadge recommendation={analysis.recommendation} size="lg" />
            <p className="text-xs text-slate-400 mt-2">Based on AI Analysis</p>
          </div>
        </div>
      </div>

      {/* ===== CHART & METRICS ROW ===== */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StockChart historical={result.historical} />
        </div>
        <div>
          <PerformanceMetrics analysis={analysis} quote={quote} profile={profile} />
        </div>
      </div>

      {/* ===== RISK & OPPORTUNITY ROW ===== */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RiskPieChart risks={analysis.risks || []} opportunities={analysis.opportunities || []} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-blue-400" size={18} />
              <h4 className="text-sm font-semibold text-slate-300">Investment Thesis</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {analysis.investment_thesis || 'Analysis currently unavailable. Please try again later.'}
            </p>
            {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700">
                {Object.entries(analysis.key_metrics).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="bg-slate-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-400 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm font-semibold mt-1">{value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== COMPANY ANALYSIS ===== */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="text-blue-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">About Company</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.company_explanation || 'No company description available.'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-green-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Financial Health</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.financial_health || 'Financial analysis unavailable.'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-purple-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Market Position</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.market_position || 'Market position analysis unavailable.'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-yellow-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Recent News Impact</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.recent_news_impact || 'News impact analysis unavailable.'}
          </p>
        </div>
      </div>

      {/* ===== RISKS & OPPORTUNITIES ===== */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Potential Risks</h4>
          </div>
          <div className="space-y-2">
            {(analysis.risks && analysis.risks.length > 0) ? (
              analysis.risks.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 bg-red-950/20 border border-red-500/20 rounded-lg p-3"
                >
                  <span className="text-red-400 text-xs mt-0.5">•</span>
                  <p className="text-sm text-slate-300">{risk}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No risks identified</p>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-green-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Growth Opportunities</h4>
          </div>
          <div className="space-y-2">
            {(analysis.opportunities && analysis.opportunities.length > 0) ? (
              analysis.opportunities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 bg-green-950/20 border border-green-500/20 rounded-lg p-3"
                >
                  <span className="text-green-400 text-xs mt-0.5">•</span>
                  <p className="text-sm text-slate-300">{item}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No opportunities identified</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== NEWS SECTION - FIXED LINKS ===== */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="text-blue-400" size={18} />
            <h4 className="text-sm font-semibold text-slate-300">Latest News</h4>
            {news && news.length > 0 && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                {news.length} articles
              </span>
            )}
          </div>
          {news && news.length > 0 && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock size={12} />
              Last 7 days
            </span>
          )}
        </div>

        {news && news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {news.slice(0, 8).map((item, index) => {
              // Check if URL is valid
              const hasValidUrl = item.url && item.url !== '#' && item.url.startsWith('http');
              const articleUrl = hasValidUrl ? item.url : `https://news.google.com/search?q=${encodeURIComponent(item.headline || profile.ticker || 'stock')}`;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNewsClick(articleUrl, item.headline)}
                  className={`group bg-slate-800/50 rounded-xl overflow-hidden transition-all duration-300 border border-slate-700 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 flex flex-col h-full ${hasValidUrl ? 'hover:bg-slate-700/50 cursor-pointer' : 'cursor-pointer'}`}
                >
                  {item.image && (
                    <div className="h-36 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.headline || 'News image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {item.source || 'News'}
                      </span>
                      {item.datetime && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.datetime * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition flex-1">
                      {item.headline || 'No headline'}
                    </h5>
                    {item.summary && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 flex-1">
                        {item.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/50">
                      <span className="text-[10px] text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        <ExternalLink size={10} />
                        {hasValidUrl ? 'Read article' : 'Search article'}
                      </span>
                      {item.source && (
                        <span className="text-[10px] text-slate-600">
                          {item.source}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Newspaper className="text-slate-600 mb-3" size={40} />
            <p className="text-slate-400 text-sm">No news available for this company</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different symbol</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Helper function
function formatVolume(volume) {
  if (!volume) return 'N/A';
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B';
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M';
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K';
  return volume.toString();
}

export default ResultDashboard;