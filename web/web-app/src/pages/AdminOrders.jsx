import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import OrderDetailModal from "../components/OrderDetailModal";

// 🚨 Đảm bảo đường dẫn import này đúng với cấu trúc thư mục của Hậu
import { serviceSearchBookingsByAdmin } from "../services/bookingService";

const STATUS_CFG = {
  SUCCESS: {
    label: "Thành công",
    badge: "bg-[#26bc71]/10 text-[#26bc71] border-[#26bc71]/20",
    dot: "bg-[#26bc71]",
  },
  PENDING: {
    label: "Chờ xử lý",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dot: "bg-yellow-400",
  },
  CANCELLED: {
    label: "Đã huỷ",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
};

const PAGE_SIZE = 8;
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-[#222] rounded-xl border border-white/5 p-6 ${className}`}
  >
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG["PENDING"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// --- 💡 DANH SÁCH DỮ LIỆU DỰ PHÒNG (FALLBACK) NẾU API KHÁC LỖI HOẶC CHƯA KỊP TRẢ VỀ ---
const FALLBACK_USERS = [
  {
    name: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0901234567",
    color: "#0d9488",
  },
  {
    name: "Trần Thị Kim",
    email: "kim.tran@gmail.com",
    phone: "0912345678",
    color: "#059669",
  },
  {
    name: "Lê Minh Quân",
    email: "quan.le@gmail.com",
    phone: "0933456789",
    color: "#0e7490",
  },
  {
    name: "Phạm Thùy Linh",
    email: "linh.pham@gmail.com",
    phone: "0944567890",
    color: "#065f46",
  },
  {
    name: "Hoàng Đức Nam",
    email: "nam.hoang@gmail.com",
    phone: "0976678901",
    color: "#7c3aed",
  },
  {
    name: "Vũ Ngọc Bảo",
    email: "bao.vu@gmail.com",
    phone: "0988789012",
    color: "#b45309",
  },
  {
    name: "Đặng Thị Hoa",
    email: "hoa.dang@gmail.com",
    phone: "0909890123",
    color: "#be185d",
  },
];

const FALLBACK_EVENTS = [
  {
    title: "SUPER SHOW 10 – Super Junior",
    subtitle: "Vé VIP",
    location: "Sân vận động Mỹ Đình, Hà Nội",
  },
  {
    title: "SÂN KHẤU XÓM KỊCH: CĂN HỘ SỐ 13",
    subtitle: "Vé Thường",
    location: "Nhà Hát Bến Thành, TP. HCM",
  },
  {
    title: "B.DUCK CITYFUNS @VINCOM LANDMARK 81",
    subtitle: "Combo Vé Chơi Game",
    location: "Vincom Landmark 81, TP. HCM",
  },
  {
    title: "DÉ GARDEN Moss Frame Workshop",
    subtitle: "Vé Tham Gia Workshop",
    location: "Dé Garden Studio, Hà Nội",
  },
  {
    title: "Tech Conference Vietnam 2026",
    subtitle: "Vé Toàn Cảnh Standard",
    location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
  },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ revenue: 0, pending: 0 });

  const loadData = async () => {
    setIsLoading(true);
    try {
      let backendStatus = undefined;
      if (statusTab === "SUCCESS") backendStatus = "PAID";
      else if (statusTab !== "ALL") backendStatus = statusTab;

      // 1. Gọi API (Backend đã JOIN sẵn bảng, dữ liệu lấy ra là BookingAdminResponse)
      const res = await serviceSearchBookingsByAdmin(
        page - 1,
        PAGE_SIZE,
        backendStatus,
        search,
      );
      const pageData = res?.data?.body || res?.body || res?.data || res;

      if (pageData && Array.isArray(pageData.content)) {
        setTotalPages(pageData.totalPages || 1);
        setTotalItems(pageData.totalElements || 0);

        // 2. Map trực tiếp dữ liệu DTO từ Backend
        const mapped = pageData.content.map((b) => {
          // b chính là BookingAdminResponse có sẵn tên người và tên sự kiện
          const customerName = b.customerName || "Chưa cập nhật";
          const initials = customerName
            .split(" ")
            .map((n) => n?.[0] || "")
            .join("")
            .substring(0, 2)
            .toUpperCase();
          const colors = [
            "#0d9488",
            "#059669",
            "#0e7490",
            "#065f46",
            "#7c3aed",
            "#b45309",
            "#be185d",
          ];
          const color = colors[(b.id || 0) % colors.length];

          return {
            id: `#TB-${b.id}`,
            rawId: b.id, // Giữ lại ID thật để truyền vào hàm Cập nhật Status
            customer: {
              name: customerName,
              initials: initials,
              color: color,
              email: b.customerEmail || "Chưa cung cấp",
              phone: "Chưa cung cấp", // Backend hiện tại không lấy phone
            },
            event: {
              name: b.eventName || "Sự kiện không xác định",
              sub: "Vé sự kiện", // Tuỳ chỉnh sau
              location: b.eventLocation || "Chưa cập nhật",
            },
            tickets: b.totalTickets || 0, // SỬA DÒNG NÀY (lấy đúng số vé từ Backend)
            unitPrice: b.totalAmount || 0,
            total: b.totalAmount || 0,
            status: b.status === "PAID" ? "SUCCESS" : b.status,
            date: new Date(b.createdAt).toLocaleDateString("vi-VN"),
          };
        });

        setOrders(mapped);

        // 3. Cập nhật thẻ thống kê
        const pending = pageData.content.filter(
          (x) => x.status === "PENDING",
        ).length;
        const revenue = pageData.content
          .filter((x) => x.status === "PAID")
          .reduce((s, x) => s + (x.totalAmount || 0), 0);
        setStats({ pending, revenue });
      } else {
        setOrders([]);
        setTotalItems(0);
        setStats({ pending: 0, revenue: 0 });
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu mạng:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, [page, statusTab, search]);

  const handleExportCSV = () => {
    // 1. Định nghĩa các cột
    const headers = ["Mã đơn", "Khách hàng", "Email", "Sự kiện", "Số vé", "Tổng tiền", "Ngày", "Trạng thái"];
    
    // 2. Map dữ liệu từ state 'orders' thành các hàng CSV
    const rows = orders.map(o => [
      o.id,
      o.customer.name,
      o.customer.email,
      o.event.name,
      o.tickets,
      o.total,
      o.date,
      STATUS_CFG[o.status] ? STATUS_CFG[o.status].label : o.status
    ]);

    // 3. Tạo nội dung CSV (thêm \uFEFF để Excel đọc không bị lỗi font tiếng Việt)
    const csvContent = "\uFEFF" + [headers, ...rows].map(row => row.join(",")).join("\n");

    // 4. Tạo file và ép trình duyệt tải về
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `don_hang_${new Date().toLocaleDateString("vi-VN")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTab = (t) => {
    setStatusTab(t);
    setPage(1);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleStatusChange = () => {
    loadData();
    setSelectedOrder(null);
  };

  const TABS = [
    { key: "ALL", label: "Tất cả" },
    { key: "SUCCESS", label: "Thành công" },
    { key: "PENDING", label: "Chờ xử lý" },
    { key: "CANCELLED", label: "Đã huỷ" },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-1.5">Quản lý đơn hàng</h2>
            <p className="text-gray-500 text-sm">
              Theo dõi và xử lý toàn bộ giao dịch trên nền tảng thật
            </p>
          </div>
          <button 
  onClick={handleExportCSV} // <--- GẮN VÀO ĐÂY
  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors"
>
  <Download size={15} /> Xuất CSV
</button>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-8">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#26bc71] flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {totalItems.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs">Tổng đơn hàng</p>
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
            <p className="text-2xl font-bold text-white mb-1">
              {stats.pending}
            </p>
            <p className="text-gray-500 text-xs">Đơn chờ xử lý trang này</p>
          </Card>
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {stats.revenue.toLocaleString("vi-VN")} ₫
            </p>
            <p className="text-gray-500 text-xs">Doanh thu trang này</p>
          </Card>
        </div>

        <div className="bg-[#222] rounded-xl border border-white/5 mb-6">
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => handleTab(t.key)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusTab === t.key ? "bg-[#26bc71] text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    value={search}
                    onChange={handleSearch}
                    placeholder="Nhập ID đơn, tên khách, sự kiện..."
                    className="bg-[#1a1a1a] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#26bc71]/40 w-72 transition-colors"
                  />
                </div>
                <button
                  onClick={loadData}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/5 text-gray-500 hover:text-white text-xs transition-colors"
                >
                  <RefreshCw
                    size={13}
                    className={isLoading ? "animate-spin" : ""}
                  />{" "}
                  Làm mới
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] text-gray-500 text-xs">
                  <th className="px-6 py-3 text-left font-medium">MÃ ĐƠN</th>
                  <th className="px-6 py-3 text-left font-medium">
                    KHÁCH HÀNG
                  </th>
                  <th className="px-6 py-3 text-left font-medium">SỰ KIỆN</th>
                  <th className="px-6 py-3 text-left font-medium">VÉ</th>
                  <th className="px-6 py-3 text-left font-medium">TỔNG TIỀN</th>
                  <th className="px-6 py-3 text-left font-medium">NGÀY</th>
                  <th className="px-6 py-3 text-left font-medium">
                    TRẠNG THÁI
                  </th>
                  <th className="px-6 py-3 text-left font-medium">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-600 text-sm"
                    >
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-[#26bc71] text-xs font-semibold">
                        {o.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: o.customer.color }}
                          >
                            {o.customer.initials}
                          </div>
                          <span className="text-gray-200 text-sm">
                            {o.customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[180px]">
                        <p className="text-gray-200 text-sm font-medium truncate">
                          {o.event.name}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {o.event.sub}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {o.tickets} vé
                      </td>
                      <td className="px-6 py-4 text-white font-semibold text-sm">
                        {o.total === 0 ? (
                          <span className="text-[#26bc71]">Miễn phí</span>
                        ) : (
                          o.total.toLocaleString("vi-VN") + " ₫"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {o.date}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} />
                      </td>
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

          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-gray-600 text-xs">
              Tổng số {totalItems} đơn hàng
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm px-4">
                Trang {page} / {totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
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
