// components/HowItWorks.jsx
import { motion } from "framer-motion";
import { Search, Database, Brain, Award } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="text-blue-400" size={32} />,
      title: "Search Stock",
      description: "Enter any company name or stock symbol to begin your analysis"
    },
    {
      icon: <Database className="text-purple-400" size={32} />,
      title: "Collect Market Data",
      description: "AI gathers real-time data from financial APIs and market sources"
    },
    {
      icon: <Brain className="text-green-400" size={32} />,
      title: "AI Analysis",
      description: "Gemini AI analyzes financial health, market position, and growth potential"
    },
    {
      icon: <Award className="text-yellow-400" size={32} />,
      title: "Investment Recommendation",
      description: "Get AI-powered insights with confidence scores and actionable recommendations"
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
          How <span className="gradient-text">It Works</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Get instant AI-powered stock analysis in 4 simple steps
        </p>
      </motion.div>

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-yellow-500 hidden md:block" />
        
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center gap-8 mb-12 last:mb-0 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
                <span className="text-sm text-blue-400 font-mono">Step {index + 1}</span>
                <h3 className="text-xl font-semibold mt-2">{step.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{step.description}</p>
              </div>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                {step.icon}
              </div>
            </div>
            
            <div className="flex-1 hidden md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;