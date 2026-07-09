// components/WhyChooseUs.jsx
import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Clock, Zap, Shield } from "lucide-react";

const WhyChooseUs = () => {
  const stats = [
    { value: "5000+", label: "Stocks Analyzed", icon: <TrendingUp size={20} /> },
    { value: "95%", label: "Prediction Accuracy", icon: <Award size={20} /> },
    { value: "150+", label: "Companies Covered", icon: <Users size={20} /> },
    { value: "24/7", label: "AI Availability", icon: <Clock size={20} /> }
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
          Trusted by <span className="gradient-text">Smart Investors</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Join thousands of investors making data-driven decisions
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mx-auto mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-2 text-blue-400">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold gradient-text">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl p-6 border border-blue-500/10"
        >
          <Zap className="text-yellow-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
          <p className="text-sm text-slate-400">Get AI-powered stock analysis in seconds, not hours</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-500/5 to-cyan-500/5 rounded-2xl p-6 border border-green-500/10"
        >
          <Shield className="text-green-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold mb-2">Data-Driven</h3>
          <p className="text-sm text-slate-400">Real-time market data combined with advanced AI analysis</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl p-6 border border-purple-500/10"
        >
          <Award className="text-purple-400 mb-3" size={28} />
          <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
          <p className="text-sm text-slate-400">AI-generated recommendations with confidence scores</p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;