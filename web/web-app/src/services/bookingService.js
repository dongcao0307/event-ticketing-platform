import axios from 'axios';

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

export const getDetailedEventById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = detailedEvents.find((e) => e.id === id) || null;
      resolve(event);
    }, 300);
  });
};

const ORDER_SERVICE_BASE_URL = 'http://localhost:8090/api/orders';

export const mapTicketZoneIdToLong = () => 1;
export const mapTicketTypeIdToLong = () => 1;

const unwrapApiResponseBody = (response) => response?.data?.body;

export const serviceCreateOrder = async (payload) => {
  const response = await axios.post(ORDER_SERVICE_BASE_URL, payload);
  return unwrapApiResponseBody(response);
};

export const serviceAddOrderItems = async (orderId, payload) => {
  const response = await axios.post(`${ORDER_SERVICE_BASE_URL}/${orderId}/items`, payload);
  return unwrapApiResponseBody(response);
};

export const serviceGetOrderById = async (orderId) => {
  const response = await axios.get(`${ORDER_SERVICE_BASE_URL}/${orderId}`);
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
