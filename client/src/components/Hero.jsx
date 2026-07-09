import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

const Hero = () => {
  const stats = [
    {
      value: "5000+",
      label: "Stocks Analyzed",
    },
    {
      value: "95%",
      label: "AI Confidence",
    },
    {
      value: "Real-Time",
      label: "Market Data",
    },
  ];

  return (
    <section className="relative overflow-hidden text-center">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="absolute right-20 top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-5xl mx-auto"
      >

        {/* Badge */}

        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-8">

          <Sparkles size={16} />

          Powered by Gemini AI & Finnhub API

        </div>

        {/* Heading */}

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">

          Smarter Investing

          <br />

          Starts With

          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">

            {" "}AI

          </span>

        </h1>

        {/* Subtitle */}

        <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-slate-400 leading-8">

          Analyze any stock using Artificial Intelligence,
          live financial data, market trends,
          company fundamentals and recent news —
          all in one beautiful dashboard.

        </p>

        {/* Features */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Feature
            icon={<BrainCircuit size={18} />}
            text="AI Investment Analysis"
          />

          <Feature
            icon={<TrendingUp size={18} />}
            text="Live Market Data"
          />

          <Feature
            icon={<ShieldCheck size={18} />}
            text="Risk Assessment"
          />

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16">

          {stats.map((item, index) => (

            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
              }}
              className="premium-card p-6"
            >

              <h2 className="text-3xl font-bold text-white">

                {item.value}

              </h2>

              <p className="mt-2 text-slate-400 text-sm">

                {item.label}

              </p>

            </motion.div>

          ))}

        </div>

      </motion.div>

    </section>
  );
};

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 backdrop-blur-md">

      <span className="text-blue-400">

        {icon}

      </span>

      {text}

    </div>
  );
}

export default Hero;