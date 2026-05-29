import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response && response.data) {
        setUser(response.data);
        authService.setCurrentUser(response.data);
      } else {
        setUser(null);
        authService.setCurrentUser(null);
      }
    } catch (err) {
      setUser(null);
      authService.setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      await fetchProfile();
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (userName, email, password, fullName, phone) => {
    setLoading(true);
    try {
      const res = await authService.register(userName, email, password, fullName, phone);
      await fetchProfile();
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      authService.setCurrentUser(null);
      setLoading(false);
    }
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, isAdmin, login, register, logout, setUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
