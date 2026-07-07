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
  Zap
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

  const popularStocks = [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "GOOGL", name: "Alphabet" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "NVDA", name: "NVIDIA" }
  ];

  // Compact mode for dashboard
  if (compact) {
    return (
      <div ref={wrapperRef} className="relative w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={symbol}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                if (symbol.length >= 2) setShowSuggestions(true);
              }}
              placeholder="Search stock symbol... (⌘K)"
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
            {!symbol && !isLoading && (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded border border-slate-600 hidden sm:block">
                ⌘K
              </kbd>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!symbol.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 text-sm whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
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
              {/* Recent Searches */}
              {recentSearches.length > 0 && suggestions.length === 0 && (
                <div className="p-2">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider px-3 py-1">Recent</p>
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(item)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700/50 rounded-lg transition flex items-center gap-3 text-sm"
                    >
                      <Clock size={14} className="text-slate-500" />
                      <span className="font-semibold">{item}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Search Suggestions */}
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-4 py-2.5 text-left hover:bg-slate-700/50 transition flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{item.symbol}</span>
                    <span className="text-xs text-slate-400 truncate max-w-[150px]">{item.description}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-700/30 px-2 py-0.5 rounded">
                    {item.type || 'Stock'}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full landing page version
  return (
    <div ref={wrapperRef} className="flex flex-col items-center gap-4 w-full max-w-3xl mx-auto">
      <div className="relative w-full">
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 transition duration-500 ${isFocused ? 'opacity-40' : 'opacity-20'}`} />
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={symbol}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                if (symbol.length >= 2) setShowSuggestions(true);
              }}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
              className="w-full px-6 py-4 pl-14 pr-14 rounded-2xl bg-slate-800/90 border-2 border-slate-700 focus:border-blue-500 focus:outline-none transition-all text-lg placeholder-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") clearAll();
              }}
              disabled={isLoading}
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            {symbol && !isLoading && (
              <button
                onClick={clearAll}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            )}
            {isLoading && (
              <LoaderCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={22} />
            )}
          </div>
        </div>

        {/* Suggestions Dropdown - Full */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute w-full mt-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl z-50"
            >
              {/* Recent Searches */}
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
                      <Zap size={16} className="text-yellow-400" />
                      <span className="font-semibold">{item}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Search Suggestions */}
              {suggestions.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full px-5 py-3 text-left hover:bg-slate-700/50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp size={16} className="text-blue-400" />
                    </div>
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
              
              {/* AI Search Tip */}
              <div className="px-5 py-3 border-t border-slate-700 bg-slate-800/50 flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" />
                <span className="text-xs text-slate-400">
                  Powered by Gemini AI — Get instant analysis with confidence scores
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Stocks */}
      <div className="flex flex-wrap gap-2 justify-center">
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
            className="text-sm px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition border border-slate-700 disabled:opacity-50 flex items-center gap-1.5 group"
          >
            <span className="font-semibold">{stock.symbol}</span>
            <span className="text-xs text-slate-500 group-hover:text-slate-400 transition">
              {stock.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Search Button - Separate row */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!symbol.trim() || isLoading}
        className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 rounded-2xl font-semibold transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/25 text-lg flex items-center gap-3 justify-center group"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" size={22} />
            Analyzing...
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
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Enter</kbd> to search</span>
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">⌘K</kbd> to focus</span>
        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">Esc</kbd> to clear</span>
      </div>
    </div>
  );
};

export default SearchBar;