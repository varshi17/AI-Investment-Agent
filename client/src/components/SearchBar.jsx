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

// ===== COMPANY NAME TO SYMBOL MAPPING =====
const COMPANY_SYMBOL_MAP = {
  'APPLE': 'AAPL',
  'GOOGLE': 'GOOGL',
  'GOOG': 'GOOGL',
  'FACEBOOK': 'META',
  'META': 'META',
  'MICROSOFT': 'MSFT',
  'AMAZON': 'AMZN',
  'TESLA': 'TSLA',
  'NVIDIA': 'NVDA',
  'NETFLIX': 'NFLX',
  'ALPHABET': 'GOOGL',
  'BERKSHIRE': 'BRK.B',
  'BERKSHIRE HATHAWAY': 'BRK.B',
  'JPMORGAN': 'JPM',
  'JPM': 'JPM',
  'VISA': 'V',
  'MASTERCARD': 'MA',
  'UNITEDHEALTH': 'UNH',
  'JOHNSON & JOHNSON': 'JNJ',
  'JNJ': 'JNJ',
  'WALMART': 'WMT',
  'EXXON': 'XOM',
  'EXXON MOBIL': 'XOM',
  'CHEVRON': 'CVX',
  'PROCTER & GAMBLE': 'PG',
  'PG': 'PG',
  'BANK OF AMERICA': 'BAC',
  'BAC': 'BAC',
  'HOME DEPOT': 'HD',
  'HD': 'HD',
  'COSTCO': 'COST',
  'COST': 'COST',
  'DISNEY': 'DIS',
  'DIS': 'DIS',
  'MCDONALDS': 'MCD',
  'MCD': 'MCD',
  'CISCO': 'CSCO',
  'CSCO': 'CSCO',
  'PEPSICO': 'PEP',
  'PEP': 'PEP',
  'COCA COLA': 'KO',
  'COKE': 'KO',
  'KO': 'KO',
  'MERCK': 'MRK',
  'MRK': 'MRK',
  'INTEL': 'INTC',
  'INTC': 'INTC',
  'IBM': 'IBM',
  'GE': 'GE',
  'GENERAL ELECTRIC': 'GE',
  'WFC': 'WFC',
  'WELLS FARGO': 'WFC',
  'TMO': 'TMO',
  'THERMO FISHER': 'TMO',
  'ABT': 'ABT',
  'ABBOTT': 'ABT',
  'DHR': 'DHR',
  'DANAHER': 'DHR',
  'HON': 'HON',
  'HONEYWELL': 'HON',
  'UPS': 'UPS',
  'UNITED PARCEL': 'UPS',
  'BA': 'BA',
  'BOEING': 'BA',
  'SBUX': 'SBUX',
  'STARBUCKS': 'SBUX',
  'NKE': 'NKE',
  'NIKE': 'NKE',
  'TGT': 'TGT',
  'TARGET': 'TGT',
  'LOW': 'LOW',
  'LOWES': 'LOW'
};

