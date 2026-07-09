// components/Navbar.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { TrendingUp, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef(null);

  // Solution 3: Use useMemo to prevent recreating links on every render
  const links = useMemo(() => [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "how", label: "How It Works" },
    { id: "insights", label: "Insights" },
    { id: "faq", label: "FAQ" }
  ], []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Solution 1: scrollToSection with manual calculation
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) return;

    const y =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      90;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Update navbar background on scroll
      setIsScrolled(scrollPosition > 50);

      // Update active section
      const offset = 100;

      for (let i = links.length - 1; i >= 0; i--) {
        const section = document.getElementById(links[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition + offset >= sectionTop && scrollPosition + offset < sectionBottom) {
            setActiveSection(links[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [links]); // Solution 3: Added links as dependency

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-2xl bg-slate-950/90 border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,.25)]' 
        : 'backdrop-blur-2xl bg-slate-950/70 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <TrendingUp size={22} className="text-white" />
            </motion.div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                AI Investor
              </h1>
              <p className="text-xs text-slate-500 leading-none">
                Smart Stock Analysis
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative text-sm font-medium transition after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:transition-all after:duration-300 ${
                  activeSection === link.id 
                    ? 'text-white after:w-full after:bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'text-slate-400 hover:text-white after:w-0 hover:after:w-full after:bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="h-11 w-11 rounded-xl border border-slate-700 bg-slate-900 hover:border-blue-500 transition flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/10"
            >
              <Sun size={18} className="text-slate-400 hover:text-yellow-400 transition" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-11 w-11 rounded-xl border border-slate-700 bg-slate-900 hover:border-blue-500 transition flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden backdrop-blur-xl bg-slate-900/80 rounded-2xl border border-white/5 shadow-xl mt-2"
            >
              <div className="p-4 space-y-2">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition ${
                      activeSection === link.id 
                        ? 'text-white bg-blue-500/10' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                
                {/* Mobile Divider */}
                <div className="border-t border-white/5 my-2"></div>
                
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-3"
                >
                  <Sun size={16} />
                  Toggle Theme
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;