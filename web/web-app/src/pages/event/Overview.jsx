import React, { useState } from 'react';
import { Calendar, RefreshCw, X, Check } from 'lucide-react';

const Overview = () => {
  // State quản lý việc ẩn/hiện Modal đổi suất diễn
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State lưu trữ lựa chọn tạm thời trong Modal (Tháng và Suất diễn)
  const [selectedMonth, setSelectedMonth] = useState('01-2026');
  const [selectedShowtime, setSelectedShowtime] = useState('30 Tháng 01, 2026 - 07:00');

  return (
    <div className="max-w-[1200px] mx-auto text-gray-200 pb-20 relative">
      
      {/* ===== HEADER Ngày tháng & Nút Đổi suất diễn ===== */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center text-sm font-medium">
          <Calendar size={18} className="mr-3 text-gray-400" />
          <span>{selectedShowtime}</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} // Click mở Modal
          className="flex items-center gap-2 px-4 py-2 border border-[#00b14f] text-[#00b14f] rounded hover:bg-[#00b14f]/10 transition text-sm"
        >
          Đổi suất diễn <RefreshCw size={16} />
        </button>
      </div>

      {/* Tabs Doanh thu */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Doanh thu</h2>
        <div className="flex gap-2">
          <button className="px-5 py-1.5 bg-[#00b14f] text-white rounded-full text-sm font-medium">Doanh thu</button>
          <button className="px-5 py-1.5 border border-gray-600 text-gray-400 rounded-full text-sm hover:text-white transition">Doanh số bán lại vé</button>
        </div>
      </div>

      {/* Box Tổng quan */}
      <h3 className="font-bold mb-4">Tổng quan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Box Doanh thu */}
        <div className="bg-[#222328] rounded-xl p-6 border border-gray-800 flex justify-between items-center shadow-sm">
          <div>
            <div className="text-sm text-gray-400 mb-2">Doanh thu</div>
            <div className="text-2xl font-bold text-white mb-1">0đ</div>
            <div className="text-xs text-gray-500">Tổng: 80.000.000đ</div>
          </div>
          {/* Vòng tròn phần trăm giả lập */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="#3a3b40" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="36" stroke="#ffc107" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="226" />
            </svg>
            <span className="absolute text-[#ffc107] font-bold text-sm">0 %</span>
          </div>
        </div>

        {/* Box Số vé đã bán */}
        <div className="bg-[#222328] rounded-xl p-6 border border-gray-800 flex justify-between items-center shadow-sm">
          <div>
            <div className="text-sm text-gray-400 mb-2">Số vé đã bán</div>
            <div className="text-2xl font-bold text-white mb-1">0 vé</div>
            <div className="text-xs text-gray-500">Tổng: 200 vé</div>
          </div>
           {/* Vòng tròn phần trăm giả lập */}
           <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" stroke="#3a3b40" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="36" stroke="#ffc107" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="226" />
            </svg>
            <span className="absolute text-[#ffc107] font-bold text-sm">0 %</span>
          </div>
        </div>
      </div>

      {/* Biểu đồ giả lập */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></span> Doanh thu</div>
            <div className="flex items-center text-sm"><span className="w-3 h-3 rounded-full bg-[#00b14f] mr-2"></span> Số vé bán</div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1 border border-gray-600 text-gray-400 rounded-full text-xs hover:text-white transition">24 giờ</button>
            <button className="px-4 py-1 bg-[#00b14f] text-white rounded-full text-xs font-medium">30 ngày</button>
          </div>
        </div>

        {/* Khung chứa biểu đồ rỗng như thiết kế */}
        <div className="h-[300px] border-b border-l border-gray-700 relative">
          <div className="absolute w-full h-full flex flex-col justify-between">
            <div className="border-t border-gray-800 w-full h-0"></div>
            <div className="border-t border-gray-800 w-full h-0"></div>
            <div className="border-t border-gray-800 w-full h-0"></div>
            <div className="border-t border-gray-800 w-full h-0"></div>
            <div className="border-t border-gray-800 w-full h-0"></div>
          </div>
          <div className="absolute bottom-0 w-full h-[2px] bg-[#8b5cf6]"></div>
          
          <div className="absolute -left-12 h-full flex flex-col justify-between text-xs text-gray-500 py-1">
            <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
          </div>
          <div className="absolute -right-6 h-full flex flex-col justify-between text-xs text-gray-500 py-1">
            <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
          </div>

          <div className="absolute -bottom-8 w-full flex justify-between text-[10px] text-gray-500 px-2">
            <span className="-rotate-45 origin-top-left">23 tháng 12 25</span>
            <span className="-rotate-45 origin-top-left">25 tháng 12 25</span>
            <span className="-rotate-45 origin-top-left">27 tháng 12 25</span>
            <span className="-rotate-45 origin-top-left">29 tháng 12 25</span>
            <span className="-rotate-45 origin-top-left">31 tháng 12 25</span>
            <span className="-rotate-45 origin-top-left">2 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">4 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">6 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">8 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">10 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">12 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">14 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">16 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">18 tháng 1 26</span>
            <span className="-rotate-45 origin-top-left">20 tháng 1 26</span>
          </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 whitespace-nowrap">Doanh thu</div>
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 rotate-90 text-xs text-gray-500 whitespace-nowrap">Số vé bán</div>
        </div>
      </div>

      {/* Bảng Chi tiết Vé đã bán */}
      <h3 className="font-bold mb-4 mt-20">Chi tiết</h3>
      <h4 className="font-bold mb-4 text-sm text-gray-400">Vé đã bán</h4>
      
      <div className="bg-[#222328] rounded-xl overflow-hidden border border-gray-800 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 bg-[#2a2b31] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium border-r border-gray-800 w-1/3">Loại vé</th>
              <th className="px-6 py-4 font-medium text-center border-r border-gray-800">Giá bán</th>
              <th className="px-6 py-4 font-medium text-center border-r border-gray-800">Đã bán</th>
              <th className="px-6 py-4 font-medium text-center border-r border-gray-800 w-[100px]">Bị khoá</th>
              <th className="px-6 py-4 font-medium text-right w-1/4">Tỉ lệ bán</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800 last:border-0 hover:bg-[#2a2b31]/50 transition">
              <td className="px-6 py-4 font-bold text-white border-r border-gray-800">Vé xem đua xe</td>
              <td className="px-6 py-4 text-center border-r border-gray-800">400.000đ</td>
              <td className="px-6 py-4 text-center font-bold text-white border-r border-gray-800">0 / 200</td>
              <td className="px-6 py-4 text-center border-r border-gray-800">0</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffc107] w-[0%]"></div>
                  </div>
                  <span className="font-bold text-white">0%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* ======================================================== */}
      {/* MODAL DANH SÁCH SUẤT DIỄN (POPUP)                          */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          
          <div className="w-[500px] bg-[#222328] rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#2a2b31]">
              <div className="w-5"></div> {/* Spacer để cân bằng chữ giữa */}
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
                {/* Có thể map thêm các tháng khác ở đây */}
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
                
                {/* Dữ liệu giả lập 1 suất khác để test */}
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
                  // Ở đây bạn có thể gọi thêm logic fetch data biểu đồ mới theo selectedShowtime
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

export default Overview;