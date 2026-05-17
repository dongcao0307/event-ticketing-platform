// src/services/eventService.js
import { get, post } from './apiClient';

// ==================== Helper Functions ====================
const API_BASE_URL = '/api/admin/events';

const normalizeEvent = (e) => ({
  id: String(e.id),
  title: e.title,
  date: e.formattedDate || '',
  location: e.location || e.city || '',
  city: e.city || '',
  price: e.priceDisplay || 'Miễn phí',
  image: e.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
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
});

const MOCK_EVENTS = [
  {
    id: 'mock-1', title: 'Đêm nhạc Bolero - Hoài niệm tuổi thơ', status: 'PUBLISHED',
    date: '20/06/2026', location: 'Nhà hát lớn Hà Nội', price: '250.000đ',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=220&fit=crop',
    category: 'MUSIC', badge: null, isFeatured: true,
  },
  {
    id: 'mock-2', title: 'Festival Âm nhạc Quốc tế Hà Nội 2026', status: 'PUBLISHED',
    date: '15/07/2026', location: 'Sân vận động Mỹ Đình, Hà Nội', price: '500.000đ',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=220&fit=crop',
    category: 'FESTIVAL', badge: null, isFeatured: true,
  },
  {
    id: 'mock-3', title: 'Lễ hội ẩm thực đường phố Sài Gòn', status: 'PUBLISHED',
    date: '05/07/2026', location: 'Phố đi bộ Nguyễn Huệ, TP.HCM', price: 'Miễn phí',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=220&fit=crop',
    category: 'FESTIVAL', badge: null, isFeatured: true,
  },
  {
    id: 'mock-4', title: 'Workshop Nhiếp ảnh Đường phố cùng Master', status: 'PUBLISHED',
    date: '28/06/2026', location: 'Quận 1, TP.HCM', price: '350.000đ',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=220&fit=crop',
    category: 'WORKSHOP', badge: null,
  },
  {
    id: 'mock-5', title: 'Show diễn Xiếc nghệ thuật đương đại', status: 'PUBLISHED',
    date: '10/07/2026', location: 'Rạp xiếc Trung ương, Hà Nội', price: '180.000đ',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=220&fit=crop',
    category: 'ART', badge: null,
  },
  {
    id: 'mock-6', title: 'Triển lãm nghệ thuật "Sắc màu Việt Nam"', status: 'PUBLISHED',
    date: '01/07/2026', location: 'Bảo tàng Mỹ thuật TP.HCM', price: '50.000đ',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=220&fit=crop',
    category: 'ART', badge: null,
  },
  {
    id: 'mock-7', title: 'Giải Marathon quốc tế Đà Nẵng 2026', status: 'PUBLISHED',
    date: '20/07/2026', location: 'Bãi biển Mỹ Khê, Đà Nẵng', price: '400.000đ',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=220&fit=crop',
    category: 'SPORTS', badge: null,
  },
  {
    id: 'mock-8', title: 'Hội thảo khởi nghiệp & Đổi mới sáng tạo', status: 'PUBLISHED',
    date: '25/06/2026', location: 'Trung tâm Hội nghị Quốc gia, Hà Nội', price: '200.000đ',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=220&fit=crop',
    category: 'WORKSHOP', badge: null,
  },
  {
    id: 'mock-9', title: 'Concert Sơn Tùng M-TP - Sky Tour 2026', status: 'PUBLISHED',
    date: '12/08/2026', location: 'Sân vận động Phú Thọ, TP.HCM', price: '750.000đ',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b631f55?w=400&h=220&fit=crop',
    category: 'MUSIC', badge: null, isFeatured: true,
  },
  {
    id: 'mock-10', title: 'Tuần lễ thời trang Hà Nội 2026', status: 'PUBLISHED',
    date: '18/07/2026', location: 'Gem Center, Hà Nội', price: '300.000đ',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop',
    category: 'OTHER', badge: null,
  },
  {
    id: 'mock-11', title: 'Đêm hội Trung Thu cho thiếu nhi', status: 'PUBLISHED',
    date: '06/09/2026', location: 'Công viên Thống Nhất, Hà Nội', price: 'Miễn phí',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=220&fit=crop',
    category: 'FESTIVAL', badge: null,
  },
  {
    id: 'mock-12', title: 'Workshop Lập trình AI & Machine Learning', status: 'PUBLISHED',
    date: '30/06/2026', location: 'Toà nhà FPT, Hà Nội', price: '450.000đ',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=220&fit=crop',
    category: 'WORKSHOP', badge: null,
  },
];

const tryApi = async (apiFn, fallbackValue) => {
  try {
    return await apiFn();
  } catch (err) {
    console.warn('[EventService] API unavailable:', err.message);
    return fallbackValue;
  }
};

// ==================== Public Events API ====================

const MOCK_FEATURED = MOCK_EVENTS.filter(e => e.isFeatured);
const MOCK_TRENDING = MOCK_EVENTS.slice(0, 6).map((e, i) => ({ ...e, badge: String(i + 1) }));
const MOCK_RECOMMENDED = MOCK_EVENTS.slice(0, 6);
const MOCK_WEEKEND = MOCK_EVENTS.filter(e => e.category === 'FESTIVAL').slice(0, 3);
const MOCK_WORKSHOP = MOCK_EVENTS.filter(e => e.category === 'WORKSHOP').slice(0, 3);

export const getFeaturedEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/featured');
    return (res.data || []).map(normalizeEvent);
  }, MOCK_FEATURED);

export const getTrendingEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/trending');
    return (res.data || []).map((e, i) => ({ ...normalizeEvent(e), badge: String(i + 1) }));
  }, MOCK_TRENDING);

export const getRecommendedEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/latest');
    return (res.data || []).slice(0, 6).map(normalizeEvent);
  }, MOCK_RECOMMENDED);

export const getResaleEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/search', { size: 6 });
    return (res.data?.content || []).map(normalizeEvent);
  }, MOCK_EVENTS.slice(6, 12));

export const getWeekendEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/category/FESTIVAL');
    return (res.data || []).slice(0, 3).map(normalizeEvent);
  }, MOCK_WEEKEND);

export const getMonthEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/category/WORKSHOP');
    return (res.data || []).slice(0, 3).map(normalizeEvent);
  }, MOCK_WORKSHOP);

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

export const getEventById = async (id) =>
  tryApi(async () => {
    const res = await get(`/events/${id}`);
    return normalizeEvent(res.data);
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