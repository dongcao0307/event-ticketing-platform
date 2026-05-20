import React, { useState, useMemo } from 'react';
import {
  Search, Download, TrendingUp, ShoppingBag,
  Clock, CheckCircle, XCircle, Eye, RefreshCw,
  ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import OrderDetailModal from '../components/OrderDetailModal';

/* ── mock data ───────────────────────────────────────────────── */
const ALL_ORDERS = [
  { id: '#TB-8942', customer: { name: 'Nguyễn Văn An',   initials: 'NA', color: '#0d9488' }, event: { name: 'Midnight Jazz Festival',       sub: 'Âm nhạc · Biểu diễn trực tiếp' }, tickets: 2, total: 240000,   status: 'SUCCESS',   date: '12/03/2024' },
  { id: '#TB-8939', customer: { name: 'Trần Thị Kim',    initials: 'TK', color: '#059669' }, event: { name: 'Tech Conference Vietnam',       sub: 'Hội nghị · Công nghệ' },           tickets: 1, total: 0,        status: 'PENDING',   date: '12/03/2024' },
  { id: '#TB-8938', customer: { name: 'Lê Minh Quân',   initials: 'LQ', color: '#0e7490' }, event: { name: 'Champions League Final',        sub: 'Thể thao · Sân vận động' },        tickets: 4, total: 850000,   status: 'CANCELLED', date: '11/03/2024' },
  { id: '#TB-8935', customer: { name: 'Phạm Thùy Linh', initials: 'PL', color: '#065f46' }, event: { name: 'Digital Marketing Webinar',     sub: 'Giáo dục · Trực tuyến' },         tickets: 2, total: 598000,   status: 'SUCCESS',   date: '11/03/2024' },
  { id: '#TB-8930', customer: { name: 'Hoàng Đức Nam',  initials: 'HN', color: '#7c3aed' }, event: { name: 'Concert 2024 - The Grand Stage', sub: 'Âm nhạc · Concert' },            tickets: 1, total: 500000,   status: 'SUCCESS',   date: '10/03/2024' },
  { id: '#TB-8928', customer: { name: 'Vũ Ngọc Bảo',   initials: 'VB', color: '#b45309' }, event: { name: 'Startup Meetup - Pitch Day',    sub: 'Kinh doanh · Networking' },        tickets: 1, total: 0,        status: 'SUCCESS',   date: '10/03/2024' },
  { id: '#TB-8925', customer: { name: 'Đặng Thị Hoa',  initials: 'DH', color: '#be185d' }, event: { name: 'Art Exhibition 2024',          sub: 'Nghệ thuật · Triển lãm' },         tickets: 2, total: 150000,   status: 'PENDING',   date: '09/03/2024' },
  { id: '#TB-8920', customer: { name: 'Bùi Thanh Tùng', initials: 'BT', color: '#0c4a6e' }, event: { name: 'Tech Conference Vietnam',      sub: 'Hội nghị · Công nghệ' },           tickets: 1, total: 0,        status: 'CANCELLED', date: '09/03/2024' },
  { id: '#TB-8918', customer: { name: 'Cao Thị Mai',    initials: 'CM', color: '#4d7c0f' }, event: { name: 'Digital Marketing Webinar',    sub: 'Giáo dục · Trực tuyến' },         tickets: 3, total: 897000,   status: 'SUCCESS',   date: '08/03/2024' },
  { id: '#TB-8915', customer: { name: 'Ngô Văn Phúc',  initials: 'NP', color: '#9a3412' }, event: { name: 'Midnight Jazz Festival',       sub: 'Âm nhạc · Biểu diễn trực tiếp' }, tickets: 2, total: 240000,   status: 'SUCCESS',   date: '08/03/2024' },
  { id: '#TB-8910', customer: { name: 'Lý Thị Thanh',  initials: 'LT', color: '#1e3a5f' }, event: { name: 'Concert 2024 - The Grand Stage', sub: 'Âm nhạc · Concert' },            tickets: 1, total: 1500000, status: 'PENDING',   date: '07/03/2024' },
  { id: '#TB-8905', customer: { name: 'Đinh Hải Long',  initials: 'DL', color: '#374151' }, event: { name: 'Art Exhibition 2024',         sub: 'Nghệ thuật · Triển lãm' },         tickets: 2, total: 0,        status: 'SUCCESS',   date: '07/03/2024' },
];

const STATUS_CFG = {
  SUCCESS:   { label: 'Thành công', badge: 'bg-[#26bc71]/10 text-[#26bc71] border-[#26bc71]/20',   dot: 'bg-[#26bc71]',   icon: CheckCircle },
  PENDING:   { label: 'Chờ xử lý', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400',  icon: Clock        },
  CANCELLED: { label: 'Đã huỷ',    badge: 'bg-red-500/10 text-red-400 border-red-500/20',          dot: 'bg-red-400',     icon: XCircle      },
};

const PAGE_SIZE = 8;

const POPULAR_CATS = [
  { label: 'Âm nhạc',    pct: 42, color: '#26bc71'  },
  { label: 'Thể thao',   pct: 28, color: '#3b82f6'  },
  { label: 'Công nghệ',  pct: 18, color: '#8b5cf6'  },
  { label: 'Nghệ thuật', pct: 12, color: '#f59e0b'  },
];

/* ── sub-components ─────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#222] rounded-xl border border-white/5 p-6 ${className}`}>{children}</div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ── page ────────────────────────────────────────────────────── */
const AdminOrders = () => {
  const [orders,     setOrders]     = useState(ALL_ORDERS);
  const [search,     setSearch]     = useState('');
  const [statusTab,  setStatusTab]  = useState('ALL');
  const [page,       setPage]       = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusTab !== 'ALL') list = list.filter((o) => o.status === statusTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.event.name.toLowerCase().includes(q),
      );
    }
    return list;
  }, [orders, search, statusTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalRevenue  = orders.filter((o) => o.status === 'SUCCESS').reduce((s, o) => s + o.total, 0);
  const pendingCount  = orders.filter((o) => o.status === 'PENDING').length;

  const handleTab = (t) => { setStatusTab(t); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const TABS = [
    { key: 'ALL',       label: 'Tất cả' },
    { key: 'SUCCESS',   label: 'Thành công' },
    { key: 'PENDING',   label: 'Chờ xử lý' },
    { key: 'CANCELLED', label: 'Đã huỷ' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-1.5">Quản lý đơn hàng</h2>
            <p className="text-gray-500 text-sm">Theo dõi và xử lý toàn bộ giao dịch trên nền tảng</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors">
            <Download size={15} /> Xuất CSV
          </button>
        </div>

        {/* ── Stat cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#26bc71] flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-[#26bc71]/10 text-[#26bc71]">
                <TrendingUp size={11} /> +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{orders.length.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">Tổng đơn hàng</p>
            <p className="text-gray-600 text-xs mt-1">Tích lũy toàn thời gian</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-600 flex items-center justify-center">
                <Clock size={18} className="text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                Cần xử lý
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{pendingCount}</p>
            <p className="text-gray-500 text-xs">Đơn chờ xử lý</p>
            <p className="text-gray-600 text-xs mt-1">Cần xác nhận hoặc từ chối</p>
          </Card>

          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                Lịch sử 30 ngày
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {totalRevenue.toLocaleString('vi-VN')} ₫
            </p>
            <p className="text-gray-500 text-xs">Doanh thu thành công</p>
            <p className="text-gray-600 text-xs mt-1">Từ các đơn đã hoàn thành</p>
          </Card>
        </div>

        {/* ── Order table ────────────────────────────────────── */}
        <div className="bg-[#222] rounded-xl border border-white/5 mb-6">

          {/* Table header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => handleTab(t.key)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      statusTab === t.key
                        ? 'bg-[#26bc71] text-white'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {t.label}
                    {t.key === 'PENDING' && pendingCount > 0 && (
                      <span className="ml-1.5 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    value={search}
                    onChange={handleSearch}
                    placeholder="Tìm đơn hàng..."
                    className="bg-[#1a1a1a] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#26bc71]/40 w-56 transition-colors"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/5 text-gray-500 hover:text-white text-xs transition-colors">
                  <RefreshCw size={13} /> Làm mới
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-500 text-xs">
                  <th className="px-6 py-3 text-left font-medium">MÃ ĐƠN</th>
                  <th className="px-6 py-3 text-left font-medium">KHÁCH HÀNG</th>
                  <th className="px-6 py-3 text-left font-medium">SỰ KIỆN</th>
                  <th className="px-6 py-3 text-left font-medium">VÉ</th>
                  <th className="px-6 py-3 text-left font-medium">TỔNG TIỀN</th>
                  <th className="px-6 py-3 text-left font-medium">NGÀY</th>
                  <th className="px-6 py-3 text-left font-medium">TRẠNG THÁI</th>
                  <th className="px-6 py-3 text-left font-medium">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-600 text-sm">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  paged.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono text-[#26bc71] text-xs font-semibold">{o.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: o.customer.color }}
                          >
                            {o.customer.initials}
                          </div>
                          <span className="text-gray-200 text-sm">{o.customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        <p className="text-gray-200 text-sm truncate">{o.event.name}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{o.event.sub}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{o.tickets} vé</td>
                      <td className="px-6 py-4 text-white font-semibold text-sm">
                        {o.total === 0
                          ? <span className="text-[#26bc71]">Miễn phí</span>
                          : o.total.toLocaleString('vi-VN') + ' ₫'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{o.date}</td>
                      <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-[#26bc71] text-xs transition-colors"
                        >
                          <Eye size={13} /> Xem
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-gray-600 text-xs">
              Hiển thị {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} / {filtered.length} đơn hàng
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === '...' ? (
                    <span key={`e${i}`} className="w-8 text-center text-gray-600 text-xs">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        n === safePage
                          ? 'bg-[#26bc71] text-white'
                          : 'bg-[#1a1a1a] text-gray-500 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom row ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-6">

          {/* Automated payouts */}
          <Card className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#26bc71]/10 border border-[#26bc71]/20 flex items-center justify-center shrink-0">
              <Zap size={18} className="text-[#26bc71]" />
            </div>
            <div>
              <p className="text-[#26bc71] font-semibold text-sm mb-1">Thanh toán tự động đang hoạt động</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Hệ thống tự động đối soát doanh thu và chuyển khoản cho ban tổ chức sau 3 ngày làm việc kể từ ngày sự kiện kết thúc. Tất cả giao dịch được mã hóa và bảo mật.
              </p>
              <button className="mt-3 text-[#26bc71] text-xs hover:underline">Xem cấu hình →</button>
            </div>
          </Card>

          {/* Popular categories */}
          <Card>
            <h3 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/5">
              Danh mục phổ biến
            </h3>
            <div className="space-y-3">
              {POPULAR_CATS.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs w-20 shrink-0">{c.label}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${c.pct}%`, background: c.color }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs w-8 text-right shrink-0">{c.pct}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </main>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default AdminOrders;
