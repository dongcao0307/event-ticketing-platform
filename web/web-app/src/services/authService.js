// src/services/authService.js
import { post, put, get, setTokens, clearTokens } from './apiClient';

export const authService = {
  register: async (userName, email, password, fullName, phone) => {
    const res = await post('/auth/register', { userName, email, password, fullName, phone });
    if (res.data) {
      setTokens(res.data.accessToken, res.data.refreshToken);
      if (res.data.user) {
        localStorage.setItem('user_data', JSON.stringify(res.data.user));
      }
    }
    return res;
  },

  login: async (email, password) => {
    const res = await post('/auth/login', { email, password });
    if (res.data) {
      setTokens(res.data.accessToken, res.data.refreshToken);
      if (res.data.user) {
        localStorage.setItem('user_data', JSON.stringify(res.data.user));
      }
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
    if (res.data) {
      localStorage.setItem('user_data', JSON.stringify(res.data));
    }
    return res;
  },

  updateProfile: async (userData) => {
    const res = await put('/auth/me', userData);
    if (res.data) {
      localStorage.setItem('user_data', JSON.stringify(res.data));
    }
    return res;
  },

  getCurrentUser: () => {
    const raw = localStorage.getItem('user_data');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (_) { return null; }
  },

  isLoggedIn: () => !!localStorage.getItem('jwt_token'),
};
