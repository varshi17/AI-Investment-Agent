// components/SearchBar.jsx
import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  X, 
  TrendingUp, 
  LoaderCircle, 
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Brain,
  DollarSign,
  TrendingUp as TrendingUpIcon,
  Newspaper,
  Shield,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

const SearchBar = ({ onSearch, isLoading, compact = false }) => {
  const [symbol, setSymbol] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (symbol) => {
    const updated = [symbol, ...recentSearches.filter(s => s !== symbol)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading animation states
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Analyzing financial data...",
    "Researching market trends...",
    "Evaluating company metrics...",
    "Generating AI insights..."
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsFetching(true);
    try {
      const response = await API.get(`/search?q=${query}`);
      setSuggestions(response.data.slice(0, 8));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSymbol(value);
    setShowSuggestions(true);
    setIsFocused(true);
    fetchSuggestions(value);
  };

  const handleSubmit = () => {
    if (!symbol.trim() || isLoading) return;
    const searchSymbol = symbol.trim().toUpperCase();
    saveRecentSearch(searchSymbol);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(searchSymbol);
  };

  const handleSuggestionClick = (item) => {
    const symbol = item.symbol;
    setSymbol(symbol);
    saveRecentSearch(symbol);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(symbol);
  };

  const handleRecentClick = (symbol) => {
    setSymbol(symbol);
    saveRecentSearch(symbol);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(symbol);
  };

  const clearAll = () => {
    setSymbol("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Company icons for suggestions
  const getCompanyIcon = (symbol) => {
    const icons = {
      'AAPL': '🍎',
      'TSLA': '⚡',
      'MSFT': '🪟',
      'GOOGL': '🔍',
      'AMZN': '🛒',
      'NVDA': '🟢',
      'META': '📱',
      'NFLX': '🎬',
      'UBER': '🚗',
      'PYPL': '💳',
      'DIS': '🏰',
      'KO': '🥤',
      'PEP': '🥤',
      'NKE': '👟',
      'WMT': '🛍️'
    };
    return icons[symbol] || '📈';
  };

  const popularStocks = [
    { symbol: "AAPL", name: "Apple", icon: "🍎" },
    { symbol: "TSLA", name: "Tesla", icon: "⚡" },
    { symbol: "NVDA", name: "NVIDIA", icon: "🟢" },
    { symbol: "MSFT", name: "Microsoft", icon: "🪟" },
    { symbol: "AMZN", name: "Amazon", icon: "🛒" },
    { symbol: "GOOGL", name: "Google", icon: "🔍" }
  ];

  // Compact mode for dashboard
  if (compact) {
    return (
      <div ref={wrapperRef} className="relative w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <div className={`relative rounded-xl transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20' : ''}`}>
              <input
                ref={inputRef}
                type="text"
                value={symbol}
                onChange={handleInputChange}
                onFocus={() => {
                  setIsFocused(true);
                  if (symbol.length >= 2) setShowSuggestions(true);
                }}
                placeholder="Search stock symbol... (Ctrl+K)"
                className="w-full px-4 py-3 pl-11 pr-12 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-blue-500 focus:outline-none transition-all text-sm placeholder-slate-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                  if (e.key === "Escape") clearAll();
                }}
                disabled={isLoading}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              {symbol && !isLoading && (
                <button
                  onClick={clearAll}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              )}
              {isLoading && (
                <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={18} />
              )}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!symbol.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-sm whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" size={16} />
                Analyzing...
              </>
            ) : (
              <>
                Analyze
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </div>

        {/* Suggestions Dropdown - Compact */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute w-full mt-1 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden shadow-2xl z-50"
            >
              {recentSearches.length > 0 && suggestions.length === 0 && (
                <div className="p-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider px-3 py-1 flex items-center gap-2">
                    <Clock size={12} />
                    Recent Searches
                  </p>
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(item)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition flex items-center gap-3 text-sm"
                    >
                      <span className="text-lg">{getCompanyIcon(item)}</span>
                      <span className="font-semibold">{item}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {suggestions.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-700/50 hover:border-l-2 hover:border-blue-500 transition flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCompanyIcon(item.symbol)}</span>
                    <div>
                      <span className="font-semibold">{item.symbol}</span>
                      <span className="text-xs text-slate-400 ml-2">{item.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-700/30 px-2 py-0.5 rounded-full">
                    {item.type || 'Stock'}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full landing page version - PREMIUM
  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto">
      {/* Premium Glass Container */}
      <div className="relative w-full">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/20 via-violet-500/20 to-cyan-500/20 blur-xl" />
        
        <div className={`relative premium-card p-3 rounded-3xl bg-slate-900/80 backdrop-blur-xl border transition-all duration-300 ${
          isFocused ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'border-slate-700/50'
        }`}>
          {/* Search Row */}
          <div className="flex items-center gap-3">
            <Search className="text-slate-400 ml-2" size={22} />
            
            <input
              ref={inputRef}
              type="text"
              value={symbol}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                if (symbol.length >= 2) setShowSuggestions(true);
              }}
              placeholder="Search Apple, Tesla, Microsoft..."
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-slate-500 py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") clearAll();
              }}
              disabled={isLoading}
              autoFocus
            />
            
            {symbol && !isLoading && (
              <button
                onClick={clearAll}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X size={18} />
              </button>
            )}
            
            {isLoading && (
              <LoaderCircle className="text-blue-500 animate-spin" size={20} />
            )}
            
            {/* Keyboard Shortcut */}
            <kbd className="text-[10px] text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700 hidden sm:block">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Suggestions Dropdown - Full Premium */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute w-full mt-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl z-50"
            >
              {recentSearches.length > 0 && suggestions.length === 0 && (
                <div className="p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider px-3 py-1 flex items-center gap-2">
                    <Clock size={14} />
                    Recent Searches
                  </p>
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(item)}
                      className="w-full px-3 py-2.5 text-left hover:bg-slate-700/50 rounded-xl transition flex items-center gap-3"
                    >
                      <span className="text-xl">{getCompanyIcon(item)}</span>
                      <span className="font-semibold">{item}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {suggestions.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-5 py-3 text-left hover:bg-slate-700/50 hover:border-l-2 hover:border-blue-500 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getCompanyIcon(item.symbol)}</span>
                    <div>
                      <span className="font-semibold">{item.symbol}</span>
                      <span className="text-sm text-slate-400 ml-3">{item.description}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-700/30 px-2.5 py-1 rounded-full">
                    {item.type || 'Stock'}
                  </span>
                </motion.button>
              ))}
              
              {/* AI Tip - Updated */}
              <div className="px-5 py-3 border-t border-slate-700 bg-gradient-to-r from-blue-500/5 to-purple-500/5 flex items-start gap-3">
                <Sparkles size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400">
                    <span className="text-blue-400 font-medium">AI analyzes</span> Financial Health · Risk · Growth · News · Valuation
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Powered by Gemini AI — Instant insights in seconds
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Stocks - Premium Glass Chips */}
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        <span className="text-sm text-slate-400 flex items-center gap-1">
          <Zap size={14} className="text-yellow-400" />
          Popular:
        </span>
        {popularStocks.map((stock) => (
          <motion.button
            key={stock.symbol}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSymbol(stock.symbol);
              onSearch(stock.symbol);
              saveRecentSearch(stock.symbol);
            }}
            disabled={isLoading}
            className="text-sm px-4 py-1.5 rounded-full bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/80 transition border border-slate-700/50 hover:border-slate-600 disabled:opacity-50 flex items-center gap-2 group shadow-lg shadow-black/10"
          >
            <span className="text-base">{stock.icon}</span>
            <span className="font-semibold">{stock.symbol}</span>
            <span className="text-xs text-slate-500 group-hover:text-slate-400 transition hidden sm:inline">
              {stock.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Analyze Button - Premium */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!symbol.trim() || isLoading}
        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 text-lg flex items-center gap-3 justify-center group"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" size={22} />
            <span className="flex items-center gap-1">
              Analyzing
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </span>
            <span className="text-xs text-blue-300/70 font-normal hidden sm:inline">
              {loadingMessages[loadingStep]}
            </span>
          </>
        ) : (
          <>
            <Sparkles size={20} className="text-yellow-300" />
            Analyze Stock
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </>
        )}
      </motion.button>

      {/* Keyboard Shortcut Hint */}
      <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap justify-center">
        <span>Press <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">Enter</kbd> to search</span>
        <span>Press <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">Ctrl + K</kbd> to focus</span>
        <span>Press <kbd className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono">Esc</kbd> to clear</span>
      </div>
    </div>
  );
};

export default SearchBar;