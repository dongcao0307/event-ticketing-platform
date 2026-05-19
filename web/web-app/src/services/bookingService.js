import axios from 'axios';
import { get, request, getAccessToken } from './apiClient';

export const detailedEvents = [
  {
    id: 'featured-1',
    title: 'SUPER SHOW 10 – Super Junior',
    subtitle: 'Đêm nhạc huyền thoại trở lại',
    date: '24 tháng 02, 2026',
    location: 'Sân vận động Mỹ Đình',
    address: 'Đường Lê Đức Thọ, Mỹ Đình, Hà Nội',
    price: 'Từ 750.000đ',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Sân Khấu Thế Giới Trẻ',
    type: 'theater',
    category: 'Nhạc sống',
    description: 'SUPER SHOW 10 là đêm nhạc đặc biệt quy tụ toàn bộ thành viên Super Junior sau nhiều năm phục vụ nghĩa vụ quân sự. Đây là sự kiện không thể bỏ qua cho mọi ELF tại Việt Nam.',
    showtimes: [
      { id: 'st-1', label: '20:00 – 22:30', date: '24 Tháng 02, 2026' },
      { id: 'st-2', label: '15:00 – 17:30', date: '25 Tháng 02, 2026' },
    ],
    ticketZones: [
      { id: 'vip', label: 'VIP', color: '#f97316', price: 750000, rows: ['A','B','C','D'], seatsPerRow: 22, tag: 'Tốt nhất', tip: 'Hàng ghế A–D ngay sát sân khấu, tầm nhìn không bị cản, trải nghiệm âm thanh đỉnh cao.' },
      { id: 'thuong', label: 'VÉ THƯỜNG', color: '#3b82f6', price: 550000, rows: ['E','F','G','H','I','J'], seatsPerRow: 22, tag: 'Phổ biến', tip: 'Vị trí trung tâm, cân bằng giữa giá thành và tầm nhìn. Lựa chọn được nhiều khán giả yêu thích nhất.' },
      { id: 'tren-lau', label: 'VÉ THƯỜNG (PHIÊN LẦU)', color: '#0ea5e9', price: 350000, rows: ['K','L','M','N'], seatsPerRow: 22, tag: 'Tiết kiệm', tip: 'Góc nhìn tổng thể từ trên cao, không gian thoáng đãng. Phù hợp cho ngân sách tiết kiệm.' },
    ],
    occupiedSeats: ['A-3','A-4','A-5','B-7','B-8','C-10','C-11','C-12','D-1','D-2','E-15','E-16','F-3','G-8','H-5','H-6','I-12','J-18','K-2','L-9','M-4'],
  },
  {
    id: 'rec-1',
    title: 'SÂN KHẤU XÓM KỊCH: CĂN HỘ SỐ 13',
    subtitle: 'Vở kịch hài đặc sắc 2026',
    date: '15 tháng 03, 2026',
    location: 'Nhà Hát Bến Thành',
    address: '7 Lê Lai, Bến Thành, Quận 1, TP. HCM',
    price: 'Từ 250.000đ',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Xóm Kịch',
    type: 'theater',
    category: 'Sân khấu & Nghệ thuật',
    description: 'Vở kịch hài "Căn Hộ Số 13" với những tình huống dở khóc dở cười xoay quanh cuộc sống của các cư dân trong một tòa chung cư. Chương trình hứa hẹn mang đến những tràng cười bất tận.',
    showtimes: [
      { id: 'st-1', label: '19:30 – 21:30', date: '15 Tháng 03, 2026' },
      { id: 'st-2', label: '19:30 – 21:30', date: '16 Tháng 03, 2026' },
      { id: 'st-3', label: '15:00 – 17:00', date: '17 Tháng 03, 2026' },
    ],
    ticketZones: [
      { id: 'vip', label: 'VIP', color: '#f97316', price: 500000, rows: ['A','B','C'], seatsPerRow: 18, tag: 'Tốt nhất', tip: 'Hàng ghế đầu gần sân khấu nhất, trải nghiệm vở kịch sống động và rõ nét nhất.' },
      { id: 'thuong', label: 'VÉ THƯỜNG', color: '#3b82f6', price: 350000, rows: ['D','E','F','G','H'], seatsPerRow: 18, tag: 'Phổ biến', tip: 'Vị trí lý tưởng ở giữa khán phòng, tầm nhìn rộng và âm thanh cân bằng.' },
      { id: 'tren-lau', label: 'VÉ THƯỜNG (PHIÊN LẦU)', color: '#0ea5e9', price: 250000, rows: ['I','J','K'], seatsPerRow: 18, tag: 'Tiết kiệm', tip: 'Khu vực trên lầu, nhìn toàn bộ sân khấu từ trên cao, phù hợp cho ngân sách tiết kiệm.' },
    ],
    occupiedSeats: ['A-2','A-5','B-3','B-9','C-1','C-11','D-7','E-4','F-12','G-6','H-2','I-8','J-5','K-3'],
  },
  {
    id: 'w1',
    title: 'B.DUCK CITYFUNS @VINCOM CENTER LANDMARK 81',
    subtitle: 'Triển lãm vui chơi giải trí',
    date: '20 tháng 01, 2026',
    location: 'Vincom Center Landmark 81',
    address: '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP. HCM',
    price: 'Từ 82.500đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Vincom Retail',
    type: 'tham-quan',
    category: 'Tham quan & Trải nghiệm',
    description: 'B.DUCK CITYFUNS là triển lãm vui chơi theo chủ đề chú vịt vàng dễ thương B.Duck, với nhiều khu vực check-in, trò chơi và hoạt động tương tác hấp dẫn cho cả gia đình.',
    showtimes: [
      { id: 'st-1', label: '09:00 – 22:00', date: '20 Tháng 01, 2026' },
      { id: 'st-2', label: '09:00 – 22:00', date: '21 Tháng 01, 2026' },
    ],
    ticketTypes: [
      {
        id: 'tt-1',
        label: '[VÉ LẺ] Vé chơi máy trò chơi',
        price: 82500,
        description: 'Vé 4 lần chơi: chứa loại bao gồm các trò chơi bao gồm gấu thú và Bootgame.',
      },
      {
        id: 'tt-2',
        label: '[VÉ COMBO 2] Vé chơi máy trò chơi',
        price: 154000,
        description: 'Vé combo 2 lần: 1 lần mỗi 2 máy trò chơi bao gồm gấu thú và Bootgame.',
      },
      {
        id: 'tt-3',
        label: '[VÉ COMBO 4] Vé chơi máy trò chơi',
        price: 495000,
        description: 'Vé combo 4 lần: 1 lần mỗi 4 máy trò chơi bao gồm gấu thú và Bootgame.',
      },
      {
        id: 'tt-4',
        label: '[COMBO] Vé chơi Booth Game – Gian hàng trò chơi',
        price: 319000,
        description: 'Được chọn 3 Booth game bất kỳ trong 5 Bootgame.',
      },
    ],
  },
  {
    id: 'trend-1',
    title: 'DÉ GARDEN Moss Frame Workshop',
    subtitle: 'Workshop tranh rêu tự nhiên',
    date: '19 tháng 02, 2026',
    location: 'Dé Garden Studio',
    address: '12 Ngõ Thổ Quan, Đống Đa, Hà Nội',
    price: 'Từ 450.000đ',
    image: 'https://images.unsplash.com/photo-1520975914767-4c01e147f37b?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Dé Garden',
    type: 'tham-quan',
    category: 'Tham quan & Trải nghiệm',
    description: 'Workshop làm tranh rêu tự nhiên theo phong cách Nhật Bản. Bạn sẽ được tự tay tạo ra một bức tranh rêu độc đáo dưới sự hướng dẫn của các nghệ nhân chuyên nghiệp.',
    showtimes: [
      { id: 'st-1', label: '09:00 – 12:00', date: '19 Tháng 02, 2026' },
      { id: 'st-2', label: '14:00 – 17:00', date: '19 Tháng 02, 2026' },
    ],
    ticketTypes: [
      {
        id: 'tt-1',
        label: 'Vé tham gia Workshop (1 người)',
        price: 450000,
        description: 'Bao gồm vật liệu, hướng dẫn và khung tranh hoàn chỉnh mang về.',
      },
      {
        id: 'tt-2',
        label: 'Vé tham gia Workshop (2 người)',
        price: 820000,
        description: 'Ưu đãi combo 2 người, bao gồm đầy đủ vật liệu cho 2 người.',
      },
    ],
  },
];

export const relatedEvents = [
  {
    id: 'featured-1',
    title: 'SUPER SHOW 10 – Super Junior',
    price: 'Từ 750.000đ',
    date: '24 tháng 01, 2026',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec-1',
    title: 'SÂN KHẤU XÓM KỊCH: CĂN HỘ SỐ 13',
    price: 'Từ 250.000đ',
    date: '15 tháng 03, 2026',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'w1',
    title: 'B.DUCK CITYFUNS @VINCOM CENTER LANDMARK 81',
    price: 'Từ 82.500đ',
    date: '20 tháng 01, 2026',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'trend-1',
    title: 'DÉ GARDEN Moss Frame Workshop',
    price: 'Từ 450.000đ',
    date: '19 tháng 02, 2026',
    image: 'https://images.unsplash.com/photo-1520975914767-4c01e147f37b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rel-5',
    title: 'HER Concert – Hòa nhạc lãng mạn',
    price: 'Từ 350.000đ',
    date: '07 tháng 02, 2026',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rel-6',
    title: 'ART WORKSHOP "FRENCH LEMON MINI TARTE"',
    price: 'Từ 390.000đ',
    date: '13 tháng 03, 2026',
    image: 'https://images.unsplash.com/photo-1558021212-51b6ec46ff44?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rel-7',
    title: 'IN BÓNG LONG THÀNH – SILHOUETTE OF THANG LONG',
    price: 'Từ 500.000đ',
    date: '20 tháng 03, 2026',
    image: 'https://images.unsplash.com/photo-1515169067865-5387b23d7e86?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rel-8',
    title: 'CHƯƠNG TRÌNH STARTUP STREET 2026',
    price: 'Từ 199.000đ',
    date: '28 tháng 03, 2026',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
  },
];

