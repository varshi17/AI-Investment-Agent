// components/HowItWorks.jsx
import { motion } from "framer-motion";
import { Search, Database, Brain, Award } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="text-[#567C8D]" size={32} />,
      title: "Search Stock",
      description: "Enter any company name or stock symbol to begin your analysis"
    },
    {
      icon: <Database className="text-[#2F4156]" size={32} />,
      title: "Collect Market Data",
      description: "AI gathers real-time data from financial APIs and market sources"
    },
    {
      icon: <Brain className="text-[#567C8D]" size={32} />,
      title: "AI Analysis",
      description: "Gemini AI analyzes financial health, market position, and growth potential"
    },
    {
      icon: <Award className="text-[#2F4156]" size={32} />,
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
        className="text-center mb-12"
      >
        <span className="inline-block text-xs font-semibold text-[#2F4156] bg-[#C8D9E6] px-4 py-1.5 rounded-full mb-4 border border-[#567C8D]/20">
          Process
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#2F4156] mb-4">
          How <span className="text-[#567C8D]">It Works</span>
        </h2>
        <p className="text-[#567C8D] text-base md:text-lg">
          Get instant AI-powered stock analysis in 4 simple steps
        </p>
      </motion.div>

      <div className="relative w-full max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#567C8D] via-[#2F4156] to-[#567C8D] hidden md:block" />
        
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row items-center gap-6 mb-10 last:mb-0 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <div className="bg-white rounded-3xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] transition-all duration-300">
                <span className="text-sm text-[#567C8D] font-semibold">Step {index + 1}</span>
                <h3 className="text-xl font-bold text-[#2F4156] mt-2 mb-3">{step.title}</h3>
                <p className="text-[#567C8D] leading-7">{step.description}</p>
              </div>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F5EFEB] border-4 border-[#567C8D] shadow-lg flex items-center justify-center">
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