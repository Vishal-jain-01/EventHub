import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Mail, Phone, Calendar, Download } from 'lucide-react';
import { eventAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AttendeesModal = ({ eventId, eventName, isOpen, onClose }) => {
  const [attendees, setAttendees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchAttendees();
    }
  }, [isOpen, eventId]);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventStats(eventId);
      setStats(response.data);
      setAttendees(response.data.registrations || []);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      toast.error('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  const downloadAttendeeList = () => {
    if (attendees.length === 0) {
      toast.error('No attendees to download');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Registered At'];
    const rows = attendees.map(attendee => [
      attendee.name,
      attendee.email,
      attendee.phone,
      new Date(attendee.registeredAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventName.replace(/\s+/g, '_')}_attendees.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Attendee list downloaded!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-8 h-8 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold">Event Attendees</h2>
                  <p className="text-blue-100 mt-1">{eventName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {stats && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.registeredUsers}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Registrations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.availableSeats}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Seats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.occupancyRate}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading attendees...</p>
              </div>
            ) : attendees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Attendees Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">No one has registered for this event yet.</p>
              </div>
            ) : (
              <>
                {/* Download Button */}
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={downloadAttendeeList}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </button>
                </div>

                {/* Attendees List */}
                <div className="space-y-4">
                  {attendees.map((attendee, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                            {attendee.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {attendee.name}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{attendee.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{attendee.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Registered: {new Date(attendee.registeredAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AttendeesModal;
