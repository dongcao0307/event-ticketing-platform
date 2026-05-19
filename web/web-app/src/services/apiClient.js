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

  // 1. Khởi tạo headers cơ bản và đính kèm Bearer Token nếu có
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // 2. TỐI ƯU CHO UPLOAD FILE:
  // Nếu body KHÔNG PHẢI là FormData (truyền file) thì mới ép kiểu 'application/json' mặc định.
  // Nếu là FormData, để trống Content-Type để trình duyệt tự động thiết lập cùng Multipart Boundary.
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

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

export const get = (endpoint, params, options = {}) => {
  const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
  return request(url, { 
    ...options, // <--- THÊM DÒNG NÀY ĐỂ GIỮ HEADER X-USER-ID
    method: 'GET' 
  });
};

// 3. TỐI ƯU HÀM POST: Nhớ truyền thêm options (để giữ lại các custom headers như X-User-Id)
export const post = (endpoint, body, options = {}) => {
  const isFormData = body instanceof FormData;
  return request(endpoint, { 
    ...options, // <-- THÊM DÒNG NÀY ĐỂ KHÔNG BỊ RỚT HEADER
    method: 'POST', 
    body: isFormData ? body : JSON.stringify(body) 
  });
};

// 4. TỐI ƯU HÀM PUT: Tương tự hàm post
export const put = (endpoint, body, options = {}) => {
  const isFormData = body instanceof FormData;
  return request(endpoint, { 
    ...options, // <-- THÊM DÒNG NÀY
    method: 'PUT', 
    body: isFormData ? body : JSON.stringify(body) 
  });
};

// Thêm options = {} vào đây để truyền header X-User-Id từ service sang
export const del = (endpoint, options = {}) =>
  request(endpoint, { 
    ...options, // <--- ĐỂ GIỮ LẠI HEADER X-USER-ID
    method: 'DELETE' 
  });

export { setTokens, clearTokens, getAccessToken, getRefreshToken };