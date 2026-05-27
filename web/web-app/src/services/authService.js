// src/services/authService.js
import { post, put, get, setTokens, clearTokens } from './apiClient';

export const authService = {
  register: async (userName, email, password, fullName, phone, role = 'USER') => {
    const res = await post('/auth/register', { userName, email, password, fullName, phone, role });
    if (res.data) {
      setTokens(res.data.accessToken, res.data.refreshToken);
      if (res.data.user) {
        // Đảm bảo role được lưu
        const userData = { ...res.data.user, role: res.data.user.role || role };
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
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

  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || 'USER';
  },

  isAdmin: () => {
    const role = authService.getUserRole();
    return role === 'ADMIN';
  },

  isUser: () => {
    const role = authService.getUserRole();
    return role === 'USER';
  },

  isLoggedIn: () => !!localStorage.getItem('jwt_token'),
};
