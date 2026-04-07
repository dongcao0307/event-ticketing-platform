import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, User } from 'lucide-react';

const EventHeader = () => {
  return (
    <header className="w-full h-[76px] bg-[#1a211e] flex items-center justify-between px-8 border-b border-white/5 font-sans">
      
      {/* BÊN TRÁI: Tiêu đề trang (MỚI THÊM) */}
      <div className="flex items-center">
        <h1 className="text-white text-[22px] font-bold tracking-wide">
          Sự kiện của tôi
        </h1>
      </div>

      {/* BÊN PHẢI: Giữ nguyên các nút chức năng */}
      <div className="flex items-center gap-6 shrink-0">
        <Link 
          to="/organizer" 
          className="flex items-center gap-1.5 bg-[#26bc71] hover:bg-[#23a861] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tạo sự kiện</span>
        </Link>

        <div className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-sm shrink-0 overflow-hidden">
            <User size={16} className="text-gray-400" />
          </div>
          <span className="text-[#e2e8f0] text-sm font-medium">Tài khoản</span>
          <ChevronDown size={14} className="text-gray-400 mt-0.5" />
        </div>
      </div>
      
    </header>
  );
};

export default EventHeader;