// Helper function to map company name to symbol
const mapToSymbol = (input) => {
  const upperInput = input.toUpperCase().trim();
  
  // Check if it's a company name in our map
  if (COMPANY_SYMBOL_MAP[upperInput]) {
    return COMPANY_SYMBOL_MAP[upperInput];
  }
  
  // If it's already a symbol (1-5 letters, all caps), return as is
  if (/^[A-Z]{1,5}$/.test(upperInput)) {
    return upperInput;
  }
  
  // Otherwise, return the input (let backend try to resolve)
  return upperInput;
};

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
    
    // ===== FIXED: Map company name to symbol =====
    const searchInput = symbol.trim().toUpperCase();
    const mappedSymbol = mapToSymbol(searchInput);
    
    saveRecentSearch(mappedSymbol);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(mappedSymbol);
  };

  const handleSuggestionClick = (item) => {
    const symbol = item.symbol;
    // Map to proper symbol if it's a company name
    const mappedSymbol = mapToSymbol(symbol);
    setSymbol(mappedSymbol);
    saveRecentSearch(mappedSymbol);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(mappedSymbol);
  };

  const handleRecentClick = (symbol) => {
    const mappedSymbol = mapToSymbol(symbol);
    setSymbol(mappedSymbol);
    saveRecentSearch(mappedSymbol);
    setShowSuggestions(false);
    setIsFocused(false);
    onSearch(mappedSymbol);
  };

  const clearAll = () => {
    setSymbol("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Ticker badge initials
  const getTickerInitial = (symbol) => (symbol ? symbol.charAt(0).toUpperCase() : "?");

  const popularStocks = [
    { symbol: "AAPL", name: "Apple" },
    { symbol: "TSLA", name: "Tesla" },
    { symbol: "NVDA", name: "NVIDIA" },
    { symbol: "MSFT", name: "Microsoft" },
    { symbol: "AMZN", name: "Amazon" },
    { symbol: "GOOGL", name: "Google" }
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
            className="px-6 py-3 bg-[#2F4156] hover:bg-[#567C8D] text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl text-sm whitespace-nowrap flex items-center justify-center gap-2 min-w-[120px]"
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
              className="absolute w-full mt-1 bg-white rounded-xl border border-[#C8D9E6] overflow-hidden shadow-2xl z-50"
            >
              {recentSearches.length > 0 && suggestions.length === 0 && (
                <div className="p-2">
                  <p className="text-[10px] text-[#567C8D] uppercase tracking-wider px-3 py-1 flex items-center gap-2">
                    <Clock size={12} />
                    Recent Searches
                  </p>
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(item)}
                      className="w-full px-3 py-2 text-left hover:bg-[#F5EFEB] rounded-lg transition flex items-center gap-3 text-sm"
                    >
                      <span className="h-7 w-7 shrink-0 rounded-md bg-[#F5EFEB] border border-[#C8D9E6] flex items-center justify-center text-xs font-bold text-[#567C8D]">
                        {getTickerInitial(item)}
                      </span>
                      <span className="font-semibold text-[#2F4156]">{item}</span>
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
                  className="w-full px-4 py-2.5 text-left hover:bg-[#F5EFEB] hover:border-l-2 hover:border-[#567C8D] transition flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 shrink-0 rounded-md bg-[#F5EFEB] border border-[#C8D9E6] flex items-center justify-center text-xs font-bold text-[#567C8D]">
                      {getTickerInitial(item.symbol)}
                    </span>
                    <div>
                      <span className="font-semibold text-[#2F4156]">{item.symbol}</span>
                      <span className="text-xs text-[#567C8D] ml-2">{item.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#567C8D] bg-[#F5EFEB] px-2 py-0.5 rounded-full">
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
    <div ref={wrapperRef} className="flex flex-col items-center gap-5 w-full max-w-4xl mx-auto">
      {/* Premium Container */}
      <div className="relative w-full">
        <div className={`relative premium-card p-3 rounded-2xl bg-white border transition-all duration-300 ${
          isFocused ? 'border-[#567C8D] shadow-xl shadow-[#567C8D]/10' : 'border-[#C8D9E6]'
        }`}>
          {/* Search Row */}
          <div className="flex items-center gap-3">
            <Search className="text-[#567C8D] ml-2" size={22} />
            
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
              className="flex-1 bg-transparent outline-none text-lg text-[#2F4156] placeholder:text-[#567C8D]/70 py-3"
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
                className="text-[#567C8D] hover:text-[#2F4156] transition p-1"
              >
                <X size={18} />
              </button>
            )}
            
            {isLoading && (
              <LoaderCircle className="text-[#567C8D] animate-spin" size={20} />
            )}
            
            {/* Keyboard Shortcut */}
            <kbd className="text-[10px] text-[#567C8D] bg-[#F5EFEB] px-2 py-1 rounded border border-[#C8D9E6] hidden sm:block">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Suggestions Dropdown - Premium */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute w-full mt-2 bg-white rounded-2xl border border-[#C8D9E6] overflow-hidden shadow-2xl z-50"
            >
              {recentSearches.length > 0 && suggestions.length === 0 && (
                <div className="p-3">
                  <p className="text-xs text-[#567C8D] uppercase tracking-wider px-3 py-1 flex items-center gap-2">
                    <Clock size={14} />
                    Recent Searches
                  </p>
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(item)}
                      className="w-full px-3 py-2.5 text-left hover:bg-[#F5EFEB] rounded-xl transition flex items-center gap-3"
                    >
                      <span className="h-8 w-8 shrink-0 rounded-lg bg-[#F5EFEB] border border-[#C8D9E6] flex items-center justify-center text-sm font-bold text-[#567C8D]">
                        {getTickerInitial(item)}
                      </span>
                      <span className="font-semibold text-[#2F4156]">{item}</span>
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
                  className="w-full px-5 py-3 text-left hover:bg-[#F5EFEB] hover:border-l-2 hover:border-[#567C8D] transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="h-9 w-9 shrink-0 rounded-lg bg-[#F5EFEB] border border-[#C8D9E6] flex items-center justify-center text-sm font-bold text-[#567C8D]">
                      {getTickerInitial(item.symbol)}
                    </span>
                    <div>
                      <span className="font-semibold text-[#2F4156]">{item.symbol}</span>
                      <span className="text-sm text-[#567C8D] ml-3">{item.description}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#567C8D] bg-[#F5EFEB] px-2.5 py-1 rounded-full">
                    {item.type || 'Stock'}
                  </span>
                </motion.button>
              ))}
              
              {/* AI Tip */}
              <div className="px-5 py-3 border-t border-[#C8D9E6] bg-gradient-to-r from-[#567C8D]/5 to-[#2F4156]/5 flex items-start gap-3">
                <Sparkles size={16} className="text-[#567C8D] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-[#2F4156]">
                    <span className="text-[#567C8D] font-medium">AI analyzes</span> Financial Health · Risk · Growth · News · Valuation
                  </p>
                  <p className="text-[10px] text-[#567C8D] mt-0.5">
                    Powered by Gemini AI — Instant insights in seconds
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!symbol.trim() || isLoading}
        className="
          px-10
          py-4
          bg-[#2F4156]
          hover:bg-[#567C8D]
          text-white
          rounded-2xl
          font-semibold
          transition-all
          duration-300
          shadow-lg
          hover:shadow-xl
          flex
          items-center
          gap-3
          mx-auto
        "
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

      {/* Popular Stocks */}
      <div className="flex flex-wrap gap-3 justify-center items-center mt-5">
        <span className="text-sm text-[#567C8D] font-semibold flex items-center gap-2">
          <Zap size={14} className="text-[#567C8D]" />
          Popular:
        </span>
        {popularStocks.map((stock) => (
          <motion.button
            key={stock.symbol}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSymbol(stock.symbol);
              onSearch(stock.symbol);
              saveRecentSearch(stock.symbol);
            }}
            disabled={isLoading}
            className="text-sm px-4 py-1.5 rounded-full bg-white backdrop-blur-sm hover:bg-[#F5EFEB] transition border border-[#C8D9E6] hover:border-[#567C8D] disabled:opacity-50 flex items-center gap-2 group shadow-lg shadow-black/5"
          >
            <span className="font-semibold text-[#2F4156]">{stock.symbol}</span>
            <span className="text-xs text-[#567C8D] group-hover:text-[#2F4156] transition hidden sm:inline">
              {stock.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;