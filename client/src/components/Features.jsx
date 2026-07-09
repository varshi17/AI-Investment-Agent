// components/Features.jsx
import { motion } from "framer-motion";
import { 
  Brain, 
  LineChart, 
  Shield, 
  Newspaper, 
  LayoutDashboard, 
  Lock 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Brain className="text-blue-400" size={28} />,
      title: "AI Powered Analysis",
      description: "Gemini AI analyzes financial data, market trends, and company metrics to provide intelligent investment insights."
    },
    {
      icon: <LineChart className="text-green-400" size={28} />,
      title: "Live Stock Data",
      description: "Real-time stock prices, historical data, and market indicators from Finnhub's comprehensive financial API."
    },
    {
      icon: <Shield className="text-red-400" size={28} />,
      title: "Risk Detection",
      description: "AI identifies potential risks, market volatility, and red flags to help you make informed investment decisions."
    },
    {
      icon: <Newspaper className="text-yellow-400" size={28} />,
      title: "Latest Financial News",
      description: "Stay updated with real-time news, analyst ratings, and market sentiment from trusted financial sources."
    },
    {
      icon: <LayoutDashboard className="text-purple-400" size={28} />,
      title: "Real-Time Dashboard",
      description: "Beautiful, interactive analytics dashboard with charts, metrics, and AI-powered recommendations."
    },
    {
      icon: <Lock className="text-cyan-400" size={28} />,
      title: "Secure & Fast",
      description: "Your data is private and secure. No personal information is stored, and all analysis happens in real-time."
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
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Why Choose <span className="gradient-text">AI Investor</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Powered by cutting-edge AI technology and real-time market data
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
            className="group bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;