const resolveOrganizerId = () => localStorage.getItem('userId') || '1';

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const formatDateLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTimeLabel = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const buildTimeRange = (startTime, endTime) => {
  const startLabel = formatTimeLabel(startTime);
  const endLabel = formatTimeLabel(endTime);
  if (!startLabel && !endLabel) return '';
  if (!endLabel) return startLabel;
  return `${startLabel} - ${endLabel}`;
};

const normalizeTicketType = (ticket) => ({
  id: String(ticket.id),
  label: ticket.name || ticket.label || '',
  name: ticket.name || ticket.label || '',
  price: toNumber(ticket.price),
  totalQuantity: ticket.totalQuantity,
  maxTicketsPerUser: ticket.maxTicketsPerUser,
  performanceId: ticket.performanceId != null ? String(ticket.performanceId) : undefined,
  description: ticket.description,
});

const normalizePerformance = (performance) => {
  const tickets = Array.isArray(performance.tickets)
    ? performance.tickets.map(normalizeTicketType)
    : [];
  return {
    id: String(performance.id),
    startTime: performance.startTime,
    endTime: performance.endTime,
    label: buildTimeRange(performance.startTime, performance.endTime),
    date: formatDateLabel(performance.startTime),
    totalCapacity: performance.totalCapacity,
    availableCapacity: performance.availableCapacity,
    status: performance.status,
    venue: performance.venue,
    tickets,
  };
};

const buildMockPerformances = (mockEvent) => {
  if (!mockEvent) return [];
  const baseTickets = Array.isArray(mockEvent.ticketTypes)
    ? mockEvent.ticketTypes.map(normalizeTicketType)
    : [];
  const showtimes = Array.isArray(mockEvent.showtimes) && mockEvent.showtimes.length
    ? mockEvent.showtimes
    : [{ id: 'st-1', label: mockEvent.date || '', date: mockEvent.date || '' }];
  return showtimes.map((showtime, index) => ({
    id: showtime.id || `perf-${index + 1}`,
    label: showtime.label || '',
    date: showtime.date || mockEvent.date || '',
    startTime: null,
    endTime: null,
    status: 'OPEN',
    venue: mockEvent.location ? { name: mockEvent.location } : null,
    tickets: baseTickets.length
      ? baseTickets
      : (mockEvent.ticketZones || []).map((zone, zoneIndex) => ({
        id: zone.id || `zone-${zoneIndex}`,
        label: zone.label || 'Vé',
        name: zone.label || 'Vé',
        price: toNumber(zone.price),
      })),
  }));
};

