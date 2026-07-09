// pages/Home.jsx
import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultDashboard from "../components/ResultDashboard";
import ErrorMessage from "../components/ErrorMessage";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import MarketInsights from "../components/MarketInsights";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef(null);

  const handleSearch = async (symbol) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const response = await API.post("/analyze", { symbol });
      
      if (response.data.success) {
        setResult(response.data);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        setError(response.data.message || "Analysis failed");
      }
    } catch (err) {
      console.error("Search Error:", err);
      
      if (err.response) {
        const { data } = err.response;
        setError(data.message || data.error || "An error occurred during analysis");
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />
      
      <div className="pt-20 md:pt-24">
        {/* ===== HERO SECTION ===== */}
        <section 
          id="home" 
          className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
            <Hero />
            <div className="w-full max-w-4xl mt-8">
              <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>
            
            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-xs text-slate-500 uppercase tracking-wider">Scroll to Explore</span>
              <svg className="w-6 h-6 text-slate-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section 
          id="features" 
          className="py-24 flex justify-center relative border-t border-slate-800/50"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-full max-w-7xl mx-auto px-6">
            <Features />
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section 
          id="how" 
          className="py-24 flex justify-center relative border-t border-slate-800/50"
        >
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-full max-w-7xl mx-auto px-6">
            <HowItWorks />
          </div>
        </section>

        {/* ===== WHY CHOOSE US SECTION ===== */}
        <section 
          id="why" 
          className="py-24 flex justify-center relative border-t border-slate-800/50"
        >
          <div className="w-full max-w-7xl mx-auto px-6">
            <WhyChooseUs />
          </div>
        </section>

        {/* ===== MARKET INSIGHTS SECTION ===== */}
        <section 
          id="insights" 
          className="py-24 flex justify-center relative border-t border-slate-800/50"
        >
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-full max-w-7xl mx-auto px-6">
            <MarketInsights />
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section 
          id="faq" 
          className="py-24 flex justify-center relative border-t border-slate-800/50"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-full max-w-4xl mx-auto px-6">
            <FAQ />
          </div>
        </section>

        {/* ===== RESULTS SECTION ===== */}
        <div ref={resultsRef} className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-800/50">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <ErrorMessage 
                  message={error} 
                  onClose={() => setError(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {loading && <LoadingSpinner message="Analyzing stock data with AI..." />}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {result.fromCache && (
                <div className="mb-4 text-sm text-slate-400 bg-slate-800/30 px-4 py-2 rounded-lg inline-block">
                  ⚡ Cached data (last analyzed {new Date(result.metadata?.analyzedAt).toLocaleString()})
                </div>
              )}
              <ResultDashboard result={result} />
            </motion.div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;