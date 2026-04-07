import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ShoppingCart,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',            to: '/admin' },
  { icon: Users,           label: 'Quản lý người dùng',  to: '/admin/users' },
  { icon: CalendarDays,    label: 'Quản lý sự kiện',     to: '/admin/events' },
  { icon: ShoppingCart,    label: 'Quản lý đơn hàng',    to: '/admin/orders' },
  { icon: BarChart3,       label: 'Thống kê & Báo cáo',  to: '/admin/analytics' },
];

const AdminSidebar = () => (
  <aside className="w-64 min-h-screen bg-[#111] flex flex-col shrink-0 border-r border-white/5">
    {/* Logo */}
    <div className="px-8 py-8">
      <h1 className="text-[#26bc71] text-2xl font-bold">Ticketbox</h1>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Admin Panel</p>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-4 space-y-1">
      {navItems.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-[#26bc71] text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* Profile */}
    <div className="p-6 border-t border-white/5 flex items-center gap-3">
      <div className="w-10 h-10 rounded bg-[#26bc71] flex items-center justify-center text-xs font-bold text-white shrink-0">
        AD
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-medium text-white truncate">Admin</p>
        <p className="text-[10px] text-gray-500 truncate">admin@ticketbox.vn</p>
      </div>
    </div>
  </aside>
);

export default AdminSidebar;