const buildZonesFromSeatMap = (seatMapConfig, tickets) => {
  if (!seatMapConfig) return [];
  let parsed = null;
  try {
    parsed = JSON.parse(seatMapConfig);
  } catch {
    parsed = null;
  }
  const zoneLabels = Array.isArray(parsed?.zones) ? parsed.zones : [];
  if (!zoneLabels.length) return [];

  const colors = ['#f97316', '#3b82f6', '#0ea5e9', '#22c55e', '#a855f7', '#ef4444'];
  const rowsPerZone = 4;
  const seatsPerRow = 22;
  const fallbackPrice = tickets?.[0]?.price || 0;
  let rowIndex = 0;

  return zoneLabels.map((label, index) => {
    const rows = Array.from({ length: rowsPerZone }, (_, i) => String.fromCharCode(65 + rowIndex + i));
    rowIndex += rowsPerZone;
    const match = tickets?.find((t) => (t.name || t.label || '').toLowerCase().includes(String(label).toLowerCase()));
    return {
      id: `zone-${index}`,
      label,
      color: colors[index % colors.length],
      price: match?.price ?? fallbackPrice,
      rows,
      seatsPerRow,
    };
  });
};

const normalizeDetailedEvent = (eventData, performancesRaw, fallbackEvent) => {
  if (!eventData && !fallbackEvent) return null;

  const baseEvent = eventData
    ? {
        id: String(eventData.id),
        title: eventData.title,
        description: eventData.description,
        image: eventData.imageUrl,
        imageUrl: eventData.imageUrl,
        category: eventData.category,
        location: eventData.location || eventData.city || '',
        city: eventData.city || '',
        date: eventData.formattedDate || formatDateLabel(eventData.startTime),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        minPrice: eventData.minPrice,
        maxPrice: eventData.maxPrice,
        priceDisplay: eventData.priceDisplay,
        totalTickets: eventData.totalTickets,
        availableTickets: eventData.availableTickets,
        status: eventData.status,
        organizerName: eventData.organizerName,
        organizerLogo: eventData.organizerLogo,
        isFeatured: eventData.isFeatured,
        viewCount: eventData.viewCount,
      }
    : {
        id: String(fallbackEvent.id),
        title: fallbackEvent.title,
        description: fallbackEvent.description,
        image: fallbackEvent.image,
        imageUrl: fallbackEvent.image,
        category: fallbackEvent.category,
        location: fallbackEvent.location,
        address: fallbackEvent.address,
        date: fallbackEvent.date,
        priceDisplay: fallbackEvent.price,
        organizerName: fallbackEvent.organizer,
      };

  let performances = Array.isArray(performancesRaw) && performancesRaw.length
    ? performancesRaw.map(normalizePerformance)
    : buildMockPerformances(fallbackEvent);

  if (!performances.length && eventData && (eventData.startTime || eventData.endTime)) {
    performances = [
      {
        id: 'default',
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        label: buildTimeRange(eventData.startTime, eventData.endTime),
        date: formatDateLabel(eventData.startTime),
        totalCapacity: eventData.totalTickets,
        availableCapacity: eventData.availableTickets,
        status: eventData.status || 'OPEN',
        venue: null,
        tickets: [],
      },
    ];
  }

  const showtimes = performances.map((perf) => ({
    id: perf.id,
    label: perf.label || buildTimeRange(perf.startTime, perf.endTime),
    date: perf.date || formatDateLabel(perf.startTime),
    startTime: perf.startTime,
    endTime: perf.endTime,
  }));

  const ticketTypes = performances.flatMap((perf) =>
    (perf.tickets || []).map((ticket) => ({
      ...ticket,
      performanceId: perf.id,
    }))
  );

  const primaryVenue = performances[0]?.venue;
  const ticketZones = fallbackEvent?.ticketZones
    || buildZonesFromSeatMap(primaryVenue?.seatMapConfig, performances[0]?.tickets || []);

  const address = baseEvent.address || primaryVenue?.address;

  return {
    ...baseEvent,
    address,
    performances,
    showtimes,
    ticketTypes,
    ticketZones,
    occupiedSeats: fallbackEvent?.occupiedSeats || [],
    type: (baseEvent.category || '').toUpperCase() === 'THEATER' ? 'theater' : 'visit',
  };
};

