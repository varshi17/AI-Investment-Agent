// pages/Home.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultDashboard from "../components/ResultDashboard";
import ErrorBoundary from "../components/ErrorBoundary";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (symbol) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);

    try {
      const response = await API.post("/analyze", { symbol });
      
      if (response.data.success) {
        setResult(response.data);
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
      
      {!hasSearched ? (
        // Landing Page - Centered
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
          <Hero />
          <div className="w-full max-w-3xl mt-8">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>
      ) : (
        // Dashboard Page - Full Width
        <div className="min-h-[calc(100vh-80px)]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Persistent Search Bar */}
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} isLoading={loading} compact />
            </div>

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
        </div>
      )}
    </div>
  );
};

export default Home;