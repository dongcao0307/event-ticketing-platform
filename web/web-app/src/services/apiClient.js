// src/services/apiClient.js
// Centralized API client with JWT token handling and auto-refresh

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAccessToken = () => localStorage.getItem('jwt_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('jwt_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token, error) => {
  refreshSubscribers.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshSubscribers = [];
};

const addRefreshSubscriber = () => new Promise((resolve, reject) => {
  refreshSubscribers.push({ resolve, reject });
});

const doRefresh = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }

  const json = await res.json();
  const { accessToken, refreshToken: newRefreshToken, user } = json.data;
  setTokens(accessToken, newRefreshToken);
  if (user) localStorage.setItem('user_data', JSON.stringify(user));
  return accessToken;
};

export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      throw new Error('Phiên đăng nhập đã hết hạn');
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await doRefresh();
        isRefreshing = false;
        onRefreshed(newToken, null);
      } catch (err) {
        isRefreshing = false;
        onRefreshed(null, err);
        clearTokens();
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
    } else {
      await addRefreshSubscriber();
    }

    const newToken = getAccessToken();
    const retryHeaders = {
      ...headers,
      Authorization: `Bearer ${newToken}`,
    };
    response = await fetch(url, { ...options, headers: retryHeaders });
  }

  if (!response.ok) {
    let errMsg = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errMsg = errJson.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
};

export const get = (endpoint, params) => {
  const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
  return request(url, { method: 'GET' });
};

export const post = (endpoint, body) =>
  request(endpoint, { method: 'POST', body: JSON.stringify(body) });

export const put = (endpoint, body) =>
  request(endpoint, { method: 'PUT', body: JSON.stringify(body) });

export const del = (endpoint) =>
  request(endpoint, { method: 'DELETE' });

export { setTokens, clearTokens, getAccessToken, getRefreshToken };
