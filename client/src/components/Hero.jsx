import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative text-center pt-0 pb-8 md:pb-12 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#C8D9E6]/30 rounded-full blur-3xl" />
        <div className="absolute -left-20 top-32 w-64 h-64 bg-[#567C8D]/10 rounded-full blur-3xl" />
        <div className="absolute -right-20 bottom-10 w-72 h-72 bg-[#F5EFEB] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-1 px-5 py-2 rounded-full bg-[#C8D9E6]/60 border border-[#567C8D]/20 mb-8">
          <Sparkles size={16} className="text-[#2F4156]" />
          <span className="text-sm font-semibold text-[#2F4156]">
            AI Powered Investment Research
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
          <span className="text-[#2F4156] block">
            Smarter Investing
          </span>
          <span className="text-[#2F4156] block">
            Starts With
          </span>
          <span className="bg-gradient-to-r from-[#567C8D] via-[#3F6075] to-[#2F4156] bg-clip-text text-transparent">
            Artificial Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl leading-9 text-[#567C8D]">
          Analyze stocks using real-time market data, AI-powered financial
          insights, company fundamentals, and the latest news—all in one
          intelligent dashboard.
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;