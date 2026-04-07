import React from 'react';
import { X, Edit3, Lock, Unlock, Mail, Phone, Calendar, ShoppingCart, CalendarDays } from 'lucide-react';

const AVATAR_COLORS = ['#0d9488','#059669','#047857','#0e7490','#065f46','#0f766e'];

const formatPhone = (phone) =>
  '+84 ' + phone.slice(1, 4) + ' ' + phone.slice(4, 7) + ' ' + phone.slice(7);

const UserDetailModal = ({ user, onClose, onAction }) => {
  const eventCount  = ((user.id * 3) % 19) + 1;
  const orderCount  = ((user.id * 7) % 24) + 1;
  const avatarColor = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
  const isActive    = user.status === 'Hoạt động';

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#222] rounded-2xl w-[360px] shadow-2xl border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <span className="text-white font-semibold">Chi tiết người dùng</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {/* Avatar + name + status */}
        <div className="flex flex-col items-center pt-6 pb-5 px-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg"
            style={{ backgroundColor: avatarColor }}
          >
            {user.initials}
          </div>
          <p className="text-white font-bold text-lg">{user.name}</p>
          <span className={`mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-[#26bc71]/20 text-[#26bc71]' : 'bg-red-500/20 text-red-400'}`}>
            {user.status}
          </span>
        </div>

        {/* Basic info */}
        <div className="px-5 pb-4">
          <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mb-3">Thông tin cơ bản</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0"><Mail size={13} className="text-gray-500" /></div>
              <div>
                <p className="text-gray-500 text-[11px]">Email</p>
                <p className="text-gray-200 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0"><Phone size={13} className="text-gray-500" /></div>
              <div>
                <p className="text-gray-500 text-[11px]">Số điện thoại</p>
                <p className="text-gray-200 text-sm">{formatPhone(user.phone)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#2a2a2a] flex items-center justify-center shrink-0"><Calendar size={13} className="text-gray-500" /></div>
              <div>
                <p className="text-gray-500 text-[11px]">Ngày tạo tài khoản</p>
                <p className="text-gray-200 text-sm">{user.created}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 pb-5">
          <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mb-3">Thống kê</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1"><CalendarDays size={12} className="text-gray-500" /><p className="text-gray-500 text-xs">Sự kiện</p></div>
              <p className="text-white text-2xl font-bold">{eventCount}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1"><ShoppingCart size={12} className="text-gray-500" /><p className="text-gray-500 text-xs">Đơn hàng</p></div>
              <p className="text-[#26bc71] text-2xl font-bold">{orderCount}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="px-5 pb-5 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2a2a2a] text-gray-300 hover:bg-[#333] text-sm font-medium transition-colors">
            <Edit3 size={14} /> Chỉnh sửa
          </button>
          <button
            onClick={() => onAction('toggle', user)}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-[#26bc71] hover:bg-[#1ea860]'}`}
          >
            {isActive ? <Lock size={14} /> : <Unlock size={14} />}
            {isActive ? 'Khóa' : 'Mở khóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;