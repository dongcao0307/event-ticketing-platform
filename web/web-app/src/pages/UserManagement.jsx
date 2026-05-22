import React, { useEffect, useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import UserTable from '../components/UserTable';
import UserDetailModal from '../components/UserDetailModal';
import { adminUserService } from '../services/adminUserService';

const STATUS_FILTERS = ['Tất cả', 'Đang hoạt động', 'Bị khóa'];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const getAvatarColor = (value) => {
  const colors = ['#0d9488', '#059669', '#047857', '#0e7490', '#065f46', '#0f766e'];
  const text = String(value ?? '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return colors[Math.abs(hash) % colors.length];
};

const getStatusLabel = (status) => {
  if (status === 'LOCKED' || status === 'BANNED') return 'Bị khóa';
  return 'Hoạt động';
};

const getBackendStatus = (filter) => {
  if (filter === 'Bị khóa') return 'LOCKED';
  if (filter === 'Đang hoạt động') return 'ACTIVE';
  return undefined;
};

const buildInitials = (fullName, userName) => {
  const source = (fullName || userName || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

const mapUser = (item) => ({
  id: item.userName,
  userName: item.userName,
  name: item.fullName || item.userName,
  email: item.email,
  phone: item.phone || '',
  created: formatDate(item.createdDate),
  createdTs: item.createdDate ? new Date(item.createdDate).getTime() : 0,
  status: getStatusLabel(item.status),
  role: item.role,
  initials: buildInitials(item.fullName, item.userName),
  avatarColor: getAvatarColor(item.userName),
});

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminUserService.listUsers({
        page: currentPage - 1,
        size: pageSize,
        keyword: search.trim() || undefined,
        status: getBackendStatus(statusFilter),
      });
      const pageData = res?.data || res;
      const content = pageData?.content || [];
      setUsers(content.map(mapUser));
      setTotalPages(pageData?.totalPages || 1);
      setTotalElements(pageData?.totalElements || content.length);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, search, statusFilter]);

  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(
    () => [...users].sort((a, b) => (sortOrder === 'desc' ? b.createdTs - a.createdTs : a.createdTs - b.createdTs)),
    [users, sortOrder]
  );

  const resetPage = () => setCurrentPage(1);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    resetPage();
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setSelectedIds(new Set());
    resetPage();
  };

  const handleSortToggle = () => setSortOrder((order) => (order === 'desc' ? 'asc' : 'desc'));

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    resetPage();
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleSelectAll = (checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginated.forEach((user) => (checked ? next.add(user.id) : next.delete(user.id)));
      return next;
    });
  };

  const handleSelectOne = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleAction = async (action, user) => {
    if (action === 'view') {
      try {
        const res = await adminUserService.getUserDetail(user.userName);
        const detailData = res?.data || res;
        const detail = mapUser(detailData || user);
        setSelectedUser({ ...detail, city: detailData?.city || '' });
      } catch (_) {
        setSelectedUser(user);
      }
      return;
    }

    if (action === 'toggle') {
      const nextStatus = user.status === 'Hoạt động' ? 'LOCKED' : 'ACTIVE';
      await adminUserService.updateUserStatus(user.userName, nextStatus);
      await loadUsers();
      if (selectedUser?.userName === user.userName) {
        const refreshed = await adminUserService.getUserDetail(user.userName);
        const refreshedData = refreshed?.data || refreshed;
        const detail = mapUser(refreshedData || user);
        setSelectedUser({ ...detail, city: refreshedData?.city || '' });
      }
      return;
    }
  };

  const handleExportCSV = () => {
    const header = 'Tên,Username,Email,Điện thoại,Ngày tạo,Trạng thái';
    const rows = paginated.map((user) =>
      `"${user.name}","${user.userName}","${user.email}","${user.phone}","${user.created}","${user.status}"`
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

  const filterBtnClass = (filter) => {
    if (statusFilter !== filter) return 'bg-[#222] text-gray-500 hover:bg-[#2a2a2a] hover:text-white';
    if (filter === 'Bị khóa') return 'bg-red-500/80 text-white';
    return 'bg-[#26bc71] text-white';
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />

      <main className="flex-1 p-12 overflow-y-auto">
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
              placeholder="Tìm kiếm theo tên, username, email, số điện thoại..."
              className="bg-[#222] border border-white/5 rounded px-10 py-2.5 outline-none focus:border-[#26bc71] w-96 text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterBtnClass(filter)}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <UserTable
          users={paginated}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onAction={handleAction}
          sortOrder={sortOrder}
          onSortToggle={handleSortToggle}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Hiển thị
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-[#222] border border-white/5 rounded px-2 py-1 text-gray-300 text-sm outline-none focus:border-[#26bc71] cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            người dùng mỗi trang
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Trang <span className="text-white font-medium">{safePage}</span>
              {' '}của <span className="text-white font-medium">{totalPages}</span>
              {' '}<span className="text-gray-600">({totalElements} kết quả)</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

        {loading && <div className="mt-6 text-sm text-gray-500">Đang tải dữ liệu người dùng...</div>}
        {!loading && (
          <div className="mt-2 text-xs text-gray-600">
            Tổng số kết quả: {totalElements}
          </div>
        )}
      </main>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default UserManagement;