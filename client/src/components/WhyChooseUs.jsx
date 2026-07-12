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
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl mx-auto mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 text-center border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#567C8D] transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-4 text-[#567C8D]">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-[#2F4156]">{stat.value}</div>
            <div className="text-sm text-[#567C8D]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] transition-all duration-300"
        >
          <Zap className="text-[#567C8D] mb-4" size={30} />
          <h3 className="text-xl font-bold text-[#2F4156] mb-3">Lightning Fast</h3>
          <p className="text-[#567C8D] leading-7">Get AI-powered stock analysis in seconds, not hours</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] transition-all duration-300"
        >
          <Shield className="text-[#2F4156] mb-4" size={30} />
          <h3 className="text-xl font-bold text-[#2F4156] mb-3">Data-Driven</h3>
          <p className="text-[#567C8D] leading-7">Real-time market data combined with advanced AI analysis</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 border border-[#C8D9E6] shadow-sm hover:shadow-xl hover:border-[#567C8D] transition-all duration-300"
        >
          <TrendingUp className="text-[#567C8D] mb-4" size={30} />
          <h3 className="text-xl font-bold text-[#2F4156] mb-3">Smart Insights</h3>
          <p className="text-[#567C8D] leading-7">AI-generated recommendations with confidence scores</p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;