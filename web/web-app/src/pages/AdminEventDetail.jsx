import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Tag, Ticket, Users,
  TrendingUp, Mail, Phone, Eye, Clock, Hash,
  CheckCircle, XCircle, AlertCircle, Link2, Globe,
  Lock, Building2, CreditCard, FileText, Copy,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

/* ── Mock event database ───────────────────────────────────── */
const EVENTS_DB = {
  0: {
    name: 'Concert 2024 - The Grand Stage',
    status: 'Pending',
    category: 'Âm nhạc',
    type: 'Offline',
    description: 'Đêm nhạc hội hoành tráng với sự tham gia của các nghệ sĩ hàng đầu Việt Nam. Chương trình hứa hẹn mang đến những trải nghiệm âm nhạc đặc sắc khó quên cho khán giả.',
    startDate: '15/3/2024 19:00',
    endDate: '15/3/2024 22:30',
    location: 'Nhà hát Hòa Bình, Q.10, TP.HCM',
    organizer: { name: 'Music Events Co.', email: 'contact@musiceventco.vn', phone: '0901 234 567', logo: null, description: 'Đơn vị tổ chức sự kiện âm nhạc hàng đầu Việt Nam với hơn 10 năm kinh nghiệm.', bankAccountName: 'Music Events Co.', bankAccountNumber: '9876543210', bankName: 'Vietcombank', bankBranch: 'TP.HCM', businessType: 'Event Organization', taxId: 'MST-0123456789', invoiceName: 'Công ty TNHH Music Events', invoiceAddress: '123 Đường Lê Lợi, Q.1, TP.HCM' },
    tickets: [
      { type: 'VIP', qty: 200, price: 1500000, sold: 0 },
      { type: 'Standard', qty: 1000, price: 500000, sold: 0 },
      { type: 'Học sinh/SV', qty: 500, price: 200000, sold: 0 },
    ],
    eventId: 'EVT-2024-001', createdDate: '10/2/2024', updatedDate: '12/2/2024', views: 1240,
    eventUrl: 'https://ticketbox.vn/events/concert-2024-grand-stage',
    customSlug: 'concert-2024-grand-stage',
    privacy: 'Public',
    accessNotes: 'Mở cho tất cả mọi người.',
  },
  1: {
    name: 'Tech Conference Vietnam',
    status: 'Approved',
    category: 'Công nghệ',
    type: 'Offline',
    description: 'Hội nghị công nghệ lớn nhất Việt Nam tập trung vào AI, Blockchain và IoT. Địa điểm quy tụ của các chuyên gia hàng đầu trong lĩnh vực công nghệ.',
    startDate: '5/4/2024 09:00',
    endDate: '5/4/2024 18:00',
    location: 'GEM Center, Q.4, TP.HCM',
    organizer: { name: 'Global Tech Events Inc.', email: 'info@globaltechevents.com', phone: '0912 345 678', logo: null, description: 'Leading organizer of international technology conferences and exhibitions since 2010.', bankAccountName: 'Global Tech Events, Inc.', bankAccountNumber: '1234567890', bankName: 'Techbank International', bankBranch: 'Downtown Branch', businessType: 'Event Organization', taxId: 'TIN-1234567890', invoiceName: 'Global Tech Events Inc.', invoiceAddress: '456 Innovation Street, Silicon Valley, CA 94025' },
    tickets: [
      { type: 'General', qty: 500, price: 0, sold: 350 },
      { type: 'VIP Networking', qty: 100, price: 0, sold: 80 },
    ],
    eventId: 'EVT-2024-002', createdDate: '8/2/2024', updatedDate: '10/2/2024', views: 3580,
    eventUrl: 'https://ticketbox.vn/events/tech-summit-2025-digital-revolution',
    customSlug: 'tech-summit-2025-digital-revolution',
    privacy: 'Public',
    accessNotes: 'Open to all interested technology professionals and enthusiasts.',
  },
  2: {
    name: 'Online Webinar - Digital Marketing',
    status: 'Approved',
    category: 'Marketing',
    type: 'Online',
    description: 'Học cách xây dựng chiến lược marketing số hiệu quả, tối ưu hóa SEO và chạy quảng cáo trên các nền tảng mạng xã hội.',
    startDate: '28/2/2024 14:00',
    endDate: '28/2/2024 17:00',
    location: 'Online (Zoom)',
    organizer: { name: 'Marketing Pro', email: 'hello@marketingpro.vn', phone: '0933 456 789', logo: null, description: 'Đơn vị cung cấp khóa học và webinar marketing số hàng đầu Việt Nam.', bankAccountName: 'Marketing Pro', bankAccountNumber: '5556667778', bankName: 'BIDV', bankBranch: 'Hà Nội', businessType: 'Education & Training', taxId: 'MST-3344556677', invoiceName: 'Công ty Marketing Pro VN', invoiceAddress: '789 Cầu Giấy, Hà Nội' },
    tickets: [
      { type: 'Standard', qty: 1000, price: 299000, sold: 724 },
      { type: 'VIP (có tài liệu)', qty: 200, price: 599000, sold: 156 },
    ],
    eventId: 'EVT-2024-003', createdDate: '5/2/2024', updatedDate: '6/2/2024', views: 5120,
    eventUrl: 'https://ticketbox.vn/events/webinar-digital-marketing-2024',
    customSlug: 'webinar-digital-marketing-2024',
    privacy: 'Public',
    accessNotes: 'Mở cho tất cả học viên đăng ký.',
  },
  3: {
    name: 'Art Exhibition 2024',
    status: 'Rejected',
    category: 'Nghệ thuật',
    type: 'Offline',
    description: 'Triển lãm nghệ thuật tập hợp hơn 50 họa sĩ Việt Nam và quốc tế với hơn 200 tác phẩm hội họa, điêu khắc và nghệ thuật số.',
    startDate: '1/3/2024 10:00',
    endDate: '7/3/2024 20:00',
    location: 'Bảo tàng Hội họa TP.HCM, Q.5, TP.HCM',
    organizer: { name: 'Gallery Vietnam', email: 'gallery@vietnam.art', phone: '0944 567 890', logo: null, description: 'Không gian nghệ thuật hiện đại kết nối nghệ sĩ và cộng đồng yêu nghệ thuật.', bankAccountName: 'Gallery Vietnam', bankAccountNumber: '1122334455', bankName: 'Techcombank', bankBranch: 'Quận 5, TP.HCM', businessType: 'Arts & Culture', taxId: 'MST-9988776655', invoiceName: 'Công ty Nghệ thuật Gallery VN', invoiceAddress: '22 Lê Duẩn, Q.1, TP.HCM' },
    tickets: [
      { type: 'Tham quan chuẩn', qty: 2000, price: 0, sold: 0 },
      { type: 'Tham quan VIP', qty: 100, price: 150000, sold: 0 },
    ],
    eventId: 'EVT-2024-004', createdDate: '3/2/2024', updatedDate: '4/2/2024', views: 890,
    eventUrl: 'https://ticketbox.vn/events/art-exhibition-2024',
    customSlug: 'art-exhibition-2024',
    privacy: 'Public',
    accessNotes: 'Mở cửa đón khách tham quan tự do.',
  },
  4: {
    name: 'Startup Meetup - Pitch Day',
    status: 'Rejected',
    category: 'Startup',
    type: 'Offline',
    description: 'Sự kiện kết nối các startup với nhà đầu tư. 20 startup sẽ có cơ hội trình bày ý tưởng trước hội đồng chuyên gia.',
    startDate: '25/2/2024 18:00',
    endDate: '25/2/2024 21:00',
    location: 'Công viên Phần mềm Quang Trung, Q.12, TP.HCM',
    organizer: { name: 'Startup Community', email: 'hello@startupcommunity.vn', phone: '0955 678 901', logo: null, description: 'Cộng đồng hỗ trợ khởi nghiệp và kết nối hệ sinh thái startup Việt Nam.', bankAccountName: 'Startup Community VN', bankAccountNumber: '9900112233', bankName: 'MB Bank', bankBranch: 'Q.12, TP.HCM', businessType: 'Community Organization', taxId: 'MST-1122334455', invoiceName: 'Hiệp hội Startup Community', invoiceAddress: '99 Quang Trung, Q.12, TP.HCM' },
    tickets: [
      { type: 'Khán giả thường', qty: 300, price: 0, sold: 0 },
      { type: 'Nhà đầu tư', qty: 50, price: 0, sold: 0 },
    ],
    eventId: 'EVT-2024-005', createdDate: '1/2/2024', updatedDate: '2/2/2024', views: 640,
    eventUrl: 'https://ticketbox.vn/events/startup-meetup-pitch-day-2024',
    customSlug: 'startup-meetup-pitch-day-2024',
    privacy: 'Private',
    accessNotes: 'Chỉ dành cho đại diện startup và nhà đầu tư đã đăng ký.',
  },
};

