import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PieChart, Megaphone, ReceiptText, Pencil, BadgePercent } from 'lucide-react';

// NHẬN PROPS TỪ COMPONENT CHA (EventDetailPage)
const EventSidebar = ({ activeTab, setActiveTab }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState('vi');

  return (
    <aside className="w-72 min-h-screen bg-[#15201b] font-sans border-r border-white/5 flex flex-col relative shrink-0">
      
      {/* PHẦN 1: Header - Logo & Tiêu đề */}
      <div className="flex items-center gap-4 p-6 shrink-0">
        <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-b from-[#75d88c] to-[#a1e55d] flex flex-col items-center justify-center shadow-lg shrink-0">
          <span className="text-white font-bold text-[9px] leading-tight tracking-tight">ticket</span>
          <span className="text-white font-bold text-[9px] leading-tight tracking-tight">box</span>
        </div>
        <h1 className="text-[#26bc71] text-xl font-bold tracking-tight">
          Organizer Center
        </h1>
      </div>

      {/* PHẦN 2: Nút Quay Lại (Điều hướng về Danh sách sự kiện) */}
      <div className="px-6 pb-4 shrink-0">
        <Link to="/organizer/my-events" className="flex items-center gap-3 text-white hover:text-[#26bc71] transition-colors font-bold text-[15px]">
          <ArrowLeft size={20} strokeWidth={2.5} />
          <span>Quản trị sự kiện</span>
        </Link>
      </div>

      {/* PHẦN 3: Menu List chi tiết */}
      <nav className="flex-1 px-4 flex flex-col gap-6 overflow-y-auto mt-2 pb-6 custom-scrollbar">
        
        {/* Nhóm 1: BÁO CÁO */}
        <div>
          <h3 className="text-gray-400 text-[13px] font-medium px-3 mb-2">Báo cáo</h3>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-[#26bc71]/10 text-[#26bc71]' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <PieChart size={18} />
              <span className="text-sm font-medium">Tổng kết</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-[#26bc71]/10 text-[#26bc71]' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <Megaphone size={18} />
              <span className="text-sm font-medium">Phân tích</span>
            </button>
          </div>
        </div>

        {/* Divider line */}
        <div className="h-[1px] w-full bg-white/10 my-[-8px]"></div>

        {/* Nhóm 2: CÀI ĐẶT SỰ KIỆN */}
        <div>
          <h3 className="text-gray-400 text-[13px] font-medium px-3 mb-2">Cài đặt sự kiện</h3>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#26bc71]/10 text-[#26bc71]' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <ReceiptText size={18} />
              <span className="text-sm font-medium">Danh sách đơn hàng</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('edit')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'edit' ? 'bg-[#26bc71]/10 text-[#26bc71]' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <Pencil size={18} />
              <span className="text-sm font-medium">Chỉnh sửa</span>
            </button>
          </div>
        </div>

        {/* Nhóm 3: MARKETING */}
        <div>
          <h3 className="text-gray-400 text-[13px] font-medium px-3 mb-2">Marketing</h3>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('voucher')} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'voucher' ? 'bg-[#26bc71]/10 text-[#26bc71]' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <BadgePercent size={18} />
              <span className="text-sm font-medium">Voucher</span>
            </button>
          </div>
        </div>
      </nav>

      {/* PHẦN 4: Cài đặt ngôn ngữ */}
      <div className="p-6 shrink-0 mt-auto relative border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[#e2e8f0] text-[15px] font-medium">Ngôn ngữ</span>
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2.5 bg-[#475159] hover:bg-[#5a656e] transition-colors px-3 py-1.5 rounded-2xl cursor-pointer select-none"
          >
            <span className="text-white text-sm font-medium">{language === 'vi' ? 'Vie' : 'Eng'}</span>
            {language === 'vi' ? (
              <div className="w-6 h-4 bg-[#da251d] rounded-[3px] flex items-center justify-center overflow-hidden shrink-0">
                <span className="text-yellow-300 text-[10px] leading-none mb-[1px]">★</span>
              </div>
            ) : (
              <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-6 h-4 object-cover rounded-[3px] shrink-0" />
            )}
          </button>
        </div>

        {/* Dropdown Ngôn ngữ */}
        {isLangOpen && (
          <div className="absolute bottom-[72px] right-6 w-40 bg-[#1e2923] border border-white/10 rounded-xl shadow-2xl p-1.5 z-50">
            <button onClick={() => {setLanguage('vi'); setIsLangOpen(false)}} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${language === 'vi' ? 'bg-[#26bc71] text-white font-medium' : 'text-gray-300 hover:bg-white/5'}`}>
              <span>Tiếng Việt</span>
              <div className="w-5 h-3.5 bg-[#da251d] rounded-sm flex items-center justify-center overflow-hidden shrink-0"><span className="text-yellow-300 text-[8px] leading-none mb-[1px]">★</span></div>
            </button>
            <button onClick={() => {setLanguage('en'); setIsLangOpen(false)}} className={`w-full flex items-center justify-between px-3 py-2.5 mt-1 rounded-lg text-sm transition-colors ${language === 'en' ? 'bg-[#26bc71] text-white font-medium' : 'text-gray-300 hover:bg-white/5'}`}>
              <span>English</span>
              <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
};

export default EventSidebar;