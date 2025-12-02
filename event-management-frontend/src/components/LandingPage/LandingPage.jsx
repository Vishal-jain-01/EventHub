import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/bgheader.png)' }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight"
            >
              <span 
                className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl"
              >
                EventHub
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-200 mb-4 max-w-4xl mx-auto font-bold leading-relaxed"
            >
              Create, Manage & Experience Events
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The all-in-one platform to organize conferences, workshops, meetups, and celebrations with real-time updates and seamless registration.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {[
                { icon: '📅', text: 'Easy Scheduling' },
                { icon: '👥', text: 'Guest Management' },
                { icon: '📊', text: 'Live Analytics' },
                { icon: '✉️', text: 'Email Notifications' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:border-purple-400 hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-sm font-semibold flex items-center gap-2 text-white">
                    <span className="text-xl">{feature.icon}</span>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/create-event">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Create Event
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </motion.button>
              </Link>

              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Explore Events
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* User Journey Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              
            >
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From signup to success - follow the simple steps to create and manage amazing events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: "01",
                title: "Join Us",
                description: "Sign up for your free account and join our community of event creators.",
                
                color: "from-green-500 to-cyan-500",
                link: "/register"
              },
              {
                step: "02", 
                title: "Sign In",
                description: "Log in to access your personal dashboard and all event management tools.",
                
                color: "from-blue-500 to-purple-500",
                link: "/login"
              },
              {
                step: "03",
                title: "Create Event",
                description: "Use our intuitive builder to create your perfect event with all the details.",
                
                color: "from-purple-500 to-pink-500",
                link: "/create-event"
              },
              {
                step: "04",
                title: "Manage Events",
                description: "Control everything from your dashboard - edit, monitor, and update your events.",
                color: "from-pink-500 to-orange-500",
                link: "/dashboard"
              },
              {
                step: "05",
                title: "Track Success",
                description: "Monitor registrations, engagement, and analytics to measure your event's success.",
                color: "from-orange-500 to-yellow-500",
                link: "/dashboard"
              }
            ].map((workflow, index) => (
              <motion.div
                key={workflow.step}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="relative group"
              >
                <Link to={workflow.link} className="block h-full">
                  <div className="relative p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 h-full cursor-pointer hover:scale-105">
                    {/* Step Number */}
                    <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-r ${workflow.color} flex items-center justify-center text-white font-black text-sm shadow-2xl`}>
                      {workflow.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {workflow.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {workflow.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {workflow.description}
                    </p>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-4 right-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>

                    {/* Connecting Line (except for last item) */}
                    {index < 4 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Call to Action - Only show when user is not logged in */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-center mt-16"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/30"
                >
                  Start Your Event Journey
                  <svg className="w-6 h-6 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
