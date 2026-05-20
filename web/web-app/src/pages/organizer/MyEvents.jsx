import React, { useState } from 'react';
import { 
  Search, 
  CalendarDays, 
  MapPin, 
  PieChart, 
  FileText, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 
import OrganizerHeader from '../../components/OrganizerHeader'; 
import appImage from '../../assets/hinh-anh-app.png';

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-gray-200 font-sans overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <OrganizerHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0e0e0e]">
          <div className="max-w-[1400px] mx-auto">
            
            <h1 className="text-2xl font-bold mb-6">Sự kiện của tôi</h1>

            <div className="flex flex-col xl:flex-row gap-6">
              
              {/* ========================================================= */}
              {/* CỘT TRÁI: DANH SÁCH SỰ KIỆN                                */}
              {/* ========================================================= */}
              <div className="flex-1 space-y-4">
                
                {/* THANH TÌM KIẾM & TABS */}
                <div className="flex flex-col md:flex-row gap-4 mb-2">
                  
                  {/* Ô tìm kiếm */}
                  <div className="flex w-full md:w-[350px] bg-white rounded-md overflow-hidden h-10">
                    <div className="pl-4 flex items-center justify-center text-gray-400">
                      <Search size={16} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm sự kiện" 
                      className="w-full py-2 px-3 text-sm text-black outline-none placeholder-gray-400"
                    />
                    <button className="px-5 bg-white text-black text-sm font-medium border-l border-gray-200 hover:bg-gray-50 transition whitespace-nowrap shrink-0">
  Tìm kiếm
