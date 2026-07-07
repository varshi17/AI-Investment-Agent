// components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  Github, 
  Twitter, 
  Bell, 
  User, 
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Settings,
  UserCircle,
  Heart,
  Bookmark,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/80 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20"
            >
              <TrendingUp size={22} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text">AI Investor</span>
              <span className="ml-2 text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                v2.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="#" active>Dashboard</NavLink>
            <NavLink href="#">Portfolio</NavLink>
            <NavLink href="#">Watchlist</NavLink>
            <NavLink href="#">Analytics</NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-400" />}
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50"
            >
              <Bell size={18} className="text-slate-300" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950"
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <span className="text-sm font-medium hidden lg:block">John Doe</span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="text-slate-400" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700 shadow-2xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-700">
                      <p className="text-sm font-semibold text-white">John Doe</p>
                      <p className="text-xs text-slate-400">john@example.com</p>
                    </div>
                    <div className="p-1">
                      <DropdownItem icon={<UserCircle size={16} />} label="Profile" />
                      <DropdownItem icon={<Heart size={16} />} label="Watchlist" />
                      <DropdownItem icon={<Bookmark size={16} />} label="Saved" />
                      <DropdownItem icon={<Settings size={16} />} label="Settings" />
                    </div>
                    <div className="p-1 border-t border-slate-700">
                      <DropdownItem icon={<LogOut size={16} />} label="Logout" danger />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
              className="md:hidden overflow-hidden border-t border-slate-800/50"
            >
              <div className="py-3 space-y-1">
                <MobileNavLink href="#" active>Dashboard</MobileNavLink>
                <MobileNavLink href="#">Portfolio</MobileNavLink>
                <MobileNavLink href="#">Watchlist</MobileNavLink>
                <MobileNavLink href="#">Analytics</MobileNavLink>
                <div className="pt-2 border-t border-slate-800/50">
                  <MobileNavLink href="#">Profile</MobileNavLink>
                  <MobileNavLink href="#">Settings</MobileNavLink>
                  <MobileNavLink href="#" danger>Logout</MobileNavLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// Helper Components
const NavLink = ({ href, children, active = false }) => (
  <a
    href={href}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
      active 
        ? 'text-white bg-blue-500/10' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    {children}
    {active && (
      <motion.div
        layoutId="activeNav"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
      />
    )}
  </a>
);

const MobileNavLink = ({ href, children, active = false, danger = false }) => (
  <a
    href={href}
    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      danger ? 'text-red-400 hover:bg-red-500/10' :
      active ? 'text-white bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    {children}
  </a>
);

const DropdownItem = ({ icon, label, danger = false }) => (
  <button
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
      danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-slate-700/50'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Navbar;