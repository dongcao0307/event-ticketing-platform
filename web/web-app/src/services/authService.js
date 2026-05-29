// src/services/authService.js
import { post, put, get } from './apiClient';

let currentUser = null;

export const authService = {
  setCurrentUser: (user) => {
    currentUser = user;
  },

  register: async (userName, email, password, fullName, phone, role = 'USER') => {
    const res = await post('/auth/register', { userName, email, password, fullName, phone, role });
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
      if (credentials.phone) payload.phone = credentials.phone;
    }

    const res = await post('/auth/login', payload);
    return res;
  },

  logout: async () => {
    try {
      await post('/auth/logout');
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

  getCurrentUser: () => {
    return currentUser;
  },

  getUserRole: () => {
    return currentUser?.role || 'USER';
  },

  isAdmin: () => {
    const role = authService.getUserRole();
    return role === 'ADMIN';
  },

  isUser: () => {
    const role = authService.getUserRole();
    return role === 'USER';
  },

  isLoggedIn: () => !!currentUser,
};
