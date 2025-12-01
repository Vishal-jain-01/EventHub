import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Tag, User, ArrowLeft, UserCheck, Download, Mail, Phone } from 'lucide-react';
import { eventAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'attendees'
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (user) {
      setRegistrationData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventById(id);
      setEvent(response.data);
      
      console.log('Event data:', response.data);
      console.log('Current user:', user);
      console.log('Event host ID:', response.data?.eventHostedBy?._id);
      console.log('User ID:', user?._id);
      console.log('Is owner?', user && response.data?.eventHostedBy?._id === user._id);
      
      // Check if current user is registered for this event
      if (user && response.data?.registeredUsers) {
        const userRegistration = response.data.registeredUsers.find(
          reg => reg.email === user.email
        );
        setIsUserRegistered(!!userRegistration);
      }

      // Fetch attendees if current user is the event owner
      if (user && response.data?.eventHostedBy?._id === user._id) {
        fetchAttendees();
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async () => {
    try {
      setLoadingAttendees(true);
      console.log('Fetching attendees for event:', id);
      const response = await eventAPI.getEventStats(id);
      console.log('Attendees response:', response.data);
      setAttendees(response.data.attendees || []);
      console.log('Attendees set:', response.data.attendees?.length || 0);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to load attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  const downloadAttendeeList = () => {
    if (!attendees || attendees.length === 0) {
      toast.error('No attendees to download');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Registration Date'];
    const rows = attendees.map(attendee => [
      attendee.name,
      attendee.email,
      attendee.phone || 'N/A',
      new Date(attendee.registeredAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.eventName}_attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Attendee list downloaded');
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    if (isUserRegistered) {
      toast.error('You are already registered for this event');
      return;
    }

    setRegistering(true);
    try {
      await eventAPI.registerForEvent(id, registrationData);
      toast.success('Registration successful!');
      setShowRegistrationForm(false);
      setIsUserRegistered(true);
      fetchEventDetails(); // Refresh event data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setRegistering(false);
    }
  };

  const handleInputChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Event Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/events')}
            className="btn-primary"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isPastEvent = eventDate < new Date();
  const isFullyBooked = event.registeredUsersCount >= event.TotalSeats;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/events')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </motion.button>

        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {event.eventCategory}
                </span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                  {event.eventType}
                </span>
                {isPastEvent && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                    Past Event
                  </span>
                )}
                {isFullyBooked && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
                    Fully Booked
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                {event.eventName}
              </h1>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                <User className="w-5 h-5 mr-2" />
                <span>Hosted by {event.eventHostedBy?.name}</span>
              </div>
            </div>
            
            <div className="lg:ml-8">
              {!isPastEvent && !isFullyBooked && (
                <motion.button
                  whileHover={{ scale: isUserRegistered ? 1 : 1.02 }}
                  whileTap={{ scale: isUserRegistered ? 1 : 0.98 }}
                  onClick={() => isUserRegistered ? null : setShowRegistrationForm(true)}
                  disabled={isUserRegistered}
                  className={`w-full lg:w-auto px-8 py-3 ${
                    isUserRegistered 
                      ? 'bg-green-500 hover:bg-green-500 cursor-default text-white font-semibold rounded-full'
                      : 'btn-primary'
                  }`}
                >
                  {isUserRegistered ? '✓ Registered' : 'Register Now'}
                </motion.button>
              )}
              {isPastEvent && (
                <div className="px-8 py-3 bg-gray-400 text-white font-semibold rounded-full text-center">
                  Event Completed
                </div>
              )}
              {isFullyBooked && !isPastEvent && (
                <div className="px-8 py-3 bg-red-500 text-white font-semibold rounded-full text-center">
                  Fully Booked
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs - Only show for event owner */}
        {user && event?.eventHostedBy?._id === user._id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-2 mb-8"
          >
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'details'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Event Details
            </button>
            <button
              onClick={() => {
                setActiveTab('attendees');
                if (attendees.length === 0 && !loadingAttendees) {
                  fetchAttendees();
                }
              }}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'attendees'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              Attendees ({event.registeredUsersCount || 0})
            </button>
          </motion.div>
        )}

        {/* Event Details Grid */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6"
            >
            <h2 className="text-2xl font-bold gradient-text mb-6">Event Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">Date & Time</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {eventDate.toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {eventDate.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">Venue</div>
                  <div className="text-gray-600 dark:text-gray-400">{event.eventVenue}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">Capacity</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {event.registeredUsersCount} / {event.TotalSeats} registered
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {event.availableSeats} seats remaining
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Event Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="text-2xl font-bold gradient-text mb-6">About This Event</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.eventDescription}
            </p>
          </motion.div>
          </div>
        )}

        {/* Attendees Tab - Only visible to event owner */}
        {activeTab === 'attendees' && user && event?.eventHostedBy?._id === user._id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold gradient-text">Registered Attendees</h2>
              </div>
              {attendees.length > 0 && (
                <button
                  onClick={downloadAttendeeList}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all duration-300 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Registrations</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {event.registeredUsersCount}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Seats</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {event.availableSeats}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Occupancy</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((event.registeredUsersCount / event.TotalSeats) * 100)}%
                </div>
              </div>
            </div>

            {/* Attendees List */}
            {loadingAttendees ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : attendees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No registrations yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendees.map((attendee, index) => (
                  <motion.div
                    key={attendee._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {attendee.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                          {attendee.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{attendee.email}</span>
                        </div>
                        {attendee.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{attendee.phone}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Registered: {new Date(attendee.registeredAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Registration Form Modal */}
        {showRegistrationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRegistrationForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold gradient-text mb-6">Register for Event</h3>
              
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={registrationData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={registrationData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={registrationData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                    pattern="[0-9]{10}"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registering}
                    className={`btn-primary flex-1 ${registering ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {registering ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Registering...
                      </div>
                    ) : (
                      'Confirm Registration'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;