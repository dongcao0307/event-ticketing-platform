// src/services/eventService.js
import { get, post } from './apiClient';

// ==================== Helper Functions ====================
const API_BASE_URL = '/admin/events';

const normalizeEvent = (e) => {
  if (!e) return null;

  // 🌟 TỰ ĐỘNG FORMAT GIÁ TIỀN THÔNG MINH TỪ MIN_PRICE CỦA BACKEND
  let displayPrice = 'Miễn phí';
  if (e.minPrice !== null && e.minPrice !== undefined && Number(e.minPrice) > 0) {
    displayPrice = `${Number(e.minPrice).toLocaleString('vi-VN')} đ`;
  } else if (e.priceDisplay) {
    displayPrice = e.priceDisplay; // Giữ lại backup nếu sau này backend tự trả chuỗi
  }

  return {
    id: String(e.id),
    title: e.title,
    date: e.formattedDate || '',
    location: e.location || e.city || '',
    city: e.city || '',
    price: displayPrice, // Now it dynamic!
    image: e.imageUrl || e.thumbnailUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
    category: e.category || 'OTHER',
    status: e.status || 'UPCOMING',
    description: e.description || '',
    minPrice: e.minPrice,
    maxPrice: e.maxPrice,
    startTime: e.startTime,
    endTime: e.endTime,
    availableTickets: e.availableTickets,
    totalTickets: e.totalTickets,
    organizerName: e.organizerName,
    isFeatured: e.isFeatured,
    viewCount: e.viewCount,
  };
};

const tryApi = async (apiFn, fallbackValue) => {
  try {
    return await apiFn();
  } catch (err) {
    console.warn('[EventService] API unavailable:', err.message);
    return fallbackValue;
  }
};

// ==================== Public Events API ====================

export const getFeaturedEvents = async () =>
  getPublicEventsCQRS({ type: 'featured' });

export const getTrendingEvents = async () => {
  const events = await getPublicEventsCQRS({ type: 'trending' });
  return events.map((e, i) => ({ ...e, badge: String(i + 1) }));
};

export const getRecommendedEvents = async () => {
  const events = await getPublicEventsCQRS({ type: 'latest' });
  return events.slice(0, 6);
};

export const getResaleEvents = async () => {
  const events = await getPublicEventsCQRS();
  return events.slice(0, 6);
};

export const getWeekendEvents = async () => {
  const events = await getPublicEventsCQRS({ category: 'FESTIVAL' });
  return events.slice(0, 3);
};

export const getMonthEvents = async () => {
  const events = await getPublicEventsCQRS({ category: 'WORKSHOP' });
  return events.slice(0, 3);
};

export const searchEvents = async (keyword, filters = {}, page = 0, size = 20) =>
  tryApi(async () => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (filters.category) params.category = filters.category;
    if (filters.city) params.city = filters.city;
    if (filters.status) params.status = filters.status;
    const res = await get('/events/search', params);
    return {
      events: (res.data?.content || []).map(normalizeEvent),
      totalElements: res.data?.totalElements || 0,
      totalPages: res.data?.totalPages || 0,
      page: res.data?.page || 0,
    };
  }, {
    events: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
  });

export const searchSemanticEvents = async (keyword, filters = {}, page = 0, size = 20) =>
  tryApi(async () => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (filters.category) params.category = filters.category;
    if (filters.city) params.city = filters.city;
    if (filters.status) params.status = filters.status;
    const res = await get('/events/search-semantic', params);
    return {
      events: (res.data?.content || []).map(normalizeEvent),
      totalElements: res.data?.totalElements || 0,
      totalPages: res.data?.totalPages || 0,
      page: res.data?.page || 0,
    };
  }, {
    events: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
  });

export const getEventById = async (id) =>
  tryApi(async () => {
    const res = await get(`/events/cqrs/public/events/${id}`);
    const eventData = res && res.id ? res : (res?.data || null);
    return normalizeEvent(eventData);
  }, null);

// ==================== Admin Event API Functions ====================

export const getAllAdminEvents = async (status = null, search = null) => {
  const params = {};
  if (status) params.status = status;
  if (search) params.search = search;
  
  const res = await get(API_BASE_URL, params);
  return res.data || [];
};

export const getAdminEventDetail = async (eventId) => {
  const res = await get(`${API_BASE_URL}/${eventId}`);
  return res.data || null;
};

export const approveEvent = async (eventId) => {
  const res = await post(`${API_BASE_URL}/${eventId}/approve`, {});
  return res.data || null;
};

export const rejectEvent = async (eventId, reason = '') => {
  const res = await post(`${API_BASE_URL}/${eventId}/reject`, { eventId, reason });
  return res.data || null;
};

export const lockEvent = async (eventId, reason = '') => {
  const res = await post(`${API_BASE_URL}/${eventId}/lock`, { eventId, reason });
  return res.data || null;
};

export const searchAdminEvents = async (query, status = null) => {
  const params = { query };
  if (status) params.status = status;
  const res = await get(`${API_BASE_URL}/search`, params);
  return res.data || [];
};

export const getEventsByCategory = async (categoryEnum) => {
  return getPublicEventsCQRS({ category: categoryEnum });
};

export const getLatestEvents = async () => {
  return getPublicEventsCQRS({ type: 'latest' });
};

export const getPublicEventsCQRS = async (params = {}) => {
  console.log("[FRONTEND] Calling CQRS Mongo API for Home Page...");
  return tryApi(async () => {
    const res = await get('/events/cqrs/public/events', params);
    const rawEvents = Array.isArray(res) ? res : (res.data || []);
    return rawEvents.map(normalizeEvent);
  }, []);
};

// ==================== Favorite Events API ====================

export const toggleFavoriteEvent = async (eventId) => {
  const res = await post(`/events/${eventId}/favorite/toggle`, {});
  return res.data;
};

export const getFavoriteEvents = async () => {
  const res = await get('/events/favorites');
  return (res.data || []).map(normalizeEvent);
};

export const getFavoriteStatus = async (eventId) => {
  const res = await get(`/events/${eventId}/favorite/status`);
  return res.data;
};