export const getDetailedEventById = async (id) => {
  let eventData = null;
  let performancesRaw = [];

  try {
    const res = await get(`/events/${id}`);
    eventData = res?.data ?? null;
  } catch (err) {
    console.warn('[BookingService] Cannot load event detail from gateway:', err.message);
  }

  try {
    const perfRes = await request(`/organizer/events/${id}/performances`, {
      method: 'GET',
      headers: { 'X-User-Id': resolveOrganizerId() },
    });
    performancesRaw = Array.isArray(perfRes) ? perfRes : (perfRes?.data || []);
  } catch (err) {
    console.warn('[BookingService] Cannot load performances from gateway:', err.message);
  }

  if (!eventData) {
    const fallbackEvent = detailedEvents.find((e) => String(e.id) === String(id)) || null;
    return normalizeDetailedEvent(null, [], fallbackEvent);
  }

  return normalizeDetailedEvent(eventData, performancesRaw, null);
};

const BOOKING_SERVICE_BASE_URL = 'http://localhost:8080/api/bookings';
const TICKET_SERVICE_BASE_URL = 'http://localhost:8080/api/tickets';

const toStableMockLong = (rawId, prefix) => {
  const safeId = String(rawId ?? '').trim();
  const digits = safeId.replace(/\D/g, '');

  if (digits) {
    const parsed = Number.parseInt(digits, 10);
    if (Number.isFinite(parsed)) {
      return prefix + parsed;
    }
  }

  let hash = 0;
  for (let i = 0; i < safeId.length; i += 1) {
    hash = (hash * 31 + safeId.charCodeAt(i)) % 1_000_000_000;
  }
  return prefix + hash;
};

export const mapTicketZoneIdToLong = (zoneId) => toStableMockLong(zoneId, 5_000_000_000);
export const mapTicketTypeIdToLong = (ticketTypeId) => toStableMockLong(ticketTypeId, 6_000_000_000);

const unwrapApiResponseBody = (response) => response?.data?.body;

export const serviceCreateBooking = async (payload) => {
  const response = await axios.post(BOOKING_SERVICE_BASE_URL, payload);
  return unwrapApiResponseBody(response);
};

export const serviceAddBookingItems = async (bookingId, payload) => {
  const response = await axios.post(`${BOOKING_SERVICE_BASE_URL}/${bookingId}/items`, payload);
  return unwrapApiResponseBody(response);
};

export const serviceGetBookingById = async (bookingId) => {
  const response = await axios.get(`${BOOKING_SERVICE_BASE_URL}/${bookingId}`);
  return unwrapApiResponseBody(response);
};

export const serviceGetBookingsByUser = async (userId) => {
  const response = await axios.get(`${BOOKING_SERVICE_BASE_URL}/user/${userId}`);
  return response?.data?.data || response?.data?.body || response?.data;
};

export const serviceCreateTickets = async (payload) => {
  const response = await axios.post(`${TICKET_SERVICE_BASE_URL}/bulk`, payload);
  return unwrapApiResponseBody(response);
};

export const submitBooking = async (bookingData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId: 'TB' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        ...bookingData,
      });
    }, 1000);
  });
};

// ====== THÊM 2 HÀM NÀY VÀO CUỐI FILE CỦA HẬU ======

export const serviceSearchBookingsByAdmin = async (page = 0, size = 8, status, bookingId) => {
  const token = getAccessToken(); // Sửa lại dòng này
  const params = { page, size };
  
  if (status) params.status = status;
  if (bookingId && !isNaN(bookingId)) params.bookingId = bookingId;

  const response = await axios.get(`${BOOKING_SERVICE_BASE_URL}/admin/search`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return unwrapApiResponseBody(response);
};

export const serviceUpdateBookingStatusAdmin = async (bookingId, status) => {
  const token = getAccessToken(); // Sửa lại dòng này
  const response = await axios.put(`${BOOKING_SERVICE_BASE_URL}/${bookingId}/status`, 
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return unwrapApiResponseBody(response);
};