import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Bell, Settings, TrendingUp, Users, CalendarDays,
  Ticket, ArrowUpRight, CheckCircle, Tag, Megaphone,
  ShieldCheck, ShoppingBag, UserPlus, ChevronRight,
} from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'
import { getAllAdminEvents } from '../services/eventService'

/* ── helpers ─────────────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#222] rounded-xl border border-white/5 p-6 ${className}`}>{children}</div>
)

/* ── Revenue chart placeholder ─────────────────────────────── */
const RevenueChart = () => (
  <div className="h-[170px] flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#1a1a1a] text-gray-500 text-sm">
    Dữ liệu doanh thu chưa được kết nối từ database.
  </div>
)

const QUICK_ACTIONS = [
  { icon: CheckCircle, label: 'Duyệt sự kiện',    sub: 'Xem các sự kiện chờ duyệt',  to: '/admin/events',    dot: 'bg-[#26bc71]' },
  { icon: ShoppingBag, label: 'Xem đơn hàng',     sub: 'Mở trang quản lý đơn hàng',   to: '/admin/orders',    dot: 'bg-blue-500' },
  { icon: Megaphone,   label: 'Quản lý người dùng', sub: 'Mở trang người dùng',       to: '/admin/users',     dot: 'bg-violet-500' },
  { icon: ShieldCheck, label: 'Xem thống kê',      sub: 'Chờ dữ liệu báo cáo thật',    to: '/admin/analytics', dot: 'bg-orange-500' },
]

/* ── page ────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const [chartFilter, setChartFilter] = useState('7d')
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [draftCount, setDraftCount] = useState(0)
  const publishedCount = events.filter((e) => e.status === 'PUBLISHED').length
  const totalViews = events.reduce((sum, event) => sum + (event.viewCount || 0), 0)

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setEventsLoading(true)
        const data = await getAllAdminEvents()
        setEvents(data)
        setDraftCount(data.filter(e => e.status === 'DRAFT').length)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setEventsLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Map API events to upcoming format
  const UPCOMING = events.slice(0, 3).map(event => ({
    id: event.id,
    name: event.title,
    date: event.createdAt ? new Date(event.createdAt).toLocaleDateString('vi-VN') : 'N/A',
    badge: event.status === 'DRAFT' ? 'Chờ duyệt' : event.status === 'PUBLISHED' ? 'Đã duyệt' : 'Bị từ chối',
    badgeCls: event.status === 'DRAFT' ? 'text-yellow-400 bg-yellow-500/10' : event.status === 'PUBLISHED' ? 'text-[#26bc71] bg-[#26bc71]/10' : 'text-red-400 bg-red-500/10',
    tickets: '0 vé',
    sold: 0,
  }))

  const ACTIVITIES = events.slice(0, 4).map((event) => ({
    icon: CalendarDays,
    color: event.status === 'PUBLISHED'
      ? 'bg-[#26bc71]/10 text-[#26bc71]'
      : event.status === 'CANCELLED'
        ? 'bg-red-500/10 text-red-400'
        : 'bg-orange-500/10 text-orange-400',
    text: 'Sự kiện',
    highlight: `"${event.title}"`,
    extra: event.status === 'PUBLISHED' ? 'đã có trên database' : event.status === 'CANCELLED' ? 'đã bị hủy' : 'đang chờ duyệt',
    time: event.createdAt ? new Date(event.createdAt).toLocaleString('vi-VN') : 'Mới tạo',
  }))

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-10 py-5 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-500 text-xs mt-0.5">Chào mừng trở lại, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Tìm kiếm đơn hàng, sự kiện..."
                className="bg-[#222] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#26bc71]/40 w-64 transition-colors"
              />
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#222] border border-white/5 text-gray-500 hover:text-white transition-colors relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#26bc71]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#222] border border-white/5 text-gray-500 hover:text-white transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="px-10 py-8 space-y-6">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Tổng sự kiện',      value: `${events.length}`,      sub: 'dữ liệu từ database',   change: null, up: false, icon: TrendingUp,   iconBg: 'bg-[#26bc71]' },
              { label: 'Sự kiện đã duyệt',  value: `${publishedCount}`,     sub: 'đã công khai',          change: null, up: false, icon: Users,        iconBg: 'bg-blue-600' },
              { label: 'Sự kiện chờ duyệt', value: `${draftCount}`,         sub: 'cần xử lý ngay',        change: null, up: false, icon: CalendarDays, iconBg: 'bg-orange-600', alert: true },
              { label: 'Tổng lượt xem',     value: `${totalViews.toLocaleString('vi-VN')}`, sub: 'từ các sự kiện live', change: null, up: false, icon: Ticket, iconBg: 'bg-violet-600' },
            ].map((s) => (
              <Card key={s.label}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                    <s.icon size={18} className="text-white" />
                  </div>
                  {s.alert && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Cần xử lý</span>}
                </div>
                <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.sub}</p>
              </Card>
            ))}
          </div>

          {/* ── Revenue chart + Quick Actions ── */}
          <div className="grid grid-cols-3 gap-5">
            <Card className="col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-sm">Tổng quan doanh thu</h3>
                </div>
              </div>
              <RevenueChart filter={chartFilter} onFilter={setChartFilter} />
            </Card>

            <Card>
              <h3 className="text-white font-semibold text-sm mb-4">Thao tác nhanh</h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map((a) => (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a1a] hover:bg-white/5 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.dot.replace('bg-','bg-').replace('-500','-500/15')}`}>
                      <a.icon size={15} className={a.dot.replace('bg-','text-')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs font-medium">{a.label}</p>
                      <p className="text-gray-600 text-[11px]">{a.sub}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Recent Activity + Upcoming Events ── */}
          <div className="grid grid-cols-2 gap-5">

            {/* Recent Activity */}
            <Card>
              <h3 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/5">
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                {ACTIVITIES.length === 0 ? (
                  <p className="text-gray-600 text-sm">Chưa có hoạt động nào từ database.</p>
                ) : ACTIVITIES.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                      <a.icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {a.text}{' '}
                        <span className="text-[#26bc71] font-medium">{a.highlight}</span>
                        {a.extra && <span> {a.extra}</span>}
                      </p>
                      <p className="text-gray-600 text-[11px] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <h3 className="text-white font-semibold text-sm">Sự kiện sắp diễn ra</h3>
                <Link to="/admin/events" className="text-[#26bc71] text-xs hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-3">
                {UPCOMING.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a1a] hover:bg-white/[0.03] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <CalendarDays size={16} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs font-medium truncate">{e.name}</p>
                      <p className="text-gray-600 text-[11px] mt-0.5">{e.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${e.badgeCls}`}>
                        {e.badge}
                      </span>
                      <p className="text-gray-600 text-[11px] mt-1">{e.tickets}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
