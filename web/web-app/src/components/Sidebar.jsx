import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Star } from 'lucide-react';

const Sidebar = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('vi');

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <aside className="w-72 min-h-screen bg-[#15201b] font-sans border-r border-white/5 flex flex-col relative">
      
      {/* PHẦN 1: Header - Logo & Tiêu đề */}
      <div className="flex items-center gap-4 p-6 mb-4 shrink-0">
        <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-b from-[#75d88c] to-[#a1e55d] flex flex-col items-center justify-center shadow-lg shrink-0">
          <span className="text-white font-bold text-[11px] leading-tight tracking-tight">ticket</span>
          <span className="text-white font-bold text-[11px] leading-tight tracking-tight">box</span>
        </div>
        <h1 className="text-[#26bc71] text-2xl font-bold tracking-tight">
          Organizer Center
        </h1>
      </div>

      {/* PHẦN 2: Menu List */}
      <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
        
        {/* === ĐÃ SỬA ĐƯỜNG DẪN Ở ĐÂY === */}
        {/* Đổi từ /organizer/event/test-id sang /organizer/my-events */}
        <NavLink 
          to="/organizer/my-events" 
          className={({ isActive }) => `
            flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer
            ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
          `}
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Star size={16} fill="#111" strokeWidth={0} />
          </div>
          <span className="text-[#e2e8f0] text-[15px] font-medium">
            Sự kiện của tôi
          </span>
        </NavLink>
        {/* ================================ */}
        
      </nav>

      {/* PHẦN 3: Cài đặt ngôn ngữ */}
      <div className="p-6 shrink-0 mt-auto relative">
        <div className="flex items-center justify-between">
          <span className="text-[#e2e8f0] text-[15px] font-medium">Ngôn ngữ</span>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2.5 bg-[#475159] hover:bg-[#5a656e] transition-colors px-3 py-1.5 rounded-2xl cursor-pointer select-none"
          >
            <span className="text-white text-sm font-medium">
              {language === 'vi' ? 'Vie' : 'Eng'}
            </span>
            {language === 'vi' ? (
              <div className="w-6 h-4 bg-[#da251d] rounded-[3px] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-yellow-300 text-[10px] leading-none mb-[1px]">★</span>
              </div>
            ) : (
              <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" className="w-6 h-4 object-cover rounded-[3px] shrink-0" />
            )}
          </button>
        </div>

        {/* BẢNG CHỌN NGÔN NGỮ */}
        {isLangOpen && (
          <div className="absolute bottom-[72px] right-6 w-40 bg-[#1e2923] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => handleSelectLanguage('vi')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                language === 'vi' ? 'bg-[#26bc71] text-white font-medium' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>Tiếng Việt</span>
              <div className="w-5 h-3.5 bg-[#da251d] rounded-sm flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-yellow-300 text-[8px] leading-none mb-[1px]">★</span>
              </div>
            </button>
            <button
              onClick={() => handleSelectLanguage('en')}
              className={`w-full flex items-center justify-between px-3 py-2.5 mt-1 rounded-lg text-sm transition-colors ${
                language === 'en' ? 'bg-[#26bc71] text-white font-medium' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>English</span>
              <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;