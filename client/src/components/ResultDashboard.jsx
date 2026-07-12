// components/ResultDashboard.jsx
import { motion } from "framer-motion";
import StockChart from "./StockChart";
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Target,
  TrendingDown,
  Activity,
  Award,
  Zap,
  Newspaper,
  ExternalLink,
  Clock,
} from "lucide-react";

import RecommendationBadge from "./RecommendationBadge";
import ConfidenceGauge from "./ConfidenceGauge";
import FinancialHealthBar from "./FinancialHealthBar";
import RiskPieChart from "./RiskPieChart";
import PerformanceMetrics from "./PerformanceMetrics";
import KeyStats from "./KeyStats";
import ScoreCard from "./ScoreCard";

const ResultDashboard = ({ result }) => {
  const profile = result.profile || {};
  const quote = result.quote || {};
  const analysis = result.analysis || {};
  const news = result.news || [];
  const scores = result.scores || {};
  const metrics = result.metrics || {};

  // ===== Fix: Derive recommendation from overall score =====
  const overallScore = scores?.overall?.score ?? 50;
  let recommendation = analysis?.recommendation;
  if (!recommendation) {
    if (overallScore >= 80) recommendation = "STRONG BUY";
    else if (overallScore >= 70) recommendation = "BUY";
    else if (overallScore >= 50) recommendation = "HOLD";
    else recommendation = "SELL";
  }

  const confidence = scores?.confidence ?? analysis?.confidence ?? overallScore;
  const financialScore = scores?.financialHealth?.score ?? 0;

  // Price & change
  const currentPrice = Number(quote.currentPrice || 0);
  const previousClose = Number(quote.previousClose || 0);
  const volume = Number(quote.volume || 0);
  const change = currentPrice - previousClose;
  const changePercent = previousClose > 0 ? ((change / previousClose) * 100).toFixed(2) : "0.00";
  const isPositive = change >= 0;

  const formatVolume = (vol) => {
    if (!vol) return 'N/A';
    if (vol >= 1e9) return (vol / 1e9).toFixed(2) + 'B';
    if (vol >= 1e6) return (vol / 1e6).toFixed(2) + 'M';
    if (vol >= 1e3) return (vol / 1e3).toFixed(2) + 'K';
    return vol.toString();
  };

  const handleNewsClick = (url, headline) => {
    if (!url || url === '#') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="space-y-4 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-3xl p-8 border border-[#C8D9E6] shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F5EFEB] p-2 flex items-center justify-center border border-[#C8D9E6]">
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
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#2F4156]">{profile.name || 'N/A'}</h1>
                <span className="text-sm font-semibold bg-[#F5EFEB] border border-[#C8D9E6] px-3 py-1 rounded-full text-[#2F4156]">
                  {profile.ticker || 'N/A'}
                </span>
                <span className="text-xs bg-[#C8D9E6] px-2 py-1 rounded-full text-[#2F4156]">
                  {profile.exchange || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-[#567C8D]">{profile.industry || 'N/A'}</span>
                <span className="text-xs text-[#567C8D]">•</span>
                <span className="text-sm text-[#567C8D]">IPO: {profile.ipo || 'N/A'}</span>
                <span className="text-xs text-[#567C8D]">•</span>
                <span className="text-sm text-[#567C8D]">{profile.country || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end">
                <span className="text-4xl font-extrabold text-[#2F4156]">
                  ${currentPrice > 0 ? currentPrice.toFixed(2) : '0.00'}
                </span>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${isPositive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {changePercent}%
                </div>
              </div>
              <div className="text-sm text-[#567C8D] mt-2">
                Prev Close: ${previousClose > 0 ? previousClose.toFixed(2) : '0.00'} • Vol: {formatVolume(volume)}
              </div>
            </div>
            <RecommendationBadge recommendation={recommendation} confidence={confidence} />
          </div>
        </div>
      </div>

      {/* ===== KEY STATS ===== */}
      <KeyStats profile={profile} quote={quote} analysis={analysis} />

      {/* ===== GAUGES ROW ===== */}
      <div className="grid lg:grid-cols-3 gap-4">
        <ConfidenceGauge confidence={confidence} label="Investment Confidence" />
        <FinancialHealthBar score={financialScore} />
        <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-yellow-400" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">Recommendation</h4>
          </div>
          <div className="flex flex-col items-center justify-center h-24">
            <RecommendationBadge recommendation={recommendation} size="lg" confidence={confidence} />
            <p className="text-xs text-[#567C8D] mt-2">Based on Financial Analysis</p>
          </div>
        </div>
      </div>

      {/* ===== SCORES GRID ===== */}
      {scores && Object.keys(scores).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ScoreCard label="Overall" score={scores.overall?.score} level={scores.overall?.level} />
          <ScoreCard label="Financial Health" score={scores.financialHealth?.score} level={scores.financialHealth?.level} />
          <ScoreCard label="Growth" score={scores.growth?.score} level={scores.growth?.level} />
          <ScoreCard label="Valuation" score={scores.valuation?.score} level={scores.valuation?.level} />
          <ScoreCard 
            label="Risk" 
            score={scores.risk?.score} 
            level={scores.risk?.level} 
            color={scores.risk?.score > 60 ? '#ef4444' : '#22c55e'} 
          />
        </div>
      )}

      {/* ===== CHART & METRICS ===== */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StockChart historical={result.chart || result.historical} />
        </div>
        <div>
          <PerformanceMetrics 
            analysis={analysis} 
            quote={quote} 
            profile={profile} 
            scores={scores} 
            metrics={metrics} 
          />
        </div>
      </div>

      {/* ===== RISK/OPPORTUNITY + INVESTMENT THESIS ===== */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RiskPieChart risks={analysis.risks || []} opportunities={analysis.opportunities || []} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-[#567C8D]" size={18} />
              <h4 className="text-sm font-semibold text-[#2F4156]">Investment Thesis</h4>
            </div>
            <p className="text-[#567C8D] leading-relaxed">
              {analysis.investment_thesis || 'Analysis currently unavailable.'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== COMPANY INFO ===== */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="text-[#567C8D]" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">About Company</h4>
          </div>
          <p className="text-sm text-[#567C8D] leading-relaxed">
            {profile.name} is a {profile.industry} company listed on {profile.exchange}. 
            Market Capitalization: {profile.marketCapString || 'N/A'}.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-green-400" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">Financial Health</h4>
          </div>
          <p className="text-sm text-[#567C8D] leading-relaxed">
            {analysis.summary || 'Financial analysis unavailable.'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-[#567C8D]" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">Overall Investment Score</h4>
          </div>
          <p className="text-sm text-[#567C8D] leading-relaxed">
            Score: {scores?.overall?.score ?? 'N/A'} — Recommendation: {recommendation}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="text-yellow-400" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">News Impact & Thesis</h4>
          </div>
          <p className="text-sm text-[#567C8D] leading-relaxed">
            {analysis.investment_thesis || 'No thesis available.'}
          </p>
        </div>
      </div>

      {/* ===== RISKS & OPPORTUNITIES LISTS ===== */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-red-500/20 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-400" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">Potential Risks</h4>
          </div>
          <div className="space-y-2">
            {(analysis.risks && analysis.risks.length > 0) ? (
              analysis.risks.map((risk, index) => (
                <div key={index} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <span className="text-red-400 text-xs mt-0.5">•</span>
                  <p className="text-sm text-[#2F4156]">{risk}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#567C8D]">No risks identified</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-green-500/20 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-green-400" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">Growth Opportunities</h4>
          </div>
          <div className="space-y-2">
            {(analysis.opportunities && analysis.opportunities.length > 0) ? (
              analysis.opportunities.map((item, index) => (
                <div key={index} className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <span className="text-green-400 text-xs mt-0.5">•</span>
                  <p className="text-sm text-[#2F4156]">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#567C8D]">No opportunities identified</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== NEWS ===== */}
      <div className="bg-white rounded-2xl p-5 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="text-[#567C8D]" size={18} />
            <h4 className="text-sm font-semibold text-[#2F4156]">Latest News</h4>
            {news && news.length > 0 && (
              <span className="text-xs bg-[#F5EFEB] text-[#567C8D] px-2 py-0.5 rounded-full">
                {news.length} articles
              </span>
            )}
          </div>
          {news && news.length > 0 && (
            <span className="text-xs text-[#567C8D] flex items-center gap-1">
              <Clock size={12} />
              Last 7 days
            </span>
          )}
        </div>

        {news && news.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {news.slice(0, 8).map((item, index) => {
              const hasValidUrl = item.url && item.url !== '#' && item.url.startsWith('http');
              const articleUrl = hasValidUrl ? item.url : `https://news.google.com/search?q=${encodeURIComponent(item.headline || profile.ticker || 'stock')}`;
              return (
                <div
                  key={index}
                  onClick={() => handleNewsClick(articleUrl, item.headline)}
                  className="group bg-white rounded-xl overflow-hidden transition-all duration-300 border border-[#C8D9E6] hover:border-[#567C8D] hover:shadow-xl flex flex-col h-full cursor-pointer"
                >
                  {item.image && (
                    <div className="h-36 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.headline || 'News image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-medium text-[#567C8D] bg-[#F5EFEB] px-2 py-0.5 rounded-full">
                        {item.source || 'News'}
                      </span>
                      {item.datetime && (
                        <span className="text-[10px] text-[#567C8D]">
                          {new Date(item.datetime * 1000).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-semibold text-[#2F4156] line-clamp-2 group-hover:text-[#567C8D] transition flex-1">
                      {item.headline || 'No headline'}
                    </h5>
                    {item.summary && (
                      <p className="text-xs text-[#567C8D] mt-2 line-clamp-2 flex-1">
                        {item.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#C8D9E6]">
                      <span className="text-[10px] text-[#567C8D] flex items-center gap-1 group-hover:gap-2 transition-all">
                        <ExternalLink size={10} />
                        {hasValidUrl ? 'Read article' : 'Search article'}
                      </span>
                      <span className="text-[10px] text-[#567C8D]">{item.source}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Newspaper className="text-[#C8D9E6] mb-3" size={40} />
            <p className="text-[#567C8D] text-sm">No news available for this company</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultDashboard;
