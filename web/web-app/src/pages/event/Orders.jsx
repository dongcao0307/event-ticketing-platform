import React, { useState } from 'react';
import { Calendar, RefreshCw, Search, Download, Inbox, X, Check } from 'lucide-react';

const Orders = () => {
  // State quản lý Modal Đổi suất diễn
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State lưu trữ lựa chọn tạm thời trong Modal (Tháng và Suất diễn)
  const [selectedMonth, setSelectedMonth] = useState('01-2026');
  const [selectedShowtime, setSelectedShowtime] = useState('30 Tháng 01, 2026 - 07:00');

  return (
    <div className="max-w-[1200px] mx-auto text-gray-200 pb-20 relative">
      
      {/* ===== HEADER NGÀY THÁNG & NÚT ĐỔI SUẤT DIỄN ===== */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center text-sm font-medium">
          <Calendar size={18} className="mr-3 text-gray-400" />
          <span>{selectedShowtime}</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} // Mở Modal
          className="flex items-center gap-2 px-4 py-2 border border-[#00b14f] text-[#00b14f] rounded hover:bg-[#00b14f]/10 transition text-sm font-medium"
        >
          Đổi suất diễn <RefreshCw size={16} />
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Danh sách đơn hàng</h2>
      
      {/* Tabs Đơn hàng */}
      <div className="mb-6">
        <button className="px-5 py-1.5 bg-[#00b14f] text-white rounded-full text-sm font-medium">
          Đơn hàng
        </button>
      </div>

      {/* ===== Ô TÌM KIẾM ===== */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Tìm đơn hàng" 
          className="w-full pl-11 pr-4 py-2.5 bg-white text-black rounded outline-none focus:ring-2 focus:ring-[#00b14f] transition-all text-sm font-medium placeholder-gray-400"
        />
      </div>

      {/* ===== NÚT XUẤT BÁO CÁO ===== */}
      <div className="mb-8">
        <button className="flex items-center gap-2 bg-[#00b14f] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#009e47] transition shadow-sm">
          <Download size={16} />
          Xuất báo cáo
        </button>
      </div>

      {/* Số lượng đơn hàng */}
      <p className="font-bold text-sm mb-4 text-white">Có 0 đơn hàng</p>

      {/* ===== BẢNG DANH SÁCH (TABLE) ===== */}
      <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            
            {/* Table Header (Nền xám tối) */}
            <thead className="text-gray-200 bg-[#2a2b31] border-b border-gray-700">
              <tr>
                <th className="px-4 py-4 font-bold w-[50px] text-center">
                  <input type="checkbox" className="w-4 h-4 accent-[#00b14f] cursor-pointer" />
                </th>
                <th className="px-4 py-4 font-bold whitespace-nowrap">Mã đơn hàng</th>
                <th className="px-4 py-4 font-bold whitespace-nowrap">Ngày tạo đơn</th>
                <th className="px-4 py-4 font-bold whitespace-nowrap">Người mua</th>
                <th className="px-4 py-4 font-bold whitespace-nowrap">Giá trị đơn</th>
                <th className="px-4 py-4 font-bold whitespace-nowrap">Phương thức thanh toán</th>
                <th className="px-4 py-4 font-bold text-center whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            
            {/* Table Body (Nền trắng - Empty State) */}
            <tbody className="bg-white">
              <tr>
                <td colSpan="7" className="py-20">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Inbox size={48} strokeWidth={1} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">No data</span>
                  </div>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL DANH SÁCH SUẤT DIỄN (POPUP)                          */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          
          <div className="w-[500px] bg-[#222328] rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#2a2b31]">
              <div className="w-5"></div>
              <h3 className="text-white font-bold text-base">Danh sách suất diễn</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Chia 2 cột) */}
            <div className="flex h-[250px] bg-[#1c1d22]">
              
              {/* Cột trái: Chọn Tháng */}
              <div className="w-1/3 border-r border-gray-800 p-3 overflow-y-auto">
                <button 
                  onClick={() => setSelectedMonth('01-2026')}
                  className={`w-full text-left px-4 py-2.5 rounded font-medium text-sm transition-colors
                    ${selectedMonth === '01-2026' ? 'bg-[#00b14f] text-white' : 'text-gray-300 hover:bg-[#2a2b31]'}`}
                >
                  Th 01-2026
                </button>
              </div>

              {/* Cột phải: Chọn Giờ chi tiết */}
              <div className="flex-1 p-3 overflow-y-auto">
                <button 
                  onClick={() => setSelectedShowtime('30 Tháng 01, 2026 - 07:00')}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded text-sm font-medium transition-colors
                    ${selectedShowtime === '30 Tháng 01, 2026 - 07:00' ? 'text-[#00b14f]' : 'text-gray-300 hover:bg-[#2a2b31]'}`}
                >
                  <span>30 Tháng 01, 2026 - 07:00</span>
                  {selectedShowtime === '30 Tháng 01, 2026 - 07:00' && <Check size={18} />}
                </button>
                
                <button 
                  onClick={() => setSelectedShowtime('31 Tháng 01, 2026 - 19:00')}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded text-sm font-medium transition-colors
                    ${selectedShowtime === '31 Tháng 01, 2026 - 19:00' ? 'text-[#00b14f]' : 'text-gray-300 hover:bg-[#2a2b31]'}`}
                >
                  <span>31 Tháng 01, 2026 - 19:00</span>
                  {selectedShowtime === '31 Tháng 01, 2026 - 19:00' && <Check size={18} />}
                </button>
              </div>

            </div>

            {/* Footer Modal: Nút Xác nhận */}
            <div className="p-5 border-t border-gray-800 bg-[#222328]">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                }} 
                className="w-full py-2.5 bg-[#00b14f] hover:bg-[#009e47] text-white font-bold rounded transition shadow-lg"
              >
                Xác nhận
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;