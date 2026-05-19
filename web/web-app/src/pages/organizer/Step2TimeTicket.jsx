import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, PlusCircle, X, Calendar as CalendarIcon, Trash2, Edit2 } from 'lucide-react';
import DatePickerPopup from '../../components/DatePickerPopup'; 

const Step2TimeTicket = ({ eventData, setEventData }) => {
  const [activeDatePicker, setActiveDatePicker] = useState(null);
  const [activeShowtimeForTicket, setActiveShowtimeForTicket] = useState(null);
  const [editingTicketIndex, setEditingTicketIndex] = useState(null); 

  const defaultTicket = { name: '', price: '', isFree: false, saleStart: '', saleEnd: '' };
  const [ticketData, setTicketData] = useState(defaultTicket);

  // --- [MỚI] STATE QUẢN LÝ LỖI RÀNG BUỘC ---
  const [showtimeErrors, setShowtimeErrors] = useState({});
  const [ticketErrors, setTicketErrors] = useState({});

  useEffect(() => {
    if (!eventData.performances || eventData.performances.length === 0) {
      setEventData(prev => ({
        ...prev,
        performances: [
          { id: 1, startTime: '', endTime: '', isEditing: true, tickets: [] }
        ]
      }));
    }
  }, []);

  const showtimes = eventData.performances || [];

  // ----------------------------------------------------------------
  // VŨ KHÍ TỐI THƯỢNG: ÉP CHUẨN NGÀY THÁNG CHO BACKEND
  // ----------------------------------------------------------------
  const forceISOFormat = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
      return dateStr.length === 16 ? `${dateStr}:00` : dateStr;
    }
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [day, month, year] = datePart.split('-');
      if (day && month && year) {
        return `${year}-${month}-${day}T${timePart}:00`;
      }
    }
    return dateStr; 
  };

  // ----------------------------------------------------------------
  // CÁC HÀM XỬ LÝ SỰ KIỆN (SUẤT DIỄN)
  // ----------------------------------------------------------------
  const toggleDatePicker = (pickerId) => {
    setActiveDatePicker(activeDatePicker === pickerId ? null : pickerId);
  };

  // [MỚI] Hàm Validate riêng cho Suất Diễn
  const validateShowtime = (id, field, newDateStr, currentShowtimes) => {
    const currentST = currentShowtimes.find(st => st.id === id);
    const updatedST = { ...currentST, [field]: forceISOFormat(newDateStr) };
    
    let errs = { ...showtimeErrors[id] };
    
    // Xóa lỗi cũ khi có update
    errs[field] = ''; 

    // Ràng buộc: Kết thúc phải sau Bắt đầu
    if (updatedST.startTime && updatedST.endTime) {
      if (new Date(updatedST.startTime) >= new Date(updatedST.endTime)) {
        errs.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
      } else {
        errs.endTime = ''; // Hết lỗi
      }
    }

    setShowtimeErrors(prev => ({ ...prev, [id]: errs }));
    return updatedST[field];
  };

  const handleUpdateShowtimeDate = (id, field, newDateStr) => {
    const validIsoDate = validateShowtime(id, field, newDateStr, showtimes);
    const updatedPerformances = showtimes.map(st => 
      st.id === id ? { ...st, [field]: validIsoDate } : st
    );
    setEventData({ ...eventData, performances: updatedPerformances });
  };

  const handleAddShowtime = () => {
    const updatedPerformances = showtimes.map(st => ({...st, isEditing: false}));
    setEventData({
      ...eventData,
      performances: [
        ...updatedPerformances, 
        { id: Date.now(), startTime: '', endTime: '', isEditing: true, tickets: [] }
      ]
    });
  };

  const toggleShowtimeEdit = (id) => {
    const updatedPerformances = showtimes.map(st => 
      st.id === id ? { ...st, isEditing: !st.isEditing } : st
    );
    setEventData({ ...eventData, performances: updatedPerformances });
  };

  const handleDeleteShowtime = (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("Bạn có chắc chắn muốn xóa suất diễn này không?")) {
      const updatedPerformances = showtimes.filter(st => st.id !== id);
      setEventData({ ...eventData, performances: updatedPerformances });
      
      // Xóa luôn lỗi của suất diễn này (nếu có)
      const newErrors = { ...showtimeErrors };
      delete newErrors[id];
      setShowtimeErrors(newErrors);
    }
  };

  // ----------------------------------------------------------------
  // CÁC HÀM XỬ LÝ SỰ KIỆN (LOẠI VÉ)
  // ----------------------------------------------------------------
  const handleEditTicket = (showtimeId, ticketIndex, ticket) => {
    setActiveShowtimeForTicket(showtimeId);
    setEditingTicketIndex(ticketIndex);
    setTicketData(ticket); 
    setTicketErrors({}); // Reset lỗi
  };

  const handleDeleteTicket = (showtimeId, ticketIndex) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại vé này?")) {
      const updatedPerformances = showtimes.map(st => {
        if (st.id === showtimeId) {
          const newTickets = [...(st.tickets || [])];
          newTickets.splice(ticketIndex, 1); 
          return { ...st, tickets: newTickets };
        }
        return st;
      });
      setEventData({ ...eventData, performances: updatedPerformances });
    }
  };

  // [MỚI] Rút gọn hàm thay đổi dữ liệu vé và tự động xóa lỗi
  const handleTicketChange = (field, value) => {
    setTicketData(prev => ({ ...prev, [field]: value }));
    if (ticketErrors[field]) {
      setTicketErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveTicket = () => {
    let errs = {};
    const parentShowtime = showtimes.find(st => st.id === activeShowtimeForTicket);

    // 1. Validate Tên vé
    if (!ticketData.name || !ticketData.name.trim()) errs.name = 'Vui lòng nhập tên vé';
    
    // 2. Validate Giá vé
    if (!ticketData.isFree && (!ticketData.price || isNaN(ticketData.price) || Number(ticketData.price) < 0)) {
      errs.price = 'Giá vé không hợp lệ';
    }

    // 3. Validate Thời gian bán vé
    if (!ticketData.saleStart) errs.saleStart = 'Vui lòng chọn ngày bắt đầu bán';
    if (!ticketData.saleEnd) errs.saleEnd = 'Vui lòng chọn ngày kết thúc bán';

    // 4. Validate Logic Thời gian chéo nhau
    if (ticketData.saleStart && ticketData.saleEnd) {
      if (new Date(ticketData.saleStart) >= new Date(ticketData.saleEnd)) {
        errs.saleEnd = 'Thời gian kết thúc bán phải sau thời gian bắt đầu';
      }
    }

    // 5. Ràng buộc Tối thượng: Vé phải ngừng bán trước khi Suất diễn bắt đầu
    if (ticketData.saleEnd && parentShowtime?.startTime) {
      if (new Date(ticketData.saleEnd) >= new Date(parentShowtime.startTime)) {
        errs.saleEnd = 'Vé phải ngừng bán TRƯỚC khi suất diễn bắt đầu';
      }
    } else if (!parentShowtime?.startTime) {
      errs.saleEnd = 'Vui lòng thiết lập Thời gian Suất diễn trước khi tạo vé';
    }

    // Nếu có lỗi thì block lại, show đỏ lên form
    if (Object.keys(errs).length > 0) {
      setTicketErrors(errs);
      return; 
    }
    
    const updatedPerformances = showtimes.map(st => {
      if (st.id === activeShowtimeForTicket) {
        const safeTickets = [...(st.tickets || [])];
        if (editingTicketIndex !== null) {
          safeTickets[editingTicketIndex] = ticketData;
        } else {
          safeTickets.push(ticketData);
        }
        return { ...st, tickets: safeTickets };
      }
      return st;
    });
    setEventData({ ...eventData, performances: updatedPerformances });
    closeTicketModal();
  };

  const closeTicketModal = () => {
    setTicketData(defaultTicket);
    setActiveShowtimeForTicket(null);
    setEditingTicketIndex(null);
    setTicketErrors({});
  };

  // ----------------------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------------------
  return (
    <div className="max-w-[1100px] mx-auto space-y-6 text-gray-200 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Thời Gian & Suất Diễn</h2>
      </div>
      <div className="space-y-4">
        {showtimes.map((showtime, index) => {
          const safeTickets = showtime.tickets || [];
          const currentErrs = showtimeErrors[showtime.id] || {};

          return (
            <div key={showtime.id}>
              {!showtime.isEditing && (
                <div 
                  className="bg-[#f0f0f0] text-black rounded-lg p-3 flex items-center justify-between cursor-pointer border border-transparent hover:border-gray-300 transition group" 
                  onClick={() => toggleShowtimeEdit(showtime.id)}
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown size={20} className="text-gray-500" />
                    <div>
                      <div className="font-bold text-sm">
                        {showtime.startTime ? `${showtime.startTime} - ${showtime.endTime}` : <span className="text-red-500">Chưa thiết lập thời gian</span>}
                      </div>
                      <div className="text-xs text-gray-600">{safeTickets.length} Loại vé đã tạo</div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteShowtime(showtime.id, e)}
                    className="p-2 hover:bg-red-100 rounded-full transition opacity-0 group-hover:opacity-100"
                    title="Xóa suất diễn"
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>
              )}
              {showtime.isEditing && (
                <div className="border border-gray-600 rounded-lg bg-[#1c1d22]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#222328]" onClick={() => toggleShowtimeEdit(showtime.id)}>
                    <div className="flex items-center text-sm font-medium cursor-pointer">
                      <ChevronUp size={18} className="mr-2" />
                      Suất diễn {index + 1}
                    </div>
                    <X size={18} className="text-red-500 cursor-pointer hover:text-red-400" onClick={(e) => handleDeleteShowtime(showtime.id, e)} />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="flex-1 relative">
                        <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Thời gian bắt đầu</label>
                        <div className="relative cursor-pointer" onClick={() => toggleDatePicker(`start_${showtime.id}`)}>
                          <input 
                            type="text" 
                            placeholder="DD-MM-YYYY HH:mm" 
                            readOnly 
                            value={showtime.startTime} 
                            className={`w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer transition-all ${currentErrs.startTime ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                          />
                          <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                        </div>
                        {currentErrs.startTime && <p className="text-red-500 text-xs mt-2">{currentErrs.startTime}</p>}
                        <DatePickerPopup isOpen={activeDatePicker === `start_${showtime.id}`} onClose={() => setActiveDatePicker(null)} value={showtime.startTime} onChange={(newDate) => handleUpdateShowtimeDate(showtime.id, 'startTime', newDate)} />
                      </div>
                      <div className="flex-1 relative">
                        <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Thời gian kết thúc</label>
                        <div className="relative cursor-pointer" onClick={() => toggleDatePicker(`end_${showtime.id}`)}>
                          <input 
                            type="text" 
                            placeholder="DD-MM-YYYY HH:mm" 
                            readOnly 
                            value={showtime.endTime} 
                            className={`w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer transition-all ${currentErrs.endTime ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                          />
                          <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                        </div>
                        {currentErrs.endTime && <p className="text-red-500 text-xs mt-2">{currentErrs.endTime}</p>}
                        <DatePickerPopup isOpen={activeDatePicker === `end_${showtime.id}`} onClose={() => setActiveDatePicker(null)} value={showtime.endTime} onChange={(newDate) => handleUpdateShowtimeDate(showtime.id, 'endTime', newDate)} />
                      </div>
                    </div>
                    {safeTickets.length > 0 && (
                      <div className="mb-6 space-y-2">
                        <label className="block text-sm font-bold text-gray-400">Các vé đã tạo:</label>
                        {safeTickets.map((t, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#2a2b31] p-3 rounded border border-gray-700 group transition-all hover:border-gray-500">
                            <div>
                              <span className="font-bold text-white mr-3">{t.name}</span>
                              <span className="text-[#00b14f] font-medium">{t.isFree ? 'Miễn phí' : `${t.price} VNĐ`}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEditTicket(showtime.id, idx, t)} 
                                className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 rounded transition"
                                title="Sửa vé"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteTicket(showtime.id, idx)} 
                                className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/30 rounded transition"
                                title="Xóa vé"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-800 pt-6 flex justify-center items-center">
                      <button 
                        onClick={() => { setActiveShowtimeForTicket(showtime.id); setTicketData(defaultTicket); setEditingTicketIndex(null); }} 
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
          );
        })}
      </div>
      <div className="flex justify-center mt-6 pt-4 border-t border-gray-800">
        <button onClick={handleAddShowtime} className="flex items-center text-[#00b14f] font-bold hover:text-[#009e47] transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Thêm suất diễn khác
        </button>
      </div>
      
      {/* ================= MODAL VÉ ================= */}
      {activeShowtimeForTicket !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#222328] w-[800px] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-700 relative">
              <h3 className="text-lg font-bold w-full text-center">
                {editingTicketIndex !== null ? 'Chỉnh sửa loại vé' : 'Tạo loại vé mới'}
              </h3>
              <button onClick={closeTicketModal} className="absolute right-6 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 relative">
                <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Tên vé</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Vé V.I.P" 
                  value={ticketData.name}
                  onChange={(e) => handleTicketChange('name', e.target.value)}
                  className={`w-full bg-white text-black text-sm p-3 rounded outline-none pr-12 transition-all ${ticketErrors.name ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                />
                {ticketErrors.name && <p className="text-red-500 text-xs mt-2">{ticketErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Giá vé</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="VNĐ"
                      value={ticketData.price}
                      onChange={(e) => handleTicketChange('price', e.target.value)}
                      disabled={ticketData.isFree}
                      className={`w-full bg-white text-black text-sm p-3 rounded outline-none disabled:bg-gray-300 transition-all ${ticketErrors.price ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                    />
                    <label className="flex items-center text-sm cursor-pointer mt-1">
                      <input 
                        type="checkbox" 
                        checked={ticketData.isFree}
                        onChange={(e) => handleTicketChange('isFree', e.target.checked, handleTicketChange('price', e.target.checked ? '0' : ''))}
                        className="mr-2 w-4 h-4 accent-[#00b14f]" 
                      />
                      Miễn phí
                    </label>
                    {ticketErrors.price && <p className="text-red-500 text-xs">{ticketErrors.price}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Tổng vé</label>
                  <input type="number" defaultValue="100" className="w-full bg-white text-black text-sm p-3 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tối thiểu</label>
                  <input type="number" defaultValue="1" className="w-full bg-white text-black text-sm p-3 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tối đa</label>
                  <input type="number" defaultValue="10" className="w-full bg-white text-black text-sm p-3 rounded outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Bắt đầu bán vé</label>
                  <div className="relative cursor-pointer" onClick={() => toggleDatePicker('ticket_start')}>
                    <input 
                      type="text" 
                      value={ticketData.saleStart} 
                      placeholder="DD-MM-YYYY HH:mm" 
                      className={`w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer transition-all ${ticketErrors.saleStart ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                      readOnly 
                    />
                    <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  {ticketErrors.saleStart && <p className="text-red-500 text-xs mt-2">{ticketErrors.saleStart}</p>}
                  <DatePickerPopup 
                    isOpen={activeDatePicker === 'ticket_start'} 
                    onClose={() => setActiveDatePicker(null)} 
                    value={ticketData.saleStart} 
                    onChange={(newDate) => handleTicketChange('saleStart', forceISOFormat(newDate))} 
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Kết thúc bán vé</label>
                  <div className="relative cursor-pointer" onClick={() => toggleDatePicker('ticket_end')}>
                    <input 
                      type="text" 
                      value={ticketData.saleEnd} 
                      placeholder="DD-MM-YYYY HH:mm" 
                      className={`w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer transition-all ${ticketErrors.saleEnd ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                      readOnly 
                    />
                    <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  {ticketErrors.saleEnd && <p className="text-red-500 text-xs mt-2">{ticketErrors.saleEnd}</p>}
                  <DatePickerPopup 
                    isOpen={activeDatePicker === 'ticket_end'} 
                    onClose={() => setActiveDatePicker(null)} 
                    value={ticketData.saleEnd} 
                    onChange={(newDate) => handleTicketChange('saleEnd', forceISOFormat(newDate))} 
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button onClick={closeTicketModal} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition">Hủy</button>
              <button onClick={handleSaveTicket} className="px-6 py-2 bg-[#00b14f] text-white font-bold rounded-lg hover:bg-[#009e47] transition">
                {editingTicketIndex !== null ? 'Lưu cập nhật' : 'Lưu Vé'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2TimeTicket;