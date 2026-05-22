import { get, put } from './apiClient';

export const adminUserService = {
  listUsers: async ({ page = 0, size = 10, keyword, status } = {}) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    return get('/admin/users', params);
  },

  getUserDetail: async (userName) => get(`/admin/users/detail/${encodeURIComponent(userName)}`),

  updateUserStatus: async (userName, status) =>
    put(`/admin/users/${encodeURIComponent(userName)}/status?status=${encodeURIComponent(status)}`),
};