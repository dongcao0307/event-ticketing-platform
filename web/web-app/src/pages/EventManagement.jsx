import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import EventTable from '../components/EventTable';
import Pagination from '../components/Pagination';

const ALL_EVENTS = [
  { id: 0, name: 'Concert 2024 - The Grand Stage',    creator: 'Music Events Co.',  type: 'Offline', time: '2024-03-15 19:00', price: 'Có phí',    created: '2024-02-10', status: 'Pending'  },
  { id: 1, name: 'Tech Conference Vietnam',            creator: 'Tech Hub Asia',     type: 'Offline', time: '2024-04-05 09:00', price: 'Miễn phí', created: '2024-02-08', status: 'Approved' },
  { id: 2, name: 'Online Webinar - Digital Marketing', creator: 'Marketing Pro',     type: 'Online',  time: '2024-02-28 14:00', price: 'Có phí',    created: '2024-02-05', status: 'Approved' },
  { id: 3, name: 'Art Exhibition 2024',                creator: 'Gallery Vietnam',   type: 'Offline', time: '2024-03-01 10:00', price: 'Miễn phí', created: '2024-02-03', status: 'Rejected' },
  { id: 4, name: 'Startup Meetup - Pitch Day',         creator: 'Startup Community', type: 'Offline', time: '2024-02-25 18:00', price: 'Miễn phí', created: '2024-02-01', status: 'Rejected' },
];

const TABS = [
  { label: 'Tất cả',      value: 'All' },
  { label: 'Chờ duyệt',   value: 'Pending' },
  { label: 'Đã duyệt',    value: 'Approved' },
  { label: 'Bị từ chối',  value: 'Rejected' },
];
const PAGE_SIZE = 10;

const EventManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch]     = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents]     = useState(ALL_EVENTS);

  const filtered = useMemo(() =>
    events.filter((e) => {
      const q = search.toLowerCase();
      return (
        (e.name.toLowerCase().includes(q) || e.creator.toLowerCase().includes(q)) &&
        (activeTab === 'All' || e.status === activeTab)
      );
    }),
  [events, search, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleTabChange = (v) => { setActiveTab(v); setCurrentPage(1); };
  const handleSearch    = (e) => { setSearch(e.target.value); setCurrentPage(1); };

  const handleApprove = (ev) =>
    setEvents((p) => p.map((e) => e.name === ev.name ? { ...e, status: 'Approved' } : e));
  const handleReject  = (ev) =>
    setEvents((p) => p.map((e) => e.name === ev.name ? { ...e, status: 'Rejected' } : e));

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />

      <main className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">Danh sách sự kiện</h2>
            <p className="text-gray-500 mt-2">Quản lý và duyệt sự kiện do người dùng tạo</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Tìm kiếm tên sự kiện, người tạo..."
                className="bg-[#222] border border-white/5 rounded px-10 py-2.5 outline-none focus:border-[#26bc71] w-80 text-white placeholder-gray-500"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#222] px-4 rounded border border-white/5 text-gray-400 hover:text-white transition-colors">
              <Filter size={18} /> Lọc
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === value
                  ? 'bg-[#26bc71] text-white'
                  : 'bg-[#222] text-gray-500 hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <EventTable
          events={paginated}
          onView={(event) => navigate('/admin/events/' + event.id)}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default EventManagement;
