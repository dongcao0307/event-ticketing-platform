// src/services/axiosConfig.js
import axios from 'axios';
import { clearTokens } from './apiClient';

// Configure defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
axios.defaults.withCredentials = true;

// Response Interceptor: Handle 401 Unauthorized globally
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns 401 Unauthorized
    const config = error.config;
    const isAbsolute = config && config.url && /^https?:\/\//i.test(config.url);
    const isExternal = isAbsolute && 
      !config.url.startsWith(window.location.origin) && 
      !(axios.defaults.baseURL && config.url.startsWith(axios.defaults.baseURL));

    if (error.response && error.response.status === 401 && !isExternal) {
      console.warn('[Axios Interceptor] 401 Unauthorized detected. Logging out user.');
      
      // 1. Clear tokens and user data
      clearTokens();
      
      // 2. Dispatch the global event to trigger the LoginModal
      window.dispatchEvent(new CustomEvent('openLoginModal'));
    }
    return Promise.reject(error);
  }
);
