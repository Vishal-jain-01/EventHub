import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, MapPin, Users, Clock, Tag } from 'lucide-react';
import { eventAPI } from '../../services/api';
import EventCard from './EventCard';
import toast from 'react-hot-toast';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Actual search query sent to API
  const [filterStatus, setFilterStatus] = useState('upcoming'); // Default to upcoming events
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0
  });

  useEffect(() => {
    fetchEvents();
  }, [categoryFilter, searchQuery, filterStatus]);

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
  };

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sortBy: 'eventDate',
        order: 'asc'
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      // Include past events only if filter is 'all' or 'past'
      if (filterStatus === 'all' || filterStatus === 'past') {
        params.includePast = 'true';
      } else {
        // For upcoming events, explicitly exclude past events
        params.includePast = 'false';
      }

      const response = await eventAPI.getAllEvents(params);
      
      // Handle new API response structure with pagination
      if (response.data?.events) {
        setEvents(response.data.events);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalEvents: response.data.events.length
        });
      } else {
        // Fallback for old API structure
        const eventsData = Array.isArray(response.data) ? response.data : [];
        setEvents(eventsData);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalEvents: eventsData.length
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setEvents([]);
      setPagination({ currentPage: 1, totalPages: 1, totalEvents: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Filter events locally for status filter only (search is handled server-side)
  const filteredEvents = events.filter(event => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'upcoming') return new Date(event.eventDate) > new Date();
    if (filterStatus === 'past') return new Date(event.eventDate) <= new Date();
    return true;
  });

  const upcomingEvents = events.filter(event => new Date(event.eventDate) > new Date()).length;
  const totalEvents = pagination.totalEvents || events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + (event.registeredUsersCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Discover Amazing Events</span>{' '}
            {/* <span className="text-gray-800 dark:text-white">Amazing Events</span> */}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find and join events that match your interests and connect with like-minded people
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{upcomingEvents}</div>
            <div className="text-gray-600 dark:text-gray-400">Upcoming Events</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{totalRegistrations}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Registrations</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Clock className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text">{totalEvents}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Events</div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events by name, description, or venue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input-field pl-12 w-full rounded-r-none"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-600 transition-colors"
                >
                  Search
                </button>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-l-none border border-l-0 border-gray-200 dark:border-gray-600 transition-colors ml-1 rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field pl-12 pr-8 appearance-none bg-white/50 dark:bg-gray-800/50 min-w-[160px]"
              >
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-12 pr-8 appearance-none bg-white/50 dark:bg-gray-800/50 min-w-[160px]"
              >
                <option value="upcoming">Upcoming Events</option>
                <option value="all">All Events</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex justify-center items-center space-x-4"
              >
                <button
                  onClick={() => fetchEvents(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-gray-600 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => fetchEvents(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'There are no events available at the moment'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventList;