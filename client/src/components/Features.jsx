// components/Features.jsx
import { motion } from "framer-motion";
import { 
  Brain, 
  LineChart, 
  Shield, 
  Newspaper, 
  LayoutDashboard, 
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Brain className="text-[#567C8D]" size={28} />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze market trends, financial data, and news sentiment to provide intelligent stock insights."
    },
    {
      icon: <LineChart className="text-[#2F4156]" size={28} />,
      title: "Real-Time Data",
      description: "Access live market data, financial metrics, and company fundamentals updated in real-time for accurate decision making."
    },
    {
      icon: <Shield className="text-[#567C8D]" size={28} />,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis with volatility metrics, value-at-risk calculations, and portfolio optimization recommendations."
    },
    {
      icon: <Newspaper className="text-[#2F4156]" size={28} />,
      title: "News Aggregation",
      description: "Stay informed with real-time news sentiment analysis, earnings reports, and market-moving events affecting your stocks."
    },
    {
      icon: <LayoutDashboard className="text-[#567C8D]" size={28} />,
      title: "Interactive Dashboard",
      description: "Beautiful, intuitive dashboard with customizable charts, key metrics, and visual data representations for better insights."
    },
    {
      icon: <Lock className="text-[#2F4156]" size={28} />,
      title: "Enterprise Security",
      description: "Bank-grade encryption, secure data handling, and privacy-first approach to protect your financial information."
    }
  ];

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center rounded-full border border-[#567C8D]/20 bg-[#C8D9E6] px-4 py-1.5 text-sm font-semibold text-[#2F4156] mb-5">
          <Sparkles size={14} className="mr-2" />
          Powerful Features
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#2F4156] mb-5">
          Why Choose AI Investor
        </h2>
        <p className="text-[#567C8D] text-base md:text-lg leading-8 max-w-3xl mx-auto">
          Powered by cutting-edge AI technology and real-time market data to help you 
          make smarter investment decisions with confidence.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group flex flex-col bg-white rounded-3xl border border-[#C8D9E6] p-8 min-h-[280px] shadow-sm hover:-translate-y-2 hover:border-[#567C8D] hover:shadow-2xl transition-all duration-300"
          >
            {/* Icon Box */}
            <div className="w-16 h-16 rounded-2xl bg-[#F5EFEB] flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-[#2F4156] mb-4 group-hover:text-[#567C8D] transition">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-[#567C8D] text-base leading-7 flex-1">
              {feature.description}
            </p>

            {/* Learn More Link - Optional */}
            <div className="mt-6 flex items-center text-sm font-semibold text-[#567C8D] group-hover:text-[#2F4156] transition opacity-0 group-hover:opacity-100">
              Learn More
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;