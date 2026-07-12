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
import { Mail, Github, Zap } from "lucide-react";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef(null);

  const handleSearch = async (symbol) => {
    console.log("🔍 ===== SEARCH STARTED =====");
    console.log("🔍 Symbol:", symbol);
    console.log("🔍 API Base URL:", API.defaults?.baseURL || "Not set");
    
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      console.log("📡 Sending request to /analyze...");
      const response = await API.post("/analyze", { symbol });
      console.log("📥 Response status:", response.status);
      console.log("📥 Response data:", JSON.stringify(response.data, null, 2));
      
      if (response.data.success) {
        console.log("✅ Analysis successful!");
        console.log("✅ Setting result with:", response.data);
        setResult(response.data);
        
        // Scroll to results after a short delay
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
            console.log("📜 Scrolled to results");
          } else {
            console.log("⚠️ resultsRef is null");
          }
        }, 500);
      } else {
        console.error("❌ Analysis failed:", response.data.message);
        setError(response.data.message || "Analysis failed");
      }
    } catch (err) {
      console.error("❌ ===== SEARCH ERROR =====");
      console.error("❌ Error object:", err);
      
      if (err.response) {
        console.error("❌ Response status:", err.response.status);
        console.error("❌ Response data:", err.response.data);
        console.error("❌ Response headers:", err.response.headers);
        const { data } = err.response;
        setError(data.message || data.error || "An error occurred during analysis");
      } else if (err.request) {
        console.error("❌ No response received");
        console.error("❌ Request:", err.request);
        setError("Network error. Please check your connection and try again.");
      } else {
        console.error("❌ Request setup error:", err.message);
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      console.log("🏁 Search finished, setting loading to false");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-white overflow-x-hidden">
      <Navbar />
      
      <div>
        {/* ===== HERO SECTION ===== */}
        <section 
          id="home" 
          className="relative flex flex-col items-center justify-center pt-24 pb-12 px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="w-full max-w-4xl mx-auto text-center">
            <Hero />
            <div className="w-full max-w-4xl mt-10">
              <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>
          </div>
        </section>

        {/* ===== DIVIDER ===== */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
        </div>

        {/* ===== FEATURES SECTION ===== */}
        <section id="features" className="py-8 md:py-12 scroll-mt-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <Features />
          </div>
        </section>

        {/* ===== DIVIDER ===== */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
        </div>

        {/* ===== WHY CHOOSE US ===== */}
        <section id="why" className="py-8 md:py-12 scroll-mt-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <WhyChooseUs />
          </div>
        </section>

        {/* ===== DIVIDER ===== */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
        </div>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how" className="py-8 md:py-12 scroll-mt-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <HowItWorks />
          </div>
        </section>

        {/* ===== DIVIDER ===== */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
        </div>

        {/* ===== MARKET INSIGHTS ===== */}
        <section id="insights" className="py-8 md:py-12 scroll-mt-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            <MarketInsights />
          </div>
        </section>

        {/* ===== DIVIDER ===== */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
        </div>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-8 md:py-12 scroll-mt-20">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            <FAQ />
          </div>
        </section>

        {/* ===== DIVIDER ===== */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
        </div>

        {/* ===== CONTACT ===== */}
        <section id="contact" className="py-8 md:py-12 scroll-mt-20">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-3xl p-8 md:p-12 border border-[#C8D9E6] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#2F4156] mb-4">
                Get in <span className="text-[#567C8D]">Touch</span>
              </h2>
              <p className="text-[#567C8D] text-base md:text-lg mb-8 max-w-2xl mx-auto leading-7">
                Have questions, feedback, or want to collaborate? I'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:varshithanaidu.17@gmail.com" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F5EFEB] text-[#2F4156] rounded-xl font-semibold hover:bg-[#C8D9E6] transition-all duration-300 border border-[#C8D9E6]"
                >
                  <Mail size={18} />
                  Email Us
                </a>
                <a 
                  href="https://github.com/varshi17" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#F5EFEB] text-[#2F4156] rounded-xl font-semibold hover:bg-[#C8D9E6] transition-all duration-300 border border-[#C8D9E6]"
                >
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== RESULTS SECTION ===== */}
        <div ref={resultsRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Debug info */}
          {/* <div className="text-xs text-slate-400 mb-2 font-mono">
            Debug: loading={String(loading)}, hasResult={String(!!result)}, hasError={String(!!error)}
          </div> */}
          
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

          {loading && (
            <div className="py-10">
              <LoadingSpinner message="Analyzing stock data with AI..." />
            </div>
          )}

          {result && !loading && (
            <motion.div
              key={result.metadata?.symbol + Date.now()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4"
            >
              <div className="text-green-700 font-semibold">
                ✅ Results loaded for {result.profile?.name || result.metadata?.symbol}
              </div>
              <div className="text-xs text-green-600 mt-1">
                Price: ${result.quote?.currentPrice || 'N/A'} | 
                Change: {result.quote?.changePercent || 'N/A'}%
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key={result.metadata?.symbol + result.metadata?.analyzedAt || 'result'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {result.fromCache && (
                <div className="mb-4 text-sm text-[#567C8D] bg-[#F5EFEB] px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-[#C8D9E6]">
                  <Zap size={14} className="text-[#567C8D]" />
                  Cached data (last analyzed {new Date(result.metadata?.analyzedAt).toLocaleString()})
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