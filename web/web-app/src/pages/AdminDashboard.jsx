import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Bell, Settings, TrendingUp, Users, CalendarDays,
  Ticket, ArrowUpRight, CheckCircle, Tag, Megaphone,
  ShieldCheck, ShoppingBag, UserPlus, ChevronRight,
} from 'lucide-react'
import AdminSidebar from '../components/AdminSidebar'

/* ── helpers ─────────────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#222] rounded-xl border border-white/5 p-6 ${className}`}>{children}</div>
)

/* ── Revenue SVG line chart (7 days) ─────────────────────────── */
const RevenueChart = ({ filter, onFilter }) => {
  const days7  = { labels: ['T2','T3','T4','T5','T6','T7','CN'], data: [18,25,22,35,42,58,48] }
  const days14 = { labels: ['T2','T3','T4','T5','T6','T7','CN','T2','T3','T4','T5','T6','T7','CN'], data: [12,18,15,22,28,35,30,18,25,22,35,42,58,48] }
  const { labels, data } = filter === '7d' ? days7 : days14

  const W = 480, H = 120
  const pad = { l: 8, r: 8, t: 8, b: 4 }
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b
  const minV = Math.min(...data) * 0.85
  const maxV = Math.max(...data) * 1.08
  const n = data.length
  const px = (i) => pad.l + (i / (n - 1)) * cW
  const py = (v) => pad.t + cH - ((v - minV) / (maxV - minV)) * cH
  const pts = data.map((v, i) => `${px(i)},${py(v)}`).join(' ')
  const area = `M${px(0)},${py(data[0])} ` + data.map((v,i)=>`L${px(i)},${py(v)}`).join(' ') + ` L${px(n-1)},${H} L${px(0)},${H} Z`

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-gray-500 text-xs">Xu hướng hàng ngày trong kỳ đã chọn</p>
        <div className="flex gap-1">
          {[['7d','7 ngày'],['14d','14 ngày']].map(([k,l]) => (
            <button key={k} onClick={() => onFilter(k)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filter===k ? 'bg-[#26bc71] text-white' : 'bg-[#1a1a1a] text-gray-500 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
        <defs>
          <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26bc71" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#26bc71" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#dashGrad)" />
        <polyline points={pts} fill="none" stroke="#26bc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r="3" fill="#26bc71" />
        ))}
      </svg>
      <div className={`grid mt-1`} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {labels.map((l, i) => (
          <p key={i} className={`text-center text-xs ${i === n - 2 ? 'text-[#26bc71] font-semibold' : 'text-gray-600'}`}>{l}</p>
        ))}
      </div>
    </div>
  )
}

/* ── mock data ───────────────────────────────────────────────── */
const ACTIVITIES = [
  { icon: ShoppingBag, color: 'bg-[#26bc71]/10 text-[#26bc71]', text: 'Đơn hàng mới', highlight: '#TB-8942', extra: 'bởi Nguyễn Văn An', time: '2 phút trước' },
  { icon: CheckCircle, color: 'bg-blue-500/10 text-blue-400',    text: 'Sự kiện',    highlight: '"Concert 2024"', extra: 'đã được duyệt',       time: '45 phút trước' },
  { icon: UserPlus,    color: 'bg-violet-500/10 text-violet-400', text: 'Người dùng mới:', highlight: 'Trần Thị Kim', extra: 'vừa đăng ký',   time: '2 giờ trước' },
  { icon: CalendarDays,color: 'bg-orange-500/10 text-orange-400', text: 'Sự kiện mới chờ duyệt:', highlight: 'Tech Summit 2025', extra: '',   time: '3 giờ trước' },
]

const UPCOMING = [
  { name: 'Neon Night Festival',  date: '15/10/2024', badge: 'Sold Out',   badgeCls: 'text-red-400 bg-red-500/10',         tickets: '1.200 vé',  sold: 100 },
  { name: 'Future Tech Summit',   date: '22/10/2024', badge: '85% Sold',   badgeCls: 'text-[#26bc71] bg-[#26bc71]/10',     tickets: '850/1.000', sold: 85  },
  { name: 'Modern Art Gala',      date: '02/11/2024', badge: 'Early Bird', badgeCls: 'text-yellow-400 bg-yellow-500/10',   tickets: '320 vé',    sold: 32  },
]

const QUICK_ACTIONS = [
  { icon: CheckCircle, label: 'Duyệt sự kiện',    sub: '3 sự kiện đang chờ',  to: '/admin/events',    dot: 'bg-[#26bc71]' },
  { icon: ShoppingBag, label: 'Xem đơn hàng',     sub: '2 đơn chờ xử lý',     to: '/admin/orders',    dot: 'bg-blue-500' },
  { icon: Megaphone,   label: 'Quản lý người dùng', sub: '100 tài khoản',      to: '/admin/users',     dot: 'bg-violet-500' },
  { icon: ShieldCheck, label: 'Xem thống kê',      sub: 'Báo cáo tháng này',   to: '/admin/analytics', dot: 'bg-orange-500' },
]

/* ── page ────────────────────────────────────────────────────── */
const AdminDashboard = () => {
  const [chartFilter, setChartFilter] = useState('7d')

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
              { label: 'Tổng doanh thu',    value: '425.800.000 ₫', sub: 'so với tháng trước', change: '+12.5%', up: true,  icon: TrendingUp,   iconBg: 'bg-[#26bc71]' },
              { label: 'Người dùng mới',    value: '1.240',         sub: 'tốc độ tăng trưởng', change: '+8.2%',  up: true,  icon: Users,        iconBg: 'bg-blue-600' },
              { label: 'Sự kiện chờ duyệt', value: '14',            sub: 'Cần xử lý ngay',     change: null,      up: false, icon: CalendarDays, iconBg: 'bg-orange-600', alert: true },
              { label: 'Vé đang lưu hành',  value: '8.450',         sub: 'đang trong lưu thông', change: '+5.1%', up: true, icon: Ticket,        iconBg: 'bg-violet-600' },
            ].map((s) => (
              <Card key={s.label}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                    <s.icon size={18} className="text-white" />
                  </div>
                  {s.alert
                    ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Cần xử lý</span>
                    : <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.up ? 'bg-[#26bc71]/10 text-[#26bc71]' : 'bg-red-500/10 text-red-400'}`}>
                        <ArrowUpRight size={10} /> {s.change}
                      </span>
                  }
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
                {ACTIVITIES.map((a, i) => (
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
