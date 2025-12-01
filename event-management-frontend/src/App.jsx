import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import Home from './components/Pages/Home';
import Contact from './components/Pages/Contact';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EventList from './components/Events/EventList';
import EventDetails from './components/Events/EventDetails';
import CreateEvent from './components/Events/CreateEvent';
import EditEvent from './components/Events/EditEvent';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white overflow-hidden">
          {/* Ultra Modern Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          
          {/* Animated Grid Background */}
          <div className="fixed inset-0 z-0">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'grid-move 20s linear infinite'
              }}
            />
          </div>

          {/* Floating Background Orbs */}
          <div className="fixed inset-0 z-0 overflow-hidden">
            <motion.div
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
              className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-l from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 pt-16"
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route 
                  path="/create-event" 
                  element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-event/:id" 
                  element={
                    <ProtectedRoute>
                      <EditEvent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </motion.main>
            <Footer />
          </div>

          {/* Enhanced Futuristic Toaster */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
                color: '#ffffff',
                fontWeight: '500',
              },
              success: {
                style: {
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)',
                },
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#000000',
                },
              },
              error: {
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#000000',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
