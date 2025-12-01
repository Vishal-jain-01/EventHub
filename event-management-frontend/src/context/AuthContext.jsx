import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (token && !isLoggingOut) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Only logout if it's an auth error (401), not network errors
      if (error.response?.status === 401 && !isLoggingOut) {
        handleAuthError();
      } else {
        setLoading(false);
      }
    }
  };

  const handleAuthError = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
    // Don't show toast for auto-logout due to invalid token
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { accessToken } = response.data;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register(name, email, password);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    setTimeout(() => setIsLoggingOut(false), 100);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};