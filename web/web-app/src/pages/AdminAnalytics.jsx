import React, { useState } from 'react';
import {
  TrendingUp, Users, Ticket,
  Calendar, DollarSign, Download, Printer,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

/* ── helpers ─────────────────────────────────────────────────── */
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#222] rounded-xl border border-white/5 p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-white font-semibold text-sm mb-5 pb-3 border-b border-white/5">{children}</h3>
);

/* ── stat card ───────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, change, positive, icon: Icon, iconColor }) => (
  <Card>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon size={18} className="text-white" />
      </div>
      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        positive
          ? 'bg-[#26bc71]/10 text-[#26bc71]'
          : 'bg-red-500/10 text-red-400'
      }`}>
        {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
        {change}
      </span>
    </div>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className="text-gray-500 text-xs">{label}</p>
    {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
  </Card>
);

/* ── Revenue line chart (pure SVG) ──────────────────────────── */
const RevenueChart = ({ filter, onFilter }) => {
  // 6 months of data — two series: Revenue & Tickets
  const labels6 = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels12 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rev6  = [68, 78, 85, 92, 105, 120];
  const rev12 = [32, 38, 35, 50, 55, 62, 68, 78, 85, 92, 105, 120];

  const labels  = filter === '6m' ? labels6  : labels12;
  const rawData = filter === '6m' ? rev6     : rev12;

  const W = 480, H = 140;
  const pad = { l: 10, r: 10, t: 10, b: 4 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const minV = Math.min(...rawData) * 0.85;
  const maxV = Math.max(...rawData) * 1.05;
  const n = rawData.length;

  const px = (i) => pad.l + (i / (n - 1)) * chartW;
  const py = (v) => pad.t + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const pts = rawData.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  const areaPath = `M${px(0)},${py(rawData[0])} ` +
    rawData.map((v, i) => `L${px(i)},${py(v)}`).join(' ') +
    ` L${px(n - 1)},${H} L${px(0)},${H} Z`;

  return (
    <Card>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm">Tăng trưởng doanh thu</h3>
        <div className="flex gap-1">
          {['6m', '12m'].map((f) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-[#26bc71] text-white'
                  : 'bg-[#1a1a1a] text-gray-500 hover:text-white'
              }`}
            >
              {f === '6m' ? '6 tháng' : '12 tháng'}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26bc71" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#26bc71" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#revGrad)" />
        <polyline
          points={pts}
          fill="none"
          stroke="#26bc71"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {rawData.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r="3.5" fill="#26bc71" />
        ))}
      </svg>

      <div className={`grid gap-2 mt-3`} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {labels.map((l) => (
          <p key={l} className="text-center text-gray-600 text-xs">{l}</p>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-[#26bc71] rounded-full inline-block" />
          <span className="text-gray-500 text-xs">Doanh thu (triệu đ)</span>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white text-sm font-semibold">
            {(rawData[rawData.length - 1] * 1000000).toLocaleString('vi-VN')} ₫
          </p>
          <p className="text-gray-600 text-xs">tháng gần nhất</p>
        </div>
      </div>
    </Card>
  );
};

/* ── Donut chart (pure SVG) ─────────────────────────────────── */
const DonutChart = () => {
  const C = 376.99; // 2 * π * 60
  const segments = [
    { label: 'Tech Events',     pct: 40, color: '#26bc71', offset: 0           },
    { label: 'Music Concerts',  pct: 25, color: '#16a34a', offset: -150.80     },
    { label: 'Sports Games',    pct: 20, color: '#ca8a04', offset: -245.05     },
    { label: 'Arts & Theater',  pct: 15, color: '#eab308', offset: -320.45     },
  ];

  return (
    <Card>
      <SectionTitle>Doanh thu theo danh mục</SectionTitle>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <g transform="rotate(-90 80 80)">
              {segments.map((s) => (
                <circle
                  key={s.label}
                  cx="80" cy="80" r="60"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="22"
                  strokeDasharray={`${C * s.pct / 100} ${C}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="butt"
                />
              ))}
            </g>
            <text x="80" y="74" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">12.4k</text>
            <text x="80" y="91" textAnchor="middle" fill="#6b7280" fontSize="9">TOTAL</text>
          </svg>
        </div>

        <div className="w-full mt-4 space-y-2.5">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
              <span className="text-gray-400 text-xs flex-1">{s.label}</span>
              <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-1.5 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
              <span className="text-gray-300 text-xs w-7 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

/* ── User growth chart (pure SVG) ───────────────────────────── */
const UserGrowthChart = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const rawData = [2500, 3200, 4100, 5800, 7200, 9400];

  const W = 480, H = 130;
  const pad = { l: 10, r: 10, t: 10, b: 4 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;
  const minV = rawData[0] * 0.9;
  const maxV = rawData[rawData.length - 1] * 1.05;
  const n = rawData.length;

  const px = (i) => pad.l + (i / (n - 1)) * chartW;
  const py = (v) => pad.t + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const pts = rawData.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  const areaPath = `M${px(0)},${py(rawData[0])} ` +
    rawData.map((v, i) => `L${px(i)},${py(v)}`).join(' ') +
    ` L${px(n - 1)},${H} L${px(0)},${H} Z`;

  return (
    <Card>
      <SectionTitle>Tăng trưởng người dùng lũy kế</SectionTitle>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
        <defs>
          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#userGrad)" />
        <polyline
          points={pts}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {rawData.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r="3.5" fill="#8b5cf6" />
        ))}
      </svg>
      <div className="grid grid-cols-6 gap-2 mt-2">
        {labels.map((l) => (
          <p key={l} className="text-center text-gray-600 text-xs">{l}</p>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-violet-500 rounded-full inline-block" />
          <span className="text-gray-500 text-xs">Người dùng tích lũy</span>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white text-sm font-semibold">9,400</p>
          <p className="text-gray-600 text-xs">tháng gần nhất</p>
        </div>
      </div>
    </Card>
  );
};

/* ── Top events table ────────────────────────────────────────── */
const TOP_EVENTS = [
  { name: 'Tech Conference Vietnam', tickets: 430,  revenue: '215,000,000', change: '+18%',  up: true  },
  { name: 'Digital Marketing Webinar', tickets: 880, revenue: '362,440,000', change: '+24%', up: true  },
  { name: 'Concert 2024 Grand Stage', tickets: 120,  revenue: '108,000,000', change: '-5%',  up: false },
  { name: 'Art Exhibition 2024',      tickets: 0,    revenue: '0',           change: '0%',   up: true  },
  { name: 'Startup Meetup Pitch Day', tickets: 0,    revenue: '0',           change: '0%',   up: true  },
];

const TopEvents = () => (
  <Card>
    <SectionTitle>Sự kiện nổi bật</SectionTitle>
    <div className="space-y-3">
      {TOP_EVENTS.map((e, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
          <span className="w-5 text-gray-600 text-xs shrink-0">{i + 1}.</span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-xs font-medium truncate">{e.name}</p>
            <p className="text-gray-600 text-xs mt-0.5">{e.tickets.toLocaleString()} vé bán</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#26bc71] text-xs font-medium">{e.revenue} ₫</p>
            <p className={`text-xs ${e.up ? 'text-[#26bc71]' : 'text-red-400'}`}>{e.change}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

/* ── Recent activity ─────────────────────────────────────────── */
const ACTIVITIES = [
  { action: 'Sự kiện mới được duyệt',     target: 'Tech Conference Vietnam',  time: '2 phút trước',   dot: 'bg-[#26bc71]'   },
  { action: 'Người dùng đăng ký mới',     target: 'nguyen.van.a@gmail.com',   time: '15 phút trước',  dot: 'bg-violet-500'  },
  { action: 'Sự kiện bị từ chối',         target: 'Art Exhibition 2024',       time: '1 giờ trước',    dot: 'bg-red-400'     },
  { action: 'Thanh toán thành công',      target: '#ORD-20240315-0051',        time: '2 giờ trước',    dot: 'bg-blue-400'    },
  { action: 'Báo cáo vi phạm',            target: 'Startup Meetup Pitch Day',  time: '5 giờ trước',    dot: 'bg-yellow-400'  },
];

const RecentActivity = () => (
  <Card>
    <SectionTitle>Hoạt động gần đây</SectionTitle>
    <div className="space-y-4">
      {ACTIVITIES.map((a, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-gray-300 text-xs">{a.action}</p>
            <p className="text-gray-600 text-xs truncate mt-0.5">{a.target}</p>
          </div>
          <p className="text-gray-600 text-xs shrink-0">{a.time}</p>
        </div>
      ))}
    </div>
  </Card>
);

/* ── Page ────────────────────────────────────────────────────── */
const AdminAnalytics = () => {
  const [revenueFilter, setRevenueFilter] = useState('6m');

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-1.5">Thống kê &amp; Báo cáo</h2>
            <p className="text-gray-500 text-sm">Theo dõi hiệu suất sự kiện và tình trạng tài chính</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#222] border border-white/5 text-gray-400 hover:text-white text-sm transition-colors">
              <Printer size={15} /> In PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors">
              <Download size={15} /> Xuất CSV
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Tổng doanh thu"
            value="425.8M ₫"
            sub="Tích lũy toàn thời gian"
            change="+12.5%"
            positive={true}
            icon={DollarSign}
            iconColor="bg-[#26bc71]"
          />
          <StatCard
            label="Vé đã bán"
            value="12,450"
            sub="Tất cả sự kiện"
            change="+8.2%"
            positive={true}
            icon={Ticket}
            iconColor="bg-blue-600"
          />
          <StatCard
            label="Sự kiện đang hoạt động"
            value="38"
            sub="Trong 30 ngày qua"
            change="+5.1%"
            positive={true}
            icon={Calendar}
            iconColor="bg-violet-600"
          />
          <StatCard
            label="Người dùng mới"
            value="1,284"
            sub="Tháng này"
            change="-2.3%"
            positive={false}
            icon={Users}
            iconColor="bg-orange-600"
          />
        </div>

        {/* Revenue chart + Donut */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <RevenueChart filter={revenueFilter} onFilter={setRevenueFilter} />
          </div>
          <DonutChart />
        </div>

        {/* User growth + Top events */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <UserGrowthChart />
          </div>
          <TopEvents />
        </div>

        {/* Recent activity — full width */}
        <RecentActivity />

      </main>
    </div>
  );
};

export default AdminAnalytics;
