import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import UserTable from '../components/UserTable';
import UserDetailModal from '../components/UserDetailModal';

/* ─── Mock data generation ─────────────────────────────────────── */
const generatePhone = (seed) => {
  const prefixes = ['032', '033', '034', '035', '062', '070', '076', '077', '078', '079',
                    '081', '082', '083', '090', '091', '093', '096', '097', '098'];
  const prefix = prefixes[seed % prefixes.length];
  const tail = String((seed * 7919 + 12345) % 10000000).padStart(7, '0');
  return prefix + tail;
};

const formatDate = (date) =>
  `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

// 8 blocked indices (0-based) → 92 active out of 100
const BLOCKED_INDICES = new Set([11, 24, 35, 47, 58, 69, 80, 93]);

// Shuffled display numbers (1-100, unique)
const NUMS = [
  98, 59, 55, 38,  3, 43, 34, 77, 23, 25,
  67, 12, 89, 45, 72,  5, 91, 18, 63,  7,
  41, 86, 29, 54, 17, 70, 33, 48, 64,  9,
  52, 81, 26, 15, 73, 40, 92,  6, 57, 22,
  76, 31, 44, 68, 11, 85, 37, 60, 27, 82,
  19, 71, 46, 13, 90, 35, 58, 24, 79, 42,
   8, 65, 30, 87, 20, 53, 16, 74, 39, 96,
  28, 83, 14, 66, 36, 61, 50, 80, 21, 78,
  47, 10, 88, 32, 69,  4, 93,  2, 75, 49,
  84,  1, 95, 51, 62, 99, 97, 56, 100, 71,
];

const BASE_DATE = new Date('2026-01-21');

const USER_LIST = Array.from({ length: 100 }, (_, i) => {
  const num = NUMS[i] ?? i + 1;
  const created = new Date(BASE_DATE);
  created.setDate(created.getDate() - Math.round((i * 195) / 99));

  return {
    id: i + 1,
    name: `Người dùng ${num}`,
    email: `user${num}@example.com`,
    phone: generatePhone(num),
    created: formatDate(created),
    createdTs: created.getTime(),
    status: BLOCKED_INDICES.has(i) ? 'Bị khóa' : 'Hoạt động',
    initials: 'ND',
  };
});

/* ─── Constants ────────────────────────────────────────────────── */
const STATUS_FILTERS = ['Tất cả', 'Đang hoạt động', 'Bị khóa'];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

/* ─── Component ────────────────────────────────────────────────── */
const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Đang hoạt động');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [users, setUsers] = useState(USER_LIST);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) ?? null,
    [users, selectedUserId]
  );

  /* Filtered + sorted list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = users.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);
      const matchStatus =
        statusFilter === 'Tất cả' ||
        (statusFilter === 'Đang hoạt động' ? u.status === 'Hoạt động' : u.status === 'Bị khóa');
      return matchSearch && matchStatus;
    });
    result = [...result].sort((a, b) =>
      sortOrder === 'desc' ? b.createdTs - a.createdTs : a.createdTs - b.createdTs
    );
    return result;
  }, [users, search, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  /* Handlers */
  const resetPage = () => setCurrentPage(1);

  const handleSearch = (e) => { setSearch(e.target.value); resetPage(); };
  const handleFilterChange = (f) => { setStatusFilter(f); setSelectedIds(new Set()); resetPage(); };
  const handleSortToggle = () => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
  const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); resetPage(); };

  const handleSelectAll = (checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginated.forEach((u) => (checked ? next.add(u.id) : next.delete(u.id)));
      return next;
    });
  };

  const handleSelectOne = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleAction = (action, user) => {
    if (action === 'view') {
      setSelectedUserId(user.id);
    } else if (action === 'toggle') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động' }
            : u
        )
      );
    } else if (action === 'delete') {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(user.id); return n; });
      if (selectedUserId === user.id) setSelectedUserId(null);
    }
  };

  const handleExportCSV = () => {
    const header = 'Tên,Email,Điện thoại,Ngày tạo,Trạng thái';
    const rows = filtered.map(
      (u) => `"${u.name}","${u.email}","${u.phone}","${u.created}","${u.status}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nguoi-dung.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterBtnClass = (f) => {
    if (statusFilter !== f) return 'bg-[#222] text-gray-500 hover:bg-[#2a2a2a] hover:text-white';
    if (f === 'Bị khóa') return 'bg-red-500/80 text-white';
    return 'bg-[#26bc71] text-white';
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />

      <main className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">Danh sách người dùng</h2>
            <p className="text-gray-500 mt-2">Quản lý tài khoản người dùng trong hệ thống</p>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="bg-[#222] border border-white/5 rounded px-10 py-2.5 outline-none focus:border-[#26bc71] w-96 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterBtnClass(f)}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <UserTable
          users={paginated}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onAction={handleAction}
          sortOrder={sortOrder}
          onSortToggle={handleSortToggle}
        />

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Hiển thị
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-[#222] border border-white/5 rounded px-2 py-1 text-gray-300 text-sm outline-none focus:border-[#26bc71] cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            người dùng mỗi trang
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Trang{' '}
              <span className="text-white font-medium">{safePage}</span>
              {' '}của{' '}
              <span className="text-white font-medium">{totalPages}</span>
              {' '}
              <span className="text-gray-600">({filtered.length} kết quả)</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors"
          >
            <Download size={15} />
            Xuất CSV
          </button>
        </div>
      </main>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUserId(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default UserManagement;
