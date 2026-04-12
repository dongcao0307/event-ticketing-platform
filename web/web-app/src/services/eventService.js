// src/services/eventService.js
import { get } from './apiClient';

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

const fallbackFeatured = [
  { id: 'f1', title: 'ARGU - Live in Vietnam 2026', date: '24 tháng 04, 2026', location: 'SVĐ Mỹ Đình, Hà Nội', price: 'Từ 999.000đ', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80' },
  { id: 'f2', title: 'The Traditional Water Puppet Show', date: '20 tháng 04, 2026', location: 'Nhà hát Múa rối Thăng Long', price: 'Từ 350.000đ', image: 'https://images.unsplash.com/photo-1519730901064-18ed6fdf2cd4?auto=format&fit=crop&w=1200&q=80' },
  { id: 'f3', title: 'Lễ hội Ánh sáng Hà Nội 2026', date: '15 tháng 05, 2026', location: 'Công viên Thống Nhất, Hà Nội', price: 'Từ 180.000đ', image: 'https://images.unsplash.com/photo-1453974336165-b28f7a47d14d?auto=format&fit=crop&w=1200&q=80' },
];

const fallbackTrending = [
  { id: 't1', title: 'ĐÊM THÁNH - Đêm nhạc Trung Quân', date: '23 tháng 04, 2026', location: 'Trung tâm HNQG, Hà Nội', price: 'Từ 700.000đ', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', badge: '1' },
  { id: 't2', title: 'Mr. Siro Concert 2026', date: '28 tháng 05, 2026', location: 'Cung Thể thao Quần Ngựa', price: 'Từ 450.000đ', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80', badge: '2' },
  { id: 't3', title: 'Crossroads - The Untold Stories', date: '21 tháng 04, 2026', location: 'Nhà hát Hòa Bình, HCM', price: 'Từ 575.000đ', image: 'https://images.unsplash.com/photo-1495121605193-b116b5b09bf5?auto=format&fit=crop&w=1200&q=80', badge: '3' },
];

const fallbackRecommended = [
  { id: 'r1', title: 'Kịch Xóm - Mùa 3', date: '05 tháng 05, 2026', location: 'Sân khấu IDECAF, HCM', price: 'Từ 200.000đ', image: 'https://images.unsplash.com/photo-1527060397950-31b8f0b6fe03?auto=format&fit=crop&w=1200&q=80' },
  { id: 'r2', title: 'Workshop Terrarium & Candle', date: '08 tháng 05, 2026', location: 'The Garden Workshop, Hà Nội', price: 'Từ 420.000đ', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80' },
  { id: 'r3', title: 'Concert Jazz Night Đà Nẵng', date: '12 tháng 05, 2026', location: 'Aria Hotel & Spa, Đà Nẵng', price: 'Từ 350.000đ', image: 'https://images.unsplash.com/photo-1513283487479-d8d9c1c0b7c1?auto=format&fit=crop&w=1200&q=80' },
];

const tryApi = async (apiFn, fallback) => {
  try {
    return await apiFn();
  } catch (err) {
    console.warn('[EventService] API unavailable, using fallback data:', err.message);
    return fallback;
  }
};

export const getFeaturedEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/featured');
    return (res.data || []).map(normalizeEvent);
  }, fallbackFeatured);

export const getTrendingEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/trending');
    return (res.data || []).map((e, i) => ({ ...normalizeEvent(e), badge: String(i + 1) }));
  }, fallbackTrending);

export const getRecommendedEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/latest');
    return (res.data || []).slice(0, 6).map(normalizeEvent);
  }, fallbackRecommended);

export const getResaleEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/search', { size: 6 });
    return (res.data?.content || []).map(normalizeEvent);
  }, fallbackRecommended);

export const getWeekendEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/category/FESTIVAL');
    return (res.data || []).slice(0, 3).map(normalizeEvent);
  }, [fallbackFeatured[2]]);

export const getMonthEvents = async () =>
  tryApi(async () => {
    const res = await get('/events/category/WORKSHOP');
    return (res.data || []).slice(0, 3).map(normalizeEvent);
  }, [fallbackRecommended[1]]);

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
    events: [...fallbackFeatured, ...fallbackTrending, ...fallbackRecommended],
    totalElements: 9,
    totalPages: 1,
    page: 0,
  });

export const getEventById = async (id) =>
  tryApi(async () => {
    const res = await get(`/events/${id}`);
    return normalizeEvent(res.data);
  }, null);
