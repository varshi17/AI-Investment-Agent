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

  const links = useMemo(() => [
    { id: "home", label: "Home" },
    // { id: "about", label: "About" },
    { id: "features", label: "Features" },
    { id: "how", label: "How It Works" },
    { id: "insights", label: "Insights" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" }
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

  // React way: scroll to section using scrollIntoView
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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
      const offset = 120;

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
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [links]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#2F4156]/95 backdrop-blur-xl border-b border-[#567C8D]/20 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="h-11 w-11 rounded-2xl bg-[#567C8D] flex items-center justify-center shadow-lg shadow-[#2F4156]/20"
            >
              <TrendingUp size={22} className="text-white" />
            </motion.div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-white">
                AI Investor
              </h1>
              <p className="text-xs text-[#C8D9E6] leading-none">
                Smart Stock Analysis
              </p>
            </div>
          </div>

          {/* Desktop Navigation - React Way */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative text-sm font-medium transition after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:transition-all after:duration-300 ${
                  activeSection === link.id
                  ? 'text-white after:w-full after:bg-[#C8D9E6]'
                  : 'text-[#C8D9E6] hover:text-white after:w-0 hover:after:w-full after:bg-[#C8D9E6]'
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
              className="h-11 w-11 rounded-xl border border-[#567C8D]/40 bg-[#567C8D]/20 hover:bg-[#567C8D]/40 transition flex items-center justify-center">
              <Sun size={18} className="text-[#F5EFEB] transition" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-11 w-11 rounded-xl border border-[#567C8D]/40 bg-[#567C8D]/20"
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
              className="lg:hidden overflow-hidden backdrop-blur-xl bg-[#2F4156] rounded-2xl border border-white/5 shadow-xl mt-2"
            >
              <div className="p-4 space-y-2">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition ${
                      activeSection === link.id 
                        ? 'text-white bg-blue-500/10' 
                        : 'text-[#C8D9E6] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                
                <div className="border-t border-white/5 my-2"></div>
                
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-[#C8D9E6] hover:text-white hover:bg-white/5 rounded-xl transition flex items-center gap-3"
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