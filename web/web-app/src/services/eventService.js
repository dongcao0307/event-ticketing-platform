// src/services/eventService.js

const featuredEvents = [
  {
    id: 'featured-1',
    title: 'SUPER SHOW 10 – Super Junior',
    date: '24 tháng 02, 2026',
    location: 'Sân vận động Mỹ Đình',
    price: 'Từ 750.000đ',
    image:
      'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'featured-2',
    title: 'HER Concert – Hòa nhạc lãng mạn',
    date: '07 tháng 02, 2026',
    location: 'Hội trường GV3',
    price: 'Từ 350.000đ',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'featured-3',
    title: 'Hội chợ Workshop Handmade',
    date: '25 tháng 01, 2026',
    location: 'TP. Hồ Chí Minh',
    price: 'Từ 250.000đ',
    image:
      'https://images.unsplash.com/photo-1542144582-dc4f5f8b5a50?auto=format&fit=crop&w=1200&q=80',
  },
];

const trendingEvents = [
  {
    id: 'trend-1',
    title: 'DÉ GARDEN Moss Frame Workshop',
    date: '19 tháng 02, 2026',
    location: 'Hà Nội',
    price: 'Từ 450.000đ',
    image:
      'https://images.unsplash.com/photo-1520975914767-4c01e147f37b?auto=format&fit=crop&w=1200&q=80',
    badge: '1',
  },
  {
    id: 'trend-2',
    title: 'DÉ GARDEN Terrarium Workshop',
    date: '13 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 445.000đ',
    image:
      'https://images.unsplash.com/photo-1573164574395-0566f5e9280a?auto=format&fit=crop&w=1200&q=80',
    badge: '2',
  },
  {
    id: 'trend-3',
    title: 'ART WORKSHOP "FRENCH LEMON MINI TARTE"',
    date: '13 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 390.000đ',
    image:
      'https://images.unsplash.com/photo-1558021212-51b6ec46ff44?auto=format&fit=crop&w=1200&q=80',
    badge: '3',
  },
];

const recommendedEvents = [
  {
    id: 'rec-1',
    title: 'SÂN KHẤU XÓM KỊCH: CĂN HỘ SỐ 13',
    date: '15 tháng 03, 2026',
    location: 'TP. Hồ Chí Minh',
    price: 'Từ 250.000đ',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rec-2',
    title: 'IN BÓNG LONG THÀNH - SILHOUETTE OF THANG LONG',
    date: '20 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 500.000đ',
    image:
      'https://images.unsplash.com/photo-1515169067865-5387b23d7e86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rec-3',
    title: 'CHƯƠNG TRÌNH STARTUP STREET',
    date: '28 tháng 03, 2026',
    location: 'TP. Hồ Chí Minh',
    price: 'Từ 199.000đ',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  },
];

const resaleEvents = [
  {
    id: 'r1',
    title: 'GAI HOME CONCERT',
    date: '26 tháng 04, 2026',
    location: 'Ocean Park',
    price: 'Từ 250.000đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  },
  {
    id: 'r2',
    title: 'ĐÀO HOA HẬU',
    date: '15 tháng 03, 2026',
    location: 'Nhà hát Bến Thành',
    price: 'Từ 350.000đ',
    image: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229',
  },
  {
    id: 'r3',
    title: 'Mr Siro Concert',
    date: '28 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 450.000đ',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
  },
  {
    id: 'r4',
    title: 'GAI HOME CONCERT',
    date: '26 tháng 04, 2026',
    location: 'Ocean Park',
    price: 'Từ 250.000đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  },
  {
    id: 'r5',
    title: 'ĐÀO HOA HẬU',
    date: '15 tháng 03, 2026',
    location: 'Nhà hát Bến Thành',
    price: 'Từ 350.000đ',
    image: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229',
  },
  {
    id: 'r6',
    title: 'Mr Siro Concert',
    date: '28 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 450.000đ',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
  },
];

const weekendEvents = [
  {
    id: 'w1',
    title: 'B.DUCK CITYFUNS @VINCOM',
    date: '20 tháng 01, 2026',
    price: 'Từ 82.500đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  },
];

const monthEvents = [
  {
    id: 'm1',
    title: 'Workshop Candle',
    date: '24 tháng 01, 2026',
    price: 'Từ 279.000đ',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
  },
];

const simulateFetch = (data, delay = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve([...data]), delay);
  });

const API_BASE_URL = 'http://localhost:8082/api/admin';

// ========== Public Events ==========
export const getFeaturedEvents = async () => simulateFetch(featuredEvents);
export const getTrendingEvents = async () => simulateFetch(trendingEvents);
export const getRecommendedEvents = async () => simulateFetch(recommendedEvents);
export const getResaleEvents = async () => simulateFetch(resaleEvents);
export const getWeekendEvents = async () => simulateFetch(weekendEvents);
export const getMonthEvents = async () => simulateFetch(monthEvents);

// ========== Admin Event API Functions ==========

/**
 * Get all events with optional filters
 * @param {string} status - Filter by status: DRAFT, PUBLISHER, CANCELLED (optional)
 * @param {string} search - Search keyword (optional)
 */
export const getAllAdminEvents = async (status = null, search = null) => {
  try {
    let url = `${API_BASE_URL}/events`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching admin events:', error);
    throw error;
  }
};

/**
 * Get single event detail
 * @param {number} eventId - Event ID
 */
export const getAdminEventDetail = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching event detail:', error);
    throw error;
  }
};

/**
 * Approve event (DRAFT -> PUBLISHER)
 * @param {number} eventId - Event ID to approve
 */
export const approveEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error approving event:', error);
    throw error;
  }
};

/**
 * Reject event (DRAFT -> CANCELLED)
 * @param {number} eventId - Event ID to reject
 * @param {string} reason - Rejection reason
 */
export const rejectEvent = async (eventId, reason = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, reason }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error rejecting event:', error);
    throw error;
  }
};

/**
 * Lock event (any status -> CANCELLED)
 * @param {number} eventId - Event ID to lock
 * @param {string} reason - Lock reason
 */
export const lockEvent = async (eventId, reason = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, reason }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error locking event:', error);
    throw error;
  }
};

/**
 * Search events
 * @param {string} query - Search query (required)
 * @param {string} status - Filter by status (optional)
 */
export const searchAdminEvents = async (query, status = null) => {
  try {
    let url = `${API_BASE_URL}/events/search?query=${encodeURIComponent(query)}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

