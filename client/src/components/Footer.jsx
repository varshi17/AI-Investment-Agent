// components/Footer.jsx
import { motion } from "framer-motion";
import { TrendingUp, Github, Twitter, Heart, Mail, Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#C8D9E6] bg-[#2F4156]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#567C8D] flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  AI Investor
                </h2>
                <p className="text-xs text-[#C8D9E6]">Smart Stock Analysis</p>
              </div>
            </div>
            <p className="text-sm text-[#C8D9E6] leading-6 max-w-xs">
              AI-powered stock analysis using Gemini AI and real-time market data.
            </p>
          </div>

        

          {/* About */}
          {/* <div>
            <p className="text-sm text-[#C8D9E6] leading-6 mb-3">
              Making AI-powered investment research accessible to everyone.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#C8D9E6]">
              <Heart size={14} className="text-[#C8D9E6] fill-[#C8D9E6]" />
              <span>Built with ❤️ for investors</span>
            </div>
          </div> */}
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;