const formatPrice = (p) =>
  p === 0 ? 'Miễn phí' : p.toLocaleString('vi-VN') + ' ₫';

const STATUS_CFG = {
  Pending:  { label: 'Chờ duyệt',  dot: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400' },
  Approved: { label: 'Đã duyệt',   dot: 'bg-[#26bc71]', text: 'text-[#26bc71]',  badge: 'bg-[#26bc71]/10 text-[#26bc71]' },
  Rejected: { label: 'Bị từ chối', dot: 'bg-red-500',     text: 'text-red-400',    badge: 'bg-red-500/10 text-red-400' },
};

const Card = ({ title, children }) => (
  <div className="bg-[#222] rounded-xl border border-white/5 p-6">
    {title && <h3 className="text-white font-semibold text-sm mb-5 pb-3 border-b border-white/5">{title}</h3>}
    {children}
  </div>
);

const IconBox = ({ children }) => (
  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center shrink-0">{children}</div>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs mb-0.5">{label}</p>
    <p className="text-gray-200 text-sm">{value}</p>
  </div>
);

/* ── Page component ────────────────────────────────────────── */
const AdminEventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(() => EVENTS_DB[Number(id)] ?? EVENTS_DB[0]);
  const [copied, setCopied] = useState(false);

  const cfg          = STATUS_CFG[event.status] ?? STATUS_CFG.Pending;
  const totalTickets = event.tickets.reduce((s, t) => s + t.qty,          0);
  const totalSold    = event.tickets.reduce((s, t) => s + t.sold,         0);
  const totalRevenue = event.tickets.reduce((s, t) => s + t.price * t.sold, 0);
  const orgInitials  = event.organizer.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const approve = () => setEvent((p) => ({ ...p, status: 'Approved' }));
  const reject  = () => setEvent((p) => ({ ...p, status: 'Rejected' }));

  const handleCopy = () => {
    navigator.clipboard.writeText(event.eventUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">

        {/* Breadcrumb */}
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Quản lý sự kiện
        </Link>

        {/* Title row */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-3">{event.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={reject}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white text-sm font-medium transition-colors"
            >
              <XCircle size={16} /> Từ chối
            </button>
            <button
              onClick={approve}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors"
            >
              <CheckCircle size={16} /> Duyệt sự kiện
            </button>
          </div>
        </div>

        {/* Event banner */}
        <div className="w-full h-64 bg-[#222] rounded-xl border border-white/5 mb-8 flex flex-col items-center justify-center gap-3 overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-600">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm">Ảnh bìa sự kiện</p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-3 gap-6">

          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="col-span-2 space-y-6">

            {/* Basic info */}
            <Card title="Thông tin cơ bản">
              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-1">Tên sự kiện</p>
                <p className="text-gray-200 text-sm font-medium">{event.name}</p>
              </div>
              <div className="mb-5">
                <p className="text-gray-500 text-xs mb-1">Mô tả</p>
                <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">Danh mục</p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 text-xs">
                    <Tag size={11} /> {event.category}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">Hình thức</p>
                  {event.type === 'Offline'
                    ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs">Offline</span>
                    : <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">Online</span>
                  }
                </div>
              </div>
            </Card>

            {/* Time & Location */}
            <Card title="Thời gian & Địa điểm">
              <div className="grid grid-cols-2 gap-6 mb-5">
                <div className="flex gap-3">
                  <IconBox><Calendar size={14} className="text-[#26bc71]" /></IconBox>
                  <div>
                    <p className="text-gray-500 text-xs">Bắt đầu</p>
                    <p className="text-gray-200 text-sm mt-0.5">{event.startDate}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <IconBox><Clock size={14} className="text-gray-500" /></IconBox>
                  <div>
                    <p className="text-gray-500 text-xs">Kết thúc</p>
                    <p className="text-gray-200 text-sm mt-0.5">{event.endDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <IconBox><MapPin size={14} className="text-red-400" /></IconBox>
                <div>
                  <p className="text-gray-500 text-xs">Địa điểm</p>
                  <p className="text-gray-200 text-sm mt-0.5">{event.location}</p>
                </div>
              </div>
            </Card>

            {/* Tickets */}
            <Card title="Vé & Giá">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-gray-500 text-xs">
                      <th className="px-4 py-3 text-left font-medium rounded-l-lg">Loại vé</th>
                      <th className="px-4 py-3 text-left font-medium">Số lượng</th>
                      <th className="px-4 py-3 text-left font-medium">Giá</th>
                      <th className="px-4 py-3 text-left font-medium">Đã bán</th>
                      <th className="px-4 py-3 text-left font-medium rounded-r-lg">Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {event.tickets.map((t, i) => {
                      const pct = t.qty > 0 ? Math.round((t.sold / t.qty) * 100) : 0;
                      const barW = pct + '%';
                      return (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-4 text-white font-medium">{t.type}</td>
                          <td className="px-4 py-4 text-gray-400">{t.qty.toLocaleString()}</td>
                          <td className="px-4 py-4 text-[#26bc71] font-medium">{formatPrice(t.price)}</td>
                          <td className="px-4 py-4 text-gray-400">{t.sold.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-1.5 bg-[#26bc71] rounded-full" style={{ width: barW }} />
                              </div>
                              <span className="text-gray-500 text-xs w-7 text-right">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Stats */}
            <Card title="Thống kê">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1a1a1a] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket size={13} className="text-gray-500" />
                    <span className="text-gray-500 text-xs">Tổng vé</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{totalTickets.toLocaleString()}</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={13} className="text-gray-500" />
                    <span className="text-gray-500 text-xs">Đã bán</span>
                  </div>
                  <p className="text-[#26bc71] text-2xl font-bold">{totalSold.toLocaleString()}</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={13} className="text-gray-500" />
                    <span className="text-gray-500 text-xs">Doanh thu</span>
                  </div>
                  <p className="text-[#26bc71] text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <div className="space-y-6">

            {/* Organizer */}
            <Card title="Tổ chức bởi">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-[#26bc71] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {orgInitials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{event.organizer.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Người tổ chức</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Mail size={13} className="text-gray-600 shrink-0" />
                  <span className="text-gray-400 text-sm">{event.organizer.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={13} className="text-gray-600 shrink-0" />
                  <span className="text-gray-400 text-sm">{event.organizer.phone}</span>
                </div>
              </div>
            </Card>

            {/* Additional info */}
            <Card title="Thông tin bổ sung">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Hash size={11} className="text-gray-600" />
                    <span className="text-gray-500 text-xs">Mã sự kiện</span>
                  </div>
                  <p className="text-gray-300 text-sm font-mono pl-4">{event.eventId}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar size={11} className="text-gray-600" />
                    <span className="text-gray-500 text-xs">Ngày tạo</span>
                  </div>
                  <p className="text-gray-300 text-sm pl-4">{event.createdDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock size={11} className="text-gray-600" />
                    <span className="text-gray-500 text-xs">Cập nhật lần cuối</span>
                  </div>
                  <p className="text-gray-300 text-sm pl-4">{event.updatedDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Eye size={11} className="text-gray-600" />
                    <span className="text-gray-500 text-xs">Lượt xem</span>
                  </div>
                  <p className="text-gray-300 text-sm pl-4">{(event.views ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Links & Privacy */}
            <Card title="Links & Privacy">
              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">EVENT URL</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#1a1a1a] rounded-lg px-3 py-2 border border-white/5 overflow-hidden">
                      <p className="text-[#26bc71] text-xs truncate">{event.eventUrl}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#26bc71]/10 border border-[#26bc71]/20 text-[#26bc71] text-xs font-medium hover:bg-[#26bc71] hover:text-white transition-colors shrink-0"
                    >
                      <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <a
                      href={event.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] border border-white/5 text-gray-500 hover:text-white transition-colors shrink-0"
                    >
                      <Link2 size={13} />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">CUSTOM SLUG</p>
                  <div className="bg-[#1a1a1a] rounded-lg px-3 py-2 border border-white/5">
                    <p className="text-gray-300 text-sm">{event.customSlug}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">PRIVACY SETTINGS</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    event.privacy === 'Public'
                      ? 'bg-[#26bc71]/10 text-[#26bc71] border border-[#26bc71]/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {event.privacy === 'Public' ? <Globe size={11} /> : <Lock size={11} />}
                    {event.privacy === 'Public' ? 'Public – visible to everyone' : 'Private – invite only'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">ACCESS NOTES</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{event.accessNotes}</p>
                </div>
              </div>
            </Card>

            {/* Organizer Information */}
            <Card title="Organizer Information">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center shrink-0">
                    {event.organizer.logo
                      ? <img src={event.organizer.logo} alt="logo" className="w-full h-full object-cover rounded-xl" />
                      : <Building2 size={22} className="text-gray-600" />
                    }
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">ORGANIZATION NAME</p>
                    <p className="text-white text-sm font-semibold mt-0.5">{event.organizer.name}</p>
                    <p className="text-gray-500 text-xs mt-2">ORGANIZATION LOGO</p>
                    <p className="text-gray-500 text-xs">Logo uploaded and ready</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1.5">ORGANIZATION DESCRIPTION</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{event.organizer.description}</p>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card title="Payment Information">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={13} className="text-gray-500" />
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Banking Details</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="ACCOUNT NAME"   value={event.organizer.bankAccountName} />
                    <InfoRow label="ACCOUNT NUMBER" value={event.organizer.bankAccountNumber} />
                    <InfoRow label="BANK NAME"      value={event.organizer.bankName} />
                    <InfoRow label="BRANCH"         value={event.organizer.bankBranch} />
                  </div>
                </div>
                <div className="border-t border-white/5" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={13} className="text-gray-500" />
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Business Information</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="BUSINESS TYPE" value={event.organizer.businessType} />
                    <InfoRow label="TAX ID / TIN"  value={event.organizer.taxId} />
                  </div>
                </div>
                <div className="border-t border-white/5" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={13} className="text-gray-500" />
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Invoice Information</p>
                  </div>
                  <div className="space-y-3">
                    <InfoRow label="INVOICE NAME"    value={event.organizer.invoiceName} />
                    <InfoRow label="INVOICE ADDRESS" value={event.organizer.invoiceAddress} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick action reminder */}
            {event.status === 'Pending' && (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={15} className="text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 text-sm font-medium">Chờ phê duyệt</p>
                    <p className="text-yellow-500/70 text-xs mt-1">Sự kiện này đang chờ admin phê duyệt trước khi được đăng lên nền tảng.</p>
                  </div>
                </div>
              </div>
            )}
            {event.status === 'Rejected' && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-sm font-medium">Sự kiện bị từ chối</p>
                    <p className="text-red-400/60 text-xs mt-1">Sự kiện này đã bị từ chối. Nhấn Duyệt để phục hồi trạng thái.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEventDetail;