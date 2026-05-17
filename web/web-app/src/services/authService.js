// src/services/authService.js
import { post, put, get, setTokens, clearTokens } from './apiClient';

export const authService = {
  register: async (userName, email, password, fullName, phone) => {
    const res = await post('/auth/register', { userName, email, password, fullName, phone });
    const data = res.data || res;
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user || data;
    if (accessToken) {
      setTokens(accessToken, refreshToken);
    }
    if (user && (user.email || user.userName || user.id)) {
      const userData = {
        email: user.email || email,
        name: user.fullName || user.name || fullName || '',
        phone: user.phoneNumber || user.phone || phone || '',
        userName: user.userName || userName,
        gender: user.gender || 'Nam',
        birthDate: user.birthDate || '',
        user_avatar: user.avatarUrl || user.user_avatar || '',
        role: user.role || 'USER',
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
      if (!accessToken) {
        localStorage.setItem('jwt_token', 'registered');
      }
    }
    return res;
  },

  login: async (email, password) => {
    const res = await post('/auth/login', { email, password });
    const data = res.data || res;
    const accessToken = data.accessToken || data.token;
    const refreshToken = data.refreshToken;
    const user = data.user || data;
    if (accessToken) {
      setTokens(accessToken, refreshToken);
    }
    if (user && (user.email || user.userName || user.id)) {
      const userData = {
        email: user.email || email,
        name: user.fullName || user.name || '',
        phone: user.phoneNumber || user.phone || '',
        userName: user.userName || '',
        gender: user.gender || 'Nam',
        birthDate: user.birthDate || '',
        user_avatar: user.avatarUrl || user.user_avatar || '',
        role: user.role || 'USER',
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
    return res;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    clearTokens();
    localStorage.removeItem('login_rate_limit');
    try {
      if (refreshToken && refreshToken !== 'registered') {
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
