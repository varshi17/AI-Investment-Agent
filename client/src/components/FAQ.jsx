// components/FAQ.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is AI Investor?",
      answer: "AI Investor is an AI-powered stock analysis platform that uses Gemini AI and real-time market data to provide intelligent investment insights, financial health analysis, and actionable recommendations for stocks."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI analysis combines multiple data sources including real-time market data, company financials, news sentiment, and advanced machine learning models. While we aim for high accuracy (95%+), we recommend using AI Investor as a research tool alongside your own due diligence."
    },
    {
      question: "Which data sources does AI Investor use?",
      answer: "AI Investor uses Finnhub API for real-time stock data, market metrics, and company information, combined with Google's Gemini AI for advanced analysis and natural language understanding."
    },
    {
      question: "Is AI Investor free to use?",
      answer: "Yes! AI Investor is completely free to use. We believe in making AI-powered investment research accessible to everyone. No credit card required, no hidden fees."
    },
    {
      question: "How does the recommendation system work?",
      answer: "Our AI analyzes financial health, market position, news impact, risks, and opportunities to generate recommendations: INVEST (strong buy), WATCH (hold/neutral), or PASS (avoid). Each recommendation comes with a confidence score."
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <HelpCircle className="text-blue-400" size={28} />
          <h2 className="text-4xl md:text-5xl font-bold">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <p className="text-slate-400 text-lg">
          Everything you need to know about AI Investor
        </p>
      </motion.div>

      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition"
            >
              <span className="text-base font-semibold">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-slate-400"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;