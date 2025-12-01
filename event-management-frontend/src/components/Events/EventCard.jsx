import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowRight, Trash2, Edit } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { eventAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { scrollToTop } from '../../utils/scrollUtils';

const EventCard = ({ event, showActions = false, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const eventDate = new Date(event.eventDate);
  const isUpcoming = isAfter(eventDate, new Date());
  const availableSeats = event.TotalSeats - (event.registeredUsersCount || 0);
  const occupancyPercentage = ((event.registeredUsersCount || 0) / event.TotalSeats) * 100;

  const getStatusColor = () => {
    if (!isUpcoming) return 'bg-gray-500';
    if (occupancyPercentage >= 90) return 'bg-red-500';
    if (occupancyPercentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isUpcoming) return 'Past Event';
    if (availableSeats === 0) return 'Fully Booked';
    if (availableSeats <= 10) return 'Almost Full';
    return 'Available';
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      await eventAPI.deleteEvent(event._id);
      toast.success('Event deleted successfully');
      if (onDelete) {
        onDelete(event._id);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete event';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="event-card h-full"
    >
      <div className="flex flex-col h-full">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(eventDate, 'MMM dd, yyyy')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(eventDate, 'h:mm a')}
            </div>
          </div>
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.eventName}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
          {event.eventDescription}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4 mr-3 text-blue-500" />
            <span className="text-sm">
              {format(eventDate, 'EEEE, MMMM do, yyyy')}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-3 text-green-500" />
            <span className="text-sm">
              {format(eventDate, 'h:mm a')}
            </span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-3 text-red-500" />
            <span className="text-sm">{event.eventVenue}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 mr-3 text-purple-500" />
            <span className="text-sm">
              {event.registeredUsersCount || 0} / {event.TotalSeats} registered
            </span>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Occupancy</span>
            <span>{Math.round(occupancyPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${occupancyPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full bg-gradient-to-r ${
                occupancyPercentage >= 90 
                  ? 'from-red-400 to-red-600' 
                  : occupancyPercentage >= 70 
                  ? 'from-orange-400 to-orange-600' 
                  : 'from-green-400 to-green-600'
              }`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            to={`/events/${event._id}`}
            onClick={scrollToTop}
            className="btn-primary w-full group flex items-center justify-center"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {showActions && isUpcoming && (
            <div className="flex gap-2">
              <Link
                to={`/edit-event/${event._id}`}
                onClick={scrollToTop}
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`btn-danger flex-1 flex items-center justify-center ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
          
          {showActions && !isUpcoming && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Past events cannot be edited
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;