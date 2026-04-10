import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import EventTable from '../components/EventTable';
import Pagination from '../components/Pagination';
import { useToast } from '../context/ToastContext';
import { getAllAdminEvents, approveEvent, rejectEvent } from '../services/eventService';

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

// Map API status to display status
const mapStatusToDisplay = (apiStatus) => {
  switch (apiStatus) {
    case 'DRAFT':
      return 'Pending';
    case 'PUBLISHER':
      return 'Approved';
    case 'CANCELLED':
      return 'Rejected';
    default:
      return 'Pending';
  }
};

// Map API event to table format
const mapApiEventToTable = (apiEvent) => ({
  id: apiEvent.id,
  name: apiEvent.title,
  creator: apiEvent.organizerName || 'Unknown',
  type: apiEvent.type ? (apiEvent.type.includes('Online') ? 'Online' : 'Offline') : 'Offline',
  time: apiEvent.startDate ? new Date(apiEvent.startDate).toLocaleString('vi-VN') : 'N/A',
  price: 'Có phí',
  created: apiEvent.createdAt ? new Date(apiEvent.createdAt).toLocaleDateString('vi-VN') : 'N/A',
  status: mapStatusToDisplay(apiEvent.status),
  apiStatus: apiEvent.status,
});

const EventManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab]     = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const apiEvents = await getAllAdminEvents();
        const mappedEvents = apiEvents.map(mapApiEventToTable);
        setEvents(mappedEvents);
        setError(null);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events from server');
        // Fallback to empty array if API fails
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filtered = useMemo(() =>
    events.filter((e) => {
      const q = search.toLowerCase();
      return (
        (e.name.toLowerCase().includes(q) || e.creator.toLowerCase().includes(q)) &&
        (activeTab === 'All' || e.status === activeTab)
      );
    }),
    [events, search, activeTab]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleTabChange = (v) => { setActiveTab(v); setCurrentPage(1); };
  
  const handleSearchSubmit = () => { 
    setSearch(searchInput); 
    setCurrentPage(1); 
  };
  
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleApprove = async (ev) => {
    try {
      await approveEvent(ev.id);
      setEvents((p) =>
        p.map((e) =>
          e.id === ev.id ? { ...e, status: 'Approved', apiStatus: 'PUBLISHER' } : e
        )
      );
    } catch (err) {
      toast.error('Error approving event: ' + err.message);
    }
  };

  const handleReject = async (ev) => {
    try {
      await rejectEvent(ev.id, 'Rejected by admin');
      setEvents((p) =>
        p.map((e) =>
          e.id === ev.id ? { ...e, status: 'Rejected', apiStatus: 'CANCELLED' } : e
        )
      );
    } catch (err) {
      toast.error('Error rejecting event: ' + err.message);
    }
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Tìm kiếm tên sự kiện, người tạo..."
                className="bg-[#222] border border-white/5 rounded px-10 py-2.5 outline-none focus:border-[#26bc71] w-80 text-white placeholder-gray-500"
              />
            </div>
            <button 
              onClick={handleSearchSubmit}
              className="flex items-center gap-2 bg-[#26bc71] hover:bg-[#1e9854] px-4 py-2.5 rounded text-white transition-colors font-medium"
            >
              <Search size={18} /> Tìm kiếm
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="w-8 h-8 border-4 border-[#26bc71]/30 border-t-[#26bc71] rounded-full animate-spin" />
              </div>
              <p className="text-gray-400">Đang tải danh sách sự kiện...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <>
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
          </>
        )}
      </main>
    </div>
  );
};

export default EventManagement;
