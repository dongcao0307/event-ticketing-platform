import React, { useState } from 'react';
import { Calendar, Info, Inbox } from 'lucide-react';
// Import component DatePicker đã tạo
import DatePickerPopup from '../../components/DatePickerPopup';

const Analytics = () => {
  // State quản lý ngày bắt đầu và kết thúc (Định dạng chuẩn của DatePicker là DD-MM-YYYY HH:mm)
  const [startDate, setStartDate] = useState('21-12-2025 00:00');
  const [endDate, setEndDate] = useState('20-01-2026 23:59');
  
  // State quản lý xem đang mở lịch cho ô nào ('start' hay 'end')
  const [activePicker, setActivePicker] = useState(null);

  // Hàm phụ trợ để chuyển đổi định dạng "21-12-2025 00:00" thành "21/12/2025" hiển thị ra UI
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split(' ')[0].replace(/-/g, '/');
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      
      {/* ===== HEADER & BỘ LỌC NGÀY ===== */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white mr-4">Công cụ & Báo cáo Marketing</h2>
        
        <div className="flex items-center gap-2">
          
          {/* Vùng chọn ngày */}
          <div className="relative flex items-center bg-white rounded text-sm px-3 py-1.5 border border-gray-200">
            {/* Click để chọn ngày bắt đầu */}
            <span 
              className="text-gray-600 font-medium cursor-pointer hover:text-[#00b14f] transition"
              onClick={() => setActivePicker(activePicker === 'start' ? null : 'start')}
            >
              {formatDisplayDate(startDate)}
            </span>
            
            <span className="mx-2 text-gray-400">→</span>
            
            {/* Click để chọn ngày kết thúc */}
            <span 
              className="text-gray-600 font-medium mr-4 cursor-pointer hover:text-[#00b14f] transition"
              onClick={() => setActivePicker(activePicker === 'end' ? null : 'end')}
            >
              {formatDisplayDate(endDate)}
            </span>
            
            {/* Icon lịch (Click mặc định mở ngày kết thúc hoặc bắt đầu tuỳ ý) */}
            <Calendar 
              size={16} 
              className="text-gray-400 cursor-pointer hover:text-black transition" 
              onClick={() => setActivePicker(activePicker ? null : 'start')}
            />

            {/* Gọi Popup Lịch cho Ngày bắt đầu */}
            <DatePickerPopup 
              isOpen={activePicker === 'start'} 
              onClose={() => setActivePicker(null)}
              value={startDate}
              onChange={(newDate) => {
                setStartDate(newDate);
                // Chọn xong ngày bắt đầu thì tự động chuyển sang chọn ngày kết thúc cho tiện
                setActivePicker('end'); 
              }}
            />

            {/* Gọi Popup Lịch cho Ngày kết thúc */}
            <DatePickerPopup 
              isOpen={activePicker === 'end'} 
              onClose={() => setActivePicker(null)}
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
            />
          </div>
          
          {/* Nút xác nhận */}
          <button 
            onClick={() => console.log(`Gọi API lấy data từ ${startDate} đến ${endDate}`)}
            className="bg-[#00b14f] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#009e47] transition"
          >
            Xác nhận
          </button>
        </div>
      </div>

      {/* ===== ROW 1: 4 THẺ THỐNG KÊ (NỀN TRẮNG) ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Số lượt truy cập */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Số lượt truy cập</span>
            <Info size={14} className="cursor-pointer hover:text-black transition" />
          </div>
          <div className="text-3xl font-light text-black">0</div>
        </div>

        {/* Người dùng */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Người dùng</span>
            <Info size={14} className="cursor-pointer hover:text-black transition" />
          </div>
          <div className="text-3xl font-light text-black">0</div>
        </div>

        {/* Người mua */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Người mua</span>
            <Info size={14} className="cursor-pointer hover:text-black transition" />
          </div>
          <div className="text-3xl font-light text-black">0</div>
        </div>

        {/* Tỉ lệ chuyển đổi */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Tỉ lệ chuyển đổi</span>
            <Info size={14} className="cursor-pointer hover:text-black transition" />
          </div>
          <div className="text-3xl font-light text-black">NaN %</div>
        </div>
      </div>

      {/* ===== ROW 2: BIỂU ĐỒ & LƯỢT TRUY CẬP THEO KÊNH ===== */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        
        {/* Khối biểu đồ (Trái) */}
        <div className="flex-1 bg-white rounded-lg p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-black font-bold mb-4">Lượt truy cập theo thời gian</h3>
          {/* Trạng thái trống của biểu đồ */}
          <div className="flex-1 border-b border-gray-200 flex items-end justify-center pb-2 relative mt-4">
            {/* Lưới ngang mờ giả lập */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-gray-100 w-full h-0"></div>
              <div className="border-t border-gray-100 w-full h-0"></div>
              <div className="border-t border-gray-100 w-full h-0"></div>
              <div className="border-t border-gray-100 w-full h-0"></div>
            </div>
            {/* Trục X */}
            <span className="text-xs text-gray-400 relative z-10">0</span>
          </div>
        </div>

        {/* Khối nguồn truy cập (Phải) */}
        <div className="w-full lg:w-[350px] bg-white rounded-lg p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-black font-bold">Số lượt truy cập theo kênh</h3>
            <Info size={16} className="text-gray-400 cursor-pointer" />
          </div>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            Các số liệu được hiển thị có thể không khớp với số liệu thực tế và chỉ mang tính chất tham khảo do giới hạn của các công cụ theo dõi web.
          </p>
          
          {/* Empty State: No data */}
          <div className="flex-1 border border-gray-200 rounded flex flex-col items-center justify-center text-gray-300 min-h-[200px]">
            <Inbox size={48} strokeWidth={1} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">No data</span>
          </div>
        </div>
      </div>

      {/* ===== ROW 3: BẢNG CHI TIẾT NGUỒN TRUY CẬP ===== */}
      <div className="bg-white rounded-lg p-6 shadow-sm min-h-[250px] flex flex-col">
        {/* Tiêu đề bảng */}
        <div className="grid grid-cols-2 text-sm font-bold text-black border-b border-gray-200 pb-4 mb-4">
          <div>Nguồn truy cập</div>
          <div>Tổng lượt truy cập</div>
        </div>
        
        {/* Empty State: No data */}
        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 py-10">
          <Inbox size={48} strokeWidth={1} className="mb-2 opacity-50" />
          <span className="text-sm font-medium">No data</span>
        </div>
      </div>

    </div>
  );
};

export default Analytics;