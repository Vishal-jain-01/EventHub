import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Sparkles, Zap, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Event Creation',
      description: 'Launch professional events in minutes with our intelligent setup wizard and customizable templates',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Seamless Registration',
      description: 'Streamlined attendee management with automated confirmations and real-time capacity tracking',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Stunning Experience',
      description: 'Captivate your audience with our premium interface designed for maximum engagement',
      color: 'from-pink-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description: 'Make data-driven decisions with live analytics, engagement metrics, and performance reports',
      color: 'from-orange-500 to-yellow-500'
    }
  ];

  const stats = [
    { number: 'New', label: 'Platform Launch', icon: Sparkles },
    { number: 'Free', label: 'To Get Started', icon: Star },
    { number: 'Easy', label: 'Event Creation', icon: Calendar },
    { number: 'Smart', label: 'Management', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
              animation: 'grid-move 20s linear infinite'
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + (i * 60) % 80}%`,
                top: `${15 + (i * 25) % 70}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <div className={`w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'}`} />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></span>
              <span className="text-cyan-400 font-bold text-sm">WELCOME TO THE FUTURE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black mb-8 leading-tight"
            >
              <span 
                className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient-x 3s ease infinite'
                }}
              >
                EventHub
              </span>
              <span className="text-white font-light text-4xl md:text-6xl">Where Events Come Alive</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Transform your event ideas into unforgettable experiences. From intimate gatherings to massive conferences, create extraordinary events with ease.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Link to={isAuthenticated ? "/create-event" : "/register"} className="relative bg-black border border-cyan-500/50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:border-cyan-400 group-hover:shadow-2xl group-hover:shadow-cyan-500/25 flex items-center">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {isAuthenticated ? 'Create Event' : 'Get Started'}
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    <ArrowRight className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link to="/events" className="relative bg-white/5 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-white/40 hover:bg-white/10 backdrop-blur-sm flex items-center">
                  <span>Explore Events</span>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="ml-2"
                  >
                    ✨
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1.4 + index * 0.1,
                      type: "spring",
                      bounce: 0.4
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      rotateY: 10,
                      boxShadow: "0 20px 40px rgba(0, 255, 255, 0.2)"
                    }}
                    className="text-center group perspective-1000"
                  >
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      <motion.div 
                        whileHover={{ rotateY: 360 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                      >
                        <div className="relative inline-block mb-4">
                          <Icon className="w-10 h-10 text-cyan-400 group-hover:text-white transition-colors duration-300 relative z-10" />
                          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        <motion.div 
                          className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent"
                          whileHover={{ scale: 1.1 }}
                        >
                          {stat.number}
                        </motion.div>
                        
                        <div className="text-gray-400 font-medium text-sm uppercase tracking-wider group-hover:text-cyan-300 transition-colors duration-300">
                          {stat.label}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 100px 100px, 50px 50px, 50px 50px',
              animation: 'grid-move 30s linear infinite'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></span>
              <span className="text-cyan-400 font-bold text-sm">EXTRAORDINARY FEATURES</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-5xl md:text-7xl font-black mb-8 leading-tight"
            >
              <span 
                className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient-x 3s ease infinite'
                }}
              >
                Extraordinary
              </span>
              <span className="text-white font-light text-3xl md:text-5xl">Events Made Simple</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Transform your event ideas into unforgettable experiences with our cutting-edge platform
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 100, rotateX: 45 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1,
                    delay: index * 0.2,
                    type: "spring",
                    bounce: 0.3
                  }}
                  whileHover={{ 
                    y: -15,
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.05,
                    boxShadow: "0 30px 60px rgba(0, 255, 255, 0.2)"
                  }}
                  className="group perspective-1000"
                >
                  <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-700 overflow-hidden">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 text-center h-full flex flex-col justify-center">
                      <motion.div 
                        whileHover={{ 
                          rotateY: 360,
                          scale: 1.2
                        }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative mx-auto mb-6"
                      >
                        <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center relative`}>
                          <Icon className="w-10 h-10 text-white relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                        </div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-2xl font-black mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500"
                        whileHover={{ scale: 1.05 }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-400 font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-500"
                        whileHover={{ scale: 1.02 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;