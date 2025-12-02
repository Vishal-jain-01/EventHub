import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users, TrendingUp, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import EventCard from '../Events/EventCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [userEvents, setUserEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, registrationsResponse] = await Promise.all([
        authAPI.getUserEvents(),
        authAPI.getUserRegistrations()
      ]);
      
      console.log('=== DASHBOARD DATA DEBUG ===');
      console.log('Current User:', user);
      console.log('User ID:', user?._id || user?.id);
      console.log('User Events (Created by me):', eventsResponse.data);
      console.log('Registered Events (I registered for):', registrationsResponse.data);
      
      // Ensure we only set events created by this user
      const myCreatedEvents = (eventsResponse.data || []).filter(event => {
        const hostId = event.eventHostedBy?._id || event.eventHostedBy;
        const userId = user?._id || user?.id;
        return hostId === userId;
      });
      
      // Registered events should only include events with registrationId
      const myRegisteredEvents = (registrationsResponse.data || []).filter(event => {
        return event.registrationId; // Only include if has registrationId (means user registered)
      });
      
      console.log('Filtered My Events:', myCreatedEvents);
      console.log('Filtered Registered Events:', myRegisteredEvents);
      console.log('=== END DEBUG ===');
      
      setUserEvents(myCreatedEvents);
      setRegisteredEvents(myRegisteredEvents);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    // Remove the deleted event from the local state
    setUserEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Please Login</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You need to login to access your dashboard.</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const totalRegistrations = userEvents.reduce((sum, event) => sum + (event.registeredUsersCount || 0), 0);
  const upcomingEvents = userEvents.filter(event => new Date(event.eventDate) > new Date()).length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your events and track your registrations
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{userEvents.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Events Created</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{upcomingEvents}</div>
            <div className="text-gray-600 dark:text-gray-400">Upcoming Events</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{totalRegistrations}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Registrations</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <Eye className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{registeredEvents.length}</div>
            <div className="text-gray-600 dark:text-gray-400">Events Joined</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/create-event"
            className="inline-flex items-center btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </Link>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="glass-card p-2 inline-flex rounded-lg">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'created'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              My Events ({userEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'registered'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Registered Events ({registeredEvents.length})
            </button>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {activeTab === 'created' ? (
            userEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EventCard 
                      event={event} 
                      showActions={true} 
                      onDelete={handleDeleteEvent}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Events Created
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Create an event and start bringing people together!
                </p>
                <Link to="/create-event" className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Link>
              </div>
            )
          ) : (
            registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {registeredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EventCard event={event} showActions={false} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No Event Registrations
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Browse events and join the ones that interest you!
                </p>
                <Link to="/events" className="btn-primary">
                  Browse Events
                </Link>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;