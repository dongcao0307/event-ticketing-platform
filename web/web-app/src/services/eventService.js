// src/services/eventService.js

const featuredEvents = [
  {
    id: 1,
    title: 'SUPER SHOW 10 – Super Junior',
    date: '24 tháng 02, 2026',
    location: 'Sân vận động Mỹ Đình',
    price: 'Từ 750.000đ',
    image:
      'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'HER Concert – Hòa nhạc lãng mạn',
    date: '07 tháng 02, 2026',
    location: 'Hội trường GV3',
    price: 'Từ 350.000đ',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
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
    id: 4,
    title: 'DÉ GARDEN Moss Frame Workshop',
    date: '19 tháng 02, 2026',
    location: 'Hà Nội',
    price: 'Từ 450.000đ',
    image:
      'https://images.unsplash.com/photo-1520975914767-4c01e147f37b?auto=format&fit=crop&w=1200&q=80',
    badge: '1',
  },
  {
    id: 5,
    title: 'DÉ GARDEN Terrarium Workshop',
    date: '13 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 445.000đ',
    image:
      'https://images.unsplash.com/photo-1573164574395-0566f5e9280a?auto=format&fit=crop&w=1200&q=80',
    badge: '2',
  },
  {
    id: 6,
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
    id: 7,
    title: 'SÂN KHẤU XÓM KỊCH: CĂN HỘ SỐ 13',
    date: '15 tháng 03, 2026',
    location: 'TP. Hồ Chí Minh',
    price: 'Từ 250.000đ',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 8,
    title: 'IN BÓNG LONG THÀNH - SILHOUETTE OF THANG LONG',
    date: '20 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 500.000đ',
    image:
      'https://images.unsplash.com/photo-1515169067865-5387b23d7e86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 9,
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
    id: 10,
    title: 'GAI HOME CONCERT',
    date: '26 tháng 04, 2026',
    location: 'Ocean Park',
    price: 'Từ 250.000đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  },
  {
    id: 11,
    title: 'ĐÀO HOA HẬU',
    date: '15 tháng 03, 2026',
    location: 'Nhà hát Bến Thành',
    price: 'Từ 350.000đ',
    image: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229',
  },
  {
    id: 12,
    title: 'Mr Siro Concert',
    date: '28 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 450.000đ',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
  },
  {
    id: 13,
    title: 'GAI HOME CONCERT',
    date: '26 tháng 04, 2026',
    location: 'Ocean Park',
    price: 'Từ 250.000đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  },
  {
    id: 14,
    title: 'ĐÀO HOA HẬU',
    date: '15 tháng 03, 2026',
    location: 'Nhà hát Bến Thành',
    price: 'Từ 350.000đ',
    image: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229',
  },
  {
    id: 15,
    title: 'Mr Siro Concert',
    date: '28 tháng 03, 2026',
    location: 'Hà Nội',
    price: 'Từ 450.000đ',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063',
  },
];

const weekendEvents = [
  {
    id: 16,
    title: 'B.DUCK CITYFUNS @VINCOM',
    date: '20 tháng 01, 2026',
    price: 'Từ 82.500đ',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
  },
];

const monthEvents = [
  {
    id: 17,
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

export const getFeaturedEvents = async () => simulateFetch(featuredEvents);
export const getTrendingEvents = async () => simulateFetch(trendingEvents);
export const getRecommendedEvents = async () => simulateFetch(recommendedEvents);
export const getResaleEvents = async () => simulateFetch(resaleEvents);
export const getWeekendEvents = async () => simulateFetch(weekendEvents);
export const getMonthEvents = async () => simulateFetch(monthEvents);
export const serviceFindEventById = async (eventId) => simulateFetch(
  featuredEvents.concat(trendingEvents).concat(recommendedEvents).concat(resaleEvents)
  .concat(weekendEvents).concat(monthEvents).find(e => e.id === eventId)
)