</button>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-1 bg-white rounded-md overflow-hidden h-10">
                    <button 
                      onClick={() => setActiveTab('upcoming')}
                      className={`flex-1 py-2 text-sm font-medium transition ${activeTab === 'upcoming' ? 'bg-[#00b14f] text-white' : 'text-gray-600 hover:text-black'}`}
                    >
                      Sắp tới
                    </button>
                    <button 
                      onClick={() => setActiveTab('past')}
                      className={`flex-1 py-2 text-sm font-medium border-l border-gray-200 transition ${activeTab === 'past' ? 'bg-[#00b14f] text-white border-transparent' : 'text-gray-600 hover:text-black'}`}
                    >
                      Đã qua
                    </button>
                    <button 
                      onClick={() => setActiveTab('pending')}
                      className={`flex-1 py-2 text-sm font-medium border-l border-gray-200 transition ${activeTab === 'pending' ? 'bg-[#00b14f] text-white border-transparent' : 'text-gray-600 hover:text-black'}`}
                    >
                      Chờ duyệt
                    </button>
                    <button 
                      onClick={() => setActiveTab('draft')}
                      className={`flex-1 py-2 text-sm font-medium border-l border-gray-200 transition ${activeTab === 'draft' ? 'bg-[#00b14f] text-white border-transparent' : 'text-gray-600 hover:text-black'}`}
                    >
                      Nháp
                    </button>
                  </div>
                </div>

                {/* Banner Lưu ý */}
                {activeTab === 'pending' && (
                  <div className="bg-[#ffc107] text-black px-4 py-2 rounded-md text-sm text-center shadow-sm">
                    <span className="font-bold">Lưu ý:</span> Sự kiện đang chờ duyệt. Để đảm bảo tính bảo mật cho sự kiện của bạn, quyền truy cập vào trang chỉ dành cho chủ sở hữu và quản trị viên được ủy quyền
                  </div>
                )}

                {/* Event Card */}
                <div className="bg-[#222328] rounded-lg overflow-hidden border border-gray-800 mt-4">
                  <div className="p-4 flex gap-5">
                    {/* Hình ảnh sự kiện */}
                    <div className="w-[200px] h-[115px] bg-gray-700 rounded-md overflow-hidden shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=400&h=220" 
                        alt="Event Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Chi tiết */}
                    <div className="flex-1 py-1">
                      <h2 className="text-lg font-bold text-white mb-3">Sự kiện của tôi</h2>
                      <div className="space-y-2.5 text-sm text-gray-300">
                        <div className="flex items-center">
                          <CalendarDays size={16} className="mr-3 text-gray-400" />
                          <span>07:00, Thứ 6, 30 tháng 01 2026</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin size={16} className="mr-3 text-gray-400 mt-0.5" />
                          <div>
                            <span className="block font-medium text-white mb-0.5">Trường đua Đại Nam</span>
                            <span className="text-gray-400 text-xs">218 đường Lý Thường Kiệt, Phường Hiệp An, Thành Phố Thủ Dầu Một, Tỉnh Bình Dương</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thanh công cụ hành động */}
                  <div className="flex border-t border-gray-700 bg-[#2a2b31]/40">
                    <Link 
                      to="/organizer/event/123?tab=overview" 
                      className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-[#34353c] transition border-r border-gray-700 text-sm text-gray-300"
                    >
                      <PieChart size={18} /> Tổng quan
                    </Link>
                    <Link 
                      to="/organizer/event/123?tab=orders" 
                      className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-[#34353c] transition border-r border-gray-700 text-sm text-gray-300"
                    >
                      <FileText size={18} /> Đơn hàng
                    </Link>
                    <Link 
                      to="/organizer/event/123?tab=edit" 
                      className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-[#34353c] transition text-sm text-gray-300"
                    >
                      <Edit3 size={18} /> Chỉnh sửa
                    </Link>
                  </div>
                </div>

                {/* Phân trang */}
                <div className="flex justify-end items-center gap-2 pt-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#2a2b31] text-gray-400 hover:bg-gray-700 transition">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-white text-black font-medium">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-[#2a2b31] text-gray-400 hover:bg-gray-700 transition">
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>

              {/* ========================================================= */}
              {/* CỘT PHẢI: QUẢNG CÁO APP TICKETBOX EVENT MANAGER             */}
              {/* ========================================================= */}
              <div className="w-full xl:w-[320px] shrink-0">
                <div className="bg-[#1c1d22] rounded-xl p-6 border border-[#2a2b31] flex flex-col items-center">
                  
                  <div className="flex items-center gap-2 text-[#00b14f] font-bold text-sm mb-6 self-start">
                    <Megaphone size={18} /> Ticketbox Event Manager
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="font-bold text-xl text-white">Quét vé</h3>
                    <p className="text-[#00b14f] font-medium text-sm mt-1">nhanh chóng, dễ dàng</p>
                  </div>

                  {/* Hình ảnh điện thoại (Thay src bằng ảnh thật của dự án nếu có) */}
                  <div className="w-full flex justify-center mb-6">
                    {/* Đã thay src bằng biến appImage */}
                    <img 
                      src={appImage} 
                      alt="Ticketbox App Mockup" 
                      className="w-[220px] h-auto object-contain rounded-xl drop-shadow-lg"
                    />
                  </div>

                  {/* Dots Carousel */}
                  <div className="flex gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-[#00b14f]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  </div>

                  <p className="text-sm font-bold text-white mb-4 text-center">Tải ứng dụng Ticketbox Event Manager</p>

                  <div className="flex w-full gap-4 justify-center items-center">
                    {/* QR Code - Dùng link thật để tạo QR */}
                    <div className="w-[84px] h-[84px] bg-white p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                       <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ticketbox.vn" 
                        alt="QR Code" 
                        className="w-full h-full object-contain" 
                       />
                    </div>

                    {/* App Store / Google Play Badges */}
                    <div className="flex flex-col gap-2.5">
                      <a href="#" className="block hover:opacity-80 transition">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                          alt="Get it on Google Play" 
                          className="h-[36px] w-auto"
                        />
                      </a>
                      <a href="#" className="block hover:opacity-80 transition">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                          alt="Download on the App Store" 
                          className="h-[36px] w-auto"
                        />
                      </a>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyEvents;