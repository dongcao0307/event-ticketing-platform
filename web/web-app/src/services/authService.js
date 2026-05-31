// src/services/authService.js
import { post, put, get, setTokens, clearTokens } from './apiClient';
import { decodeToken } from '../utils/tokenUtils';

export const authService = {
  register: async (userName, email, password, fullName, phone, role = 'USER') => {
    const res = await post('/auth/register', { userName, email, password, fullName, phone, role });
    if (res.data) {
      setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  login: async (credentials) => {
    const payload = { password: credentials.password };
    if (typeof credentials === 'string') {
      const identifier = credentials;
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(identifier).trim());
      if (isEmail) payload.email = identifier;
      else payload.userName = identifier;
    } else {
      if (credentials.userName) payload.userName = credentials.userName;
      if (credentials.email) payload.email = credentials.email;
      if (credentials.turnstileToken) payload.turnstileToken = credentials.turnstileToken;
      // keep phone support for backward compatibility if present
      if (credentials.phone) payload.phone = credentials.phone;
    }

    const res = await post('/auth/login', payload);
    if (res.data) {
      setTokens(res.data.accessToken, res.data.refreshToken);
    }
    return res;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    clearTokens();
    try {
      if (refreshToken) {
        await post('/auth/logout', { refreshToken });
      }
    } catch (_) {}
  },

  getProfile: async () => {
    const res = await get('/auth/me');
    return res;
  },

  updateProfile: async (userData) => {
    const res = await put('/auth/me', userData);
    return res;
  },

  isLoggedIn: () => !!localStorage.getItem('jwt_token'),

  /**
   * Get user profile from API /auth/me
   * @returns {object} - User profile with role, username, email, etc.
   */
  getUserProfile: async () => {
    try {
      if (!authService.isLoggedIn()) return { role: 'USER', userName: 'User' };
      const res = await get('/auth/me');
      return res.data || { role: 'USER', userName: 'User' };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { role: 'USER', userName: 'User' };
    }
  },

  /**
   * Get user role from API /auth/me
   * Falls back to JWT token if API fails
   * @returns {string} - User role or 'USER' as default
   */
  getUserRole: async () => {
    try {
      const profile = await authService.getUserProfile();
      return profile?.role || 'USER';
    } catch (error) {
      // Fallback to token decode if API fails
      const token = localStorage.getItem('jwt_token');
      const decoded = decodeToken(token);
      return decoded?.role || 'USER';
    }
  },

  /**
   * Check if user is admin by fetching from API
   * @returns {boolean}
   */
  isAdmin: async () => {
    const role = await authService.getUserRole();
    return role === 'ADMIN';
  },
};
