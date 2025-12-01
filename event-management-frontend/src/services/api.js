import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect here, let AuthContext handle it
    // Just reject the error and let the calling code handle it
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/user/login', { email, password }),
  register: (name, email, password) => api.post('/user/register', { name, email, password }),
  getCurrentUser: () => api.get('/user/currentUser'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  changePassword: (passwordData) => api.put('/user/changePassword', passwordData),
  getUserEvents: () => api.get('/user/myEvents'),
  getUserRegistrations: () => api.get('/user/myRegistrations'),
};

// Event endpoints
export const eventAPI = {
  getAllEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/event/allevents${queryString ? `?${queryString}` : ''}`);
  },
  getEventById: (id) => api.get(`/event/event/${id}`),
  createEvent: (eventData) => api.post('/event/event', eventData),
  updateEvent: (id, eventData) => api.put(`/event/event/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/event/deleteEvent/${id}`),
  registerForEvent: (id, userData) => api.post(`/event/eventRegister/${id}`, userData),
  cancelRegistration: (id) => api.delete(`/event/cancelRegistration/${id}`),
  checkRegistrationStatus: (id) => api.get(`/event/registrationStatus/${id}`),
  getEventStats: (id) => api.get(`/event/stats/${id}`),
};

export default api;