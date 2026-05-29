// src/services/apiClient.js
// Centralized API client with JWT token handling and auto-refresh

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAccessToken = () => null;
const getRefreshToken = () => null;
const setTokens = () => {};
const clearTokens = () => {};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (user, error) => {
  refreshSubscribers.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(user);
  });
  refreshSubscribers = [];
};

const addRefreshSubscriber = () => new Promise((resolve, reject) => {
  refreshSubscribers.push({ resolve, reject });
});

const doRefresh = async () => {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  const json = await res.json();
  const { user } = json.data;
  return user;
};

// Thêm danh sách các đường dẫn không cần Token
const PUBLIC_ENDPOINTS = [
  '/events/featured',
  '/events/latest',
  '/events/trending',
  '/events/search',
  '/events/category'
];

export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const isPublic = PUBLIC_ENDPOINTS.some(path => endpoint.startsWith(path));

  const headers = {
    ...(options.headers || {}),
  };

  // 2. TỐI ƯU CHO UPLOAD FILE:
  // Nếu body KHÔNG PHẢI là FormData (truyền file) thì mới ép kiểu 'application/json' mặc định.
  // Nếu là FormData, để trống Content-Type để trình duyệt tự động thiết lập cùng Multipart Boundary.
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  let response = await fetch(url, { 
    ...options, 
    headers,
    credentials: 'include' 
  });

 if (response.status === 401 && !isPublic) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const user = await doRefresh();
        isRefreshing = false;
        onRefreshed(user, null);
      } catch (err) {
        isRefreshing = false;
        onRefreshed(null, err);
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
    } else {
      await addRefreshSubscriber();
    }

    response = await fetch(url, { 
      ...options, 
      headers,
      credentials: 'include' 
    });
  }

  if (!response.ok) {
    let errMsg = `HTTP ${response.status}`;
    let errStatus = response.status;
    try {
      const errJson = await response.json();
      errMsg = errJson.message || errMsg;
    } catch (_) {}
    const err = new Error(errMsg);
    err.status = errStatus;
    throw err;
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