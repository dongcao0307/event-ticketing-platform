// src/services/ticketService.js

const ticketsData = [
  {
    id: 1,
    title: "[Hà Nội] Triển lãm & Lễ hội Quốc tế Thú cưng Việt Nam - InterPet Expo",
    status: "success",
    isElectronic: true,
    order: "808861962",
    startDate: "2026-04-17",
    time: "09:00, 17 Thg 04, 2026 - 06:30, 19 Thg 04, 2026",
    location: "Cung Triển lãm xây dựng Hà Nội - NECC, Từ Liêm, Hà Nội",
  },
  {
    id: 2,
    title: "SUPER SHOW 10 - Super Junior",
    status: "processing",
    order: "808861963",
    startDate: "2026-05-12",
    time: "19:00, 12 Thg 05 2026",
    location: "TP.HCM",
  },
  {
    id: 3,
    title: "Workshop Handmade",
    status: "cancel",
    order: "808861964",
    startDate: "2026-02-25",
    time: "10:00, 25 Thg 02 2026",
    location: "Hà Nội",
  },
  {
    id: 4,
    title: "Terrarium Workshop",
    status: "success",
    order: "808861965",
    startDate: "2026-06-13",
    time: "13:00, 13 Thg 06 2026",
    location: "Đà Lạt",
  },
  {
    id: 5,
    title: "Terrarium Workshop",
    status: "success",
    order: "808861965",
    startDate: "2026-06-13",
    time: "13:00, 13 Thg 06 2026",
    location: "Đà Lạt",
  },
];

const ticketMocks = [
  {
    id: 1,
    title: "[Hà Nội] Triển lãm & Lễ hội Quốc tế Thú cưng Việt Nam - InterPet Expo",
    image:
      "https://salt.tkbcdn.com/ts/ds/c2/36/80/9151186aabf00818d0af4eb19d4b1b25.jpg",
    type: "Tham quan tại triển lãm",
    start: "09:00, 17 Thg 04, 2026",
    end: "06:30, 19 Thg 04, 2026",
    orderCode: "808861962",
    orderDate: "21/01/2026",
    payment: "Free",
    status: "Thành công",
    buyer: {
      name: "Bui Quang Minh",
      email: "a@a.a",
    },
    tickets: [
      {
        name: "Tham quan tại triển lãm",
        quantity: 1,
        price: 0,
      },
    ],
  },
  {
    id: 2,
    title: "SUPER SHOW 10 - Super Junior",
    image:
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77",
    type: "Hoạt động âm nhạc",
    start: "19:00, 12 Thg 05 2026",
    end: "22:00, 12 Thg 05 2026",
    orderCode: "808861963",
    orderDate: "22/01/2026",
    payment: "450.000đ",
    status: "Đang xử lý",
    buyer: {
      name: "Bui Quang Minh",
      email: "a@a.a",
    },
    tickets: [
      {
        name: "Ghế VIP",
        quantity: 2,
        price: 750000,
      },
    ],
  },
  {
    id: 3,
    title: "Workshop Handmade",
    image:
      "https://images.unsplash.com/photo-1542144582-dc4f5f8b5a50",
    type: "Workshop",
    start: "10:00, 25 Thg 02 2026",
    end: "15:00, 25 Thg 02 2026",
    orderCode: "808861964",
    orderDate: "23/01/2026",
    payment: "199.000đ",
    status: "Đã hủy",
    buyer: {
      name: "Bui Quang Minh",
      email: "a@a.a",
    },
    tickets: [
      {
        name: "Vé workshop",
        quantity: 1,
        price: 199000,
      },
    ],
  },
  {
    id: 4,
    title: "Terrarium Workshop",
    image:
      "https://images.unsplash.com/photo-1573164574395-0566f5e9280a",
    type: "Workshop",
    start: "13:00, 13 Thg 06 2026",
    end: "17:00, 13 Thg 06 2026",
    orderCode: "808861965",
    orderDate: "24/01/2026",
    payment: "445.000đ",
    status: "Thành công",
    buyer: {
      name: "Bui Quang Minh",
      email: "a@a.a",
    },
    tickets: [
      {
        name: "Vé workshop terrarium",
        quantity: 1,
        price: 445000,
      },
    ],
  },
  {
    id: 5,
    title: "Terrarium Workshop",
    image:
      "https://images.unsplash.com/photo-1558021212-51b6ec46ff44",
    type: "Workshop",
    start: "13:00, 13 Thg 06 2026",
    end: "17:00, 13 Thg 06 2026",
    orderCode: "808861966",
    orderDate: "24/01/2026",
    payment: "445.000đ",
    status: "Thành công",
    buyer: {
      name: "Bui Quang Minh",
      email: "a@a.a",
    },
    tickets: [
      {
        name: "Vé workshop terrarium",
        quantity: 2,
        price: 890000,
      },
    ],
  },
];

const simulateFetch = (data, delay = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay);
  });

export const getTickets = async () => simulateFetch(ticketsData);
export const getTicketById = async (id) => {
  const ticket = ticketMocks.find((t) => t.id === Number(id));
  return simulateFetch(ticket || ticketMocks[0]);
};
export const getTicketDetail = async () => simulateFetch(ticketMocks[0]);
