import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, LogOut, Menu, X, Plus, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { scrollToTop } from '../../utils/scrollUtils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleMobileNavClick = () => {
    scrollToTop();
    setIsOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
  ];

  const authenticatedItems = [
    { path: '/create-event', label: 'Create Event', icon: Plus },
    { path: '/dashboard', label: 'Dashboard', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Futuristic Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ 
                rotate: 360,
                scale: 1.1,
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)"
              }}
              transition={{ duration: 0.6 }}
              className="relative w-10 h-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center border border-cyan-400/50"
            >
              <Calendar className="w-6 h-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
            <span 
              className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-x 3s ease infinite'
              }}
            >
              EventHub
            </span>
            {/* Holographic lines */}
            <motion.div
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>

          {/* Futuristic Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={item.path}
                    onClick={scrollToTop}
                    className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
                  >
                    <Icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-medium">{item.label}</span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
              );
            })}

            {isAuthenticated && authenticatedItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navItems.length + index) * 0.1, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={item.path}
                    onClick={scrollToTop}
                    className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-purple-400 transition-all duration-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
                  >
                    <Icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                    <span className="font-medium">{item.label}</span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Futuristic Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-sm"
                >
                  <span className="text-cyan-300 font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Welcome, {user?.name}</span>
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="relative group flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login"
                    onClick={scrollToTop}
                    className="relative group px-6 py-2 rounded-xl bg-white/5 border border-white/20 text-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    Login
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 0 25px rgba(0, 255, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/register"
                    onClick={scrollToTop}
                    className="relative group px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 border border-cyan-400/50 text-white font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
                  >
                    Register
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Futuristic Mobile Menu Button */}
          <motion.div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl bg-white/5 border border-white/20 text-white hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300 group"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        </div>

        {/* Futuristic Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-500/30 relative overflow-hidden"
            >
              {/* Mobile Menu Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-purple-500/10"></div>
              
              <div className="relative px-4 py-6 space-y-6">
                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {[...navItems, ...(isAuthenticated ? authenticatedItems : [])].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          to={item.path}
                          onClick={handleMobileNavClick}
                          className="flex items-center space-x-3 relative group py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
                        >
                          <Icon className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                          <span className="relative z-10 font-medium">{item.label}</span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          ></motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Mobile Auth Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-cyan-500/20"
                >
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30"
                      >
                        <div className="flex items-center space-x-2 text-cyan-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="font-medium">Welcome, {user?.name}</span>
                        </div>
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">Logout</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/login"
                          onClick={handleMobileNavClick}
                          className="block text-center p-3 rounded-xl bg-white/5 border border-white/20 text-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 font-medium"
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/register"
                          onClick={handleMobileNavClick}
                          className="block text-center p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 border border-cyan-400/50 text-white font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
                        >
                          Register
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;