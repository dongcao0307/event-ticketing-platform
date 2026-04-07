import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlusCircle, X, Calendar as CalendarIcon, ImageIcon, MoreVertical } from 'lucide-react';
// Import DatePickerPopup bạn đã tạo
import DatePickerPopup from '../../components/DatePickerPopup'; 

const Step2TimeTicket = () => {
  // State quản lý Modal tạo vé
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  // State quản lý việc mở Date Picker cho các ô input khác nhau
  const [activeDatePicker, setActiveDatePicker] = useState(null); 

  // State quản lý danh sách suất diễn (Showtimes)
  const [showtimes, setShowtimes] = useState([
    { 
      id: 1, 
      startTime: '30-01-2026 07:00', 
      endTime: '15-01-2027 20:00', 
      isEditing: true,
      tickets: [] 
    }
  ]);

  // State cho Form bên trong Modal Tạo vé
  const [ticketData, setTicketData] = useState({
    name: '',
    price: '',
    isFree: false,
    saleStart: '22-01-2026 17:59',
    saleEnd: '30-01-2026 07:00'
  });

  // ----------------------------------------------------------------
  // CÁC HÀM XỬ LÝ SỰ KIỆN
  // ----------------------------------------------------------------

  // Toggle Date Picker
  const toggleDatePicker = (pickerId) => {
    setActiveDatePicker(activeDatePicker === pickerId ? null : pickerId);
  };

  // Cập nhật ngày giờ cho một Suất diễn cụ thể
  const handleUpdateShowtimeDate = (id, field, newDateStr) => {
    setShowtimes(showtimes.map(st => 
      st.id === id ? { ...st, [field]: newDateStr } : st
    ));
  };

  // Thêm một suất diễn mới
  const handleAddShowtime = () => {
    // Đóng form của các suất diễn cũ
    const updatedShowtimes = showtimes.map(st => ({...st, isEditing: false}));
    
    // Thêm suất diễn mới vào cuối, để trạng thái là isEditing = true
    setShowtimes([
      ...updatedShowtimes, 
      { 
        id: Date.now(), 
        startTime: '', 
        endTime: '', 
        isEditing: true,
        tickets: []
      }
    ]);
  };

  // Thu gọn/Mở rộng một block suất diễn
  const toggleShowtimeEdit = (id) => {
    setShowtimes(showtimes.map(st => 
      st.id === id ? { ...st, isEditing: !st.isEditing } : st
    ));
  };

  // ----------------------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------------------
  return (
    <div className="max-w-[1100px] mx-auto space-y-6 text-gray-200 pb-20">
      
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Thời Gian</h2>
        <div className="relative">
          <select className="appearance-none bg-white text-black px-4 py-2 pr-10 rounded text-sm outline-none cursor-pointer min-w-[120px]">
            <option>Tất cả</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* ===== DANH SÁCH SUẤT DIỄN ===== */}
      <div className="space-y-4">
        {showtimes.map((showtime, index) => (
          <div key={showtime.id}>
            
            {/* TH 1: Block đang bị thu gọn (Chỉ xem) */}
            {!showtime.isEditing && (
              <div 
                className="bg-[#f0f0f0] text-black rounded-lg p-3 flex items-center justify-between cursor-pointer border border-transparent hover:border-gray-300 transition" 
                onClick={() => toggleShowtimeEdit(showtime.id)}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown size={20} className="text-gray-500" />
                  <div>
                    <div className="font-bold text-sm">{showtime.startTime || 'Chưa thiết lập'}</div>
                    <div className="text-xs text-gray-600">{showtime.tickets.length} Loại vé</div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-full transition">
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
              </div>
            )}

            {/* TH 2: Block đang mở Form chỉnh sửa (Viền đỏ) */}
            {showtime.isEditing && (
              <div className="border border-red-900 rounded-lg  bg-[#1c1d22]">
                
                {/* Header Block */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#222328]" onClick={() => toggleShowtimeEdit(showtime.id)}>
                  <div className="flex items-center text-sm font-medium cursor-pointer">
                    <ChevronUp size={18} className="mr-2" />
                    Ngày sự kiện
                  </div>
                  <X size={18} className="text-red-500 cursor-pointer hover:text-red-400" />
                </div>

                {/* Nội dung Block */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    
                    {/* Input Thời gian bắt đầu */}
                    <div className="flex-1 relative">
                      <label className="block text-sm font-bold mb-2">Thời gian bắt đầu</label>
                      <div className="relative cursor-pointer" onClick={() => toggleDatePicker(`start_${showtime.id}`)}>
                        <input 
                          type="text" 
                          placeholder="Select date" 
                          readOnly 
                          value={showtime.startTime} 
                          className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" 
                        />
                        <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                      </div>
                      <DatePickerPopup 
                        isOpen={activeDatePicker === `start_${showtime.id}`} 
                        onClose={() => setActiveDatePicker(null)} 
                        value={showtime.startTime}
                        onChange={(newDate) => handleUpdateShowtimeDate(showtime.id, 'startTime', newDate)}
                      />
                    </div>

                    {/* Input Thời gian kết thúc */}
                    <div className="flex-1 relative">
                      <label className="block text-sm font-bold mb-2">Thời gian kết thúc</label>
                      <div className="relative cursor-pointer" onClick={() => toggleDatePicker(`end_${showtime.id}`)}>
                        <input 
                          type="text" 
                          placeholder="Select date" 
                          readOnly 
                          value={showtime.endTime} 
                          className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" 
                        />
                        <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                      </div>
                      <DatePickerPopup 
                        isOpen={activeDatePicker === `end_${showtime.id}`} 
                        onClose={() => setActiveDatePicker(null)} 
                        value={showtime.endTime}
                        onChange={(newDate) => handleUpdateShowtimeDate(showtime.id, 'endTime', newDate)}
                      />
                    </div>
                  </div>

                  {/* Khu vực tạo vé */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-gray-400">
                      <span className="text-red-500 mr-1">*</span>Loại vé
                    </label>
                    {/* Chỉ hiện nút copy nếu không phải suất diễn đầu tiên */}
                    {index > 0 && (
                      <button className="px-4 py-1.5 border border-[#00b14f] text-[#00b14f] text-sm rounded hover:bg-[#00b14f]/10 transition mb-4">
                        Copy loại vé từ
                      </button>
                    )}
                  </div>

                  {/* Nút Tạo loại vé mới */}
                  <div className="border-t border-gray-800 pt-6 flex justify-center">
                    <button 
                      onClick={() => setIsTicketModalOpen(true)} 
                      className="flex items-center text-[#00b14f] font-medium hover:text-[#009e47] transition-colors"
                    >
                      <PlusCircle size={20} className="mr-2" />
                      Tạo loại vé mới
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* ===== NÚT TẠO SUẤT DIỄN ===== */}
      <div className="flex justify-center mt-6 pt-4 border-t border-gray-800">
        <button onClick={handleAddShowtime} className="flex items-center text-[#00b14f] font-bold hover:text-[#009e47] transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Tạo suất diễn
        </button>
      </div>


      {/* ========================================= */}
      {/* MODAL "TẠO LOẠI VÉ MỚI"                   */}
      {/* ========================================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#222328] w-[800px] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 relative">
              <h3 className="text-lg font-bold w-full text-center">Tạo loại vé mới</h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="absolute right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 ">
              
              <div className="mb-6 relative">
                <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Tên vé</label>
                <input 
                  type="text" 
                  placeholder="Tên vé" 
                  value={ticketData.name}
                  onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                  className="w-full bg-white text-black text-sm p-3 rounded outline-none pr-12" 
                />
                <span className="absolute right-3 bottom-3 text-gray-400 text-xs">0 / 50</span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Giá vé</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={ticketData.price}
                      onChange={(e) => setTicketData({...ticketData, price: e.target.value})}
                      disabled={ticketData.isFree}
                      className="w-full bg-white text-black text-sm p-3 rounded outline-none disabled:bg-gray-200" 
                    />
                    <label className="flex items-center text-sm whitespace-nowrap cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={ticketData.isFree}
                        onChange={(e) => setTicketData({...ticketData, isFree: e.target.checked, price: e.target.checked ? '0' : ''})}
                        className="mr-2 w-4 h-4 accent-[#00b14f]" 
                      />
                      Miễn phí
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Tổng số lượng vé</label>
                  <input type="text" defaultValue="10" className="w-full bg-white text-black text-sm p-3 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Số vé tối thiểu...</label>
                  <input type="text" defaultValue="1" className="w-full bg-white text-black text-sm p-3 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Số vé tối đa...</label>
                  <input type="text" defaultValue="10" className="w-full bg-white text-black text-sm p-3 rounded outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Input Bắt đầu bán vé */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Thời gian bắt đầu bán vé</label>
                  <div className="relative cursor-pointer" onClick={() => toggleDatePicker('ticket_start')}>
                    <input 
                      type="text" 
                      value={ticketData.saleStart} 
                      className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" 
                      readOnly 
                    />
                    <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  <DatePickerPopup 
                    isOpen={activeDatePicker === 'ticket_start'} 
                    onClose={() => setActiveDatePicker(null)}
                    value={ticketData.saleStart}
                    onChange={(newDate) => setTicketData({...ticketData, saleStart: newDate})}
                  />
                </div>
                
                {/* Input Kết thúc bán vé */}
                <div className="relative">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Thời gian kết thúc bán vé</label>
                  <div className="relative cursor-pointer" onClick={() => toggleDatePicker('ticket_end')}>
                    <input 
                      type="text" 
                      value={ticketData.saleEnd} 
                      className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" 
                      readOnly 
                    />
                    <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  <DatePickerPopup 
                    isOpen={activeDatePicker === 'ticket_end'} 
                    onClose={() => setActiveDatePicker(null)}
                    value={ticketData.saleEnd}
                    onChange={(newDate) => setTicketData({...ticketData, saleEnd: newDate})}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <label className="block text-sm font-bold mb-2">Thông tin vé</label>
                  <textarea placeholder="Description" className="w-full bg-white text-black text-sm p-3 rounded outline-none h-[120px] resize-none pr-12"></textarea>
                  <span className="absolute right-3 bottom-3 text-gray-400 text-xs">0 / 1000</span>
                </div>
                <div className="w-[200px]">
                  <label className="block text-sm font-bold mb-2">Hình ảnh vé</label>
                  <div className="border-2 border-dashed border-gray-500 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition cursor-pointer flex flex-col items-center justify-center h-[120px]">
                    <div className="text-[#00b14f] mb-1"><ImageIcon size={24} /></div>
                    <p className="text-center text-sm text-gray-300 font-bold">Thêm</p>
                    <p className="text-center text-xs text-gray-400">1MB</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700">
              <button 
                onClick={() => setIsTicketModalOpen(false)} 
                className="w-full py-3 bg-[#00b14f] text-white font-bold rounded-lg hover:bg-[#009e47] transition"
              >
                Lưu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Step2TimeTicket;