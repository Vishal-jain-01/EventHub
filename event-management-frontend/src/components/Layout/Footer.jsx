import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const Footer = () => {
  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Create Event", href: "/create-event" },
    { name: "Contact Us", href: "/contact" }
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/vishal-jain-11vj2006/", icon: "💼" },
    { name: "GitHub", href: "https://github.com/Vishal-jain-01/", icon: "🐙" }
  ];

  return (
    <footer className="relative bg-black border-t border-cyan-500/20">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/80 to-black"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
        
        <div className="py-8">
          {/* Main Footer Content - Single Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            {/* Logo Section - Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Calendar className="w-8 h-8 text-cyan-400" />
                  <div className="absolute -inset-1 border border-cyan-400/30 rounded-lg"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    EventHub
                  </h2>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Streamline your event management with our modern platform. 
                Create, manage, and track events with ease.
              </p>
            </motion.div>

            {/* Navigation Links - Right Side Horizontal */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6"
            >
              {navigationLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </motion.nav>
          </div>

          {/* Bottom Section - Copyright and Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-6 border-t border-gray-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2025 EventHub. All rights reserved.
              </div>

              <div className="flex space-x-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 group"
                    aria-label={social.name}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;