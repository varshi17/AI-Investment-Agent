// components/Footer.jsx
import { motion } from "framer-motion";
import { TrendingUp, Github, Twitter, Heart, Mail, Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how" },
    { label: "Insights", href: "#insights" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  AI Investor
                </h2>
                <p className="text-xs text-slate-500">Smart Stock Analysis</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered stock analysis using Gemini AI and real-time market data.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-slate-500 hover:text-white transition">
                <Github size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition">
                <Mail size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition">GitHub</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white transition">Changelog</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-800/60 rounded-lg text-xs text-slate-300 border border-slate-700/50">React</span>
              <span className="px-2 py-1 bg-slate-800/60 rounded-lg text-xs text-slate-300 border border-slate-700/50">Tailwind</span>
              <span className="px-2 py-1 bg-slate-800/60 rounded-lg text-xs text-slate-300 border border-slate-700/50">Node.js</span>
              <span className="px-2 py-1 bg-slate-800/60 rounded-lg text-xs text-slate-300 border border-slate-700/50">Gemini AI</span>
              <span className="px-2 py-1 bg-slate-800/60 rounded-lg text-xs text-slate-300 border border-slate-700/50">Finnhub</span>
              <span className="px-2 py-1 bg-slate-800/60 rounded-lg text-xs text-slate-300 border border-slate-700/50">Framer Motion</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} AI Investor. Made with <Heart size={12} className="inline text-red-400" /> for smart investors.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;