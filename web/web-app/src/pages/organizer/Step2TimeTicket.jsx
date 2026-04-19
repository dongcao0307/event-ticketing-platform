import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, PlusCircle, X, Calendar as CalendarIcon, ImageIcon, MoreVertical, PencilLine } from 'lucide-react';
// Import DatePickerPopup bạn đã tạo
import DatePickerPopup from '../../components/DatePickerPopup';
import { useEvent } from '../../hooks/useEvent';

const Step2TimeTicket = () => {
  const {
    eventPerformances,
    ticketTypes,
    addPerformance,
    updatePerformanceTime,
    addTicketType,
    updateTicketType,
    upsertTicktTypesDB,
  } = useEvent();

  // State quản lý Modal tạo vé
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  
  // State quản lý việc mở Date Picker cho các ô input khác nhau
  const [activeDatePicker, setActiveDatePicker] = useState(null); 
  const [currentShowtimeId, setCurrentShowtimeId] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSavingToDB, setIsSavingToDB] = useState(false);
  const [performanceEditState, setPerformanceEditState] = useState({});

  const showtimes = eventData.performances || [];

  const showtimes = useMemo(() => {
    return eventPerformances.map((performance) => ({
      id: performance.id,
      startTime: performance.startTime || '',
      endTime: performance.entTime || '',
      isEditing: performanceEditState[performance.id] ?? true,
      tickets: ticketTypes.filter((ticket) => Number(ticket.performanceId) === Number(performance.id)),
    }));
  }, [eventPerformances, ticketTypes, performanceEditState]);

  // ----------------------------------------------------------------
  // CÁC HÀM XỬ LÝ SỰ KIỆN (SUẤT DIỄN)
  // ----------------------------------------------------------------

  const resetTicketForm = () => {
    setTicketData({
      name: '',
      price: '',
      isFree: false,
      saleStart: '22-01-2026 17:59',
      saleEnd: '30-01-2026 07:00'
    });
    setEditingTicketId(null);
  };

  // Toggle Date Picker
  const toggleDatePicker = (pickerId) => {
    setActiveDatePicker(activeDatePicker === pickerId ? null : pickerId);
  };

  const handleUpdateShowtimeDate = (id, field, newDateStr) => {
    const updatedPerformances = showtimes.map(st => 
      st.id === id ? { ...st, [field]: newDateStr } : st
    );
    setEventData({ ...eventData, performances: updatedPerformances });
    updatePerformanceTime({ id, field, value: newDateStr });
  };

  const handleAddShowtime = () => {
    const newShowtimeId = eventPerformances.length;
    addPerformance();
    const nextEditState = {};
    showtimes.forEach((showtime) => {
      nextEditState[showtime.id] = false;
    });
    nextEditState[newShowtimeId] = true;
    setPerformanceEditState(nextEditState);
    setCurrentShowtimeId(newShowtimeId);
  };

  const getShowtimeById = (showtimeId) => showtimes.find((showtime) => showtime.id === showtimeId);

  const openTicketModal = (showtimeId) => {
    const targetShowtime = getShowtimeById(showtimeId);
    if (!targetShowtime?.startTime || !targetShowtime?.endTime) {
      setErrorMessage('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }

    setErrorMessage('');
    setCurrentShowtimeId(showtimeId);
    resetTicketForm();
    setIsTicketModalOpen(true);
  };

  const openEditTicketModal = (showtimeId, ticket) => {
    setErrorMessage('');
    setCurrentShowtimeId(showtimeId);
    setEditingTicketId(ticket.fakeId ?? null);
    setTicketData({
      name: ticket.name ?? '',
      price: ticket.price ? String(ticket.price) : '',
      isFree: Number(ticket.price) === 0,
      saleStart: '22-01-2026 17:59',
      saleEnd: '30-01-2026 07:00'
    });
    setIsTicketModalOpen(true);
  };

  const handleSaveTicketType = () => {
    const targetShowtime = getShowtimeById(currentShowtimeId);
    if (!targetShowtime?.startTime || !targetShowtime?.endTime) {
      setErrorMessage('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }

    if (!ticketData.name.trim()) {
      setErrorMessage('Vui lòng nhập tên vé');
      return;
    }

    const payload = {
      performanceId: currentShowtimeId,
      name: ticketData.name.trim(),
      price: ticketData.isFree ? 0 : Number(ticketData.price || 0),
      totalQuantity: 10,
      maxTicketsPerUser: 10,
      version: 0,
    };

    if (editingTicketId !== null) {
      updateTicketType({ fakeId: editingTicketId, ...payload });
    } else {
      addTicketType(payload);
    }

    setIsTicketModalOpen(false);
    setEditingTicketId(null);
    resetTicketForm();
  };

  const handleSaveTicketTypesToDB = async () => {
    if (!ticketTypes.length) {
      setErrorMessage('Chưa có ticket type nào để lưu');
      return;
    }

    try {
      setIsSavingToDB(true);
      await upsertTicktTypesDB(ticketTypes);
      setErrorMessage('');
      window.alert('Đã upsert ticket type xuống database');
    } catch (error) {
      setErrorMessage(error?.message || 'Không thể upsert ticket type xuống database');
    } finally {
      setIsSavingToDB(false);
    }
  };

  const toggleShowtimeEdit = (id) => {
    setPerformanceEditState((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? true),
    }));
  };

  // ----------------------------------------------------------------
  // RENDER UI
  // ----------------------------------------------------------------
  return (
    <div className="max-w-[1100px] mx-auto space-y-6 text-gray-200 pb-20">
      {errorMessage && (
        <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-md bg-red-500 px-5 py-3 text-white shadow-lg flex items-center gap-2">
          <X size={18} />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Thời Gian & Suất Diễn</h2>
      </div>

      {/* ===== DANH SÁCH SUẤT DIỄN ===== */}
      <div className="space-y-4">
        {showtimes.map((showtime, index) => {
          const safeTickets = showtime.tickets || [];

          return (
            <div key={showtime.id}>
              
              {/* TH 1: Block đang bị thu gọn (Chỉ xem) */}
              {!showtime.isEditing && (
                <div 
                  className="bg-[#f0f0f0] text-black rounded-lg p-3 flex items-center justify-between cursor-pointer border border-transparent hover:border-gray-300 transition group" 
                  onClick={() => toggleShowtimeEdit(showtime.id)}
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown size={20} className="text-gray-500" />
                    <div>
                      <div className="font-bold text-sm">
                        {showtime.startTime ? `${showtime.startTime} - ${showtime.endTime}` : 'Chưa thiết lập thời gian'}
                      </div>
                      <div className="text-xs text-gray-600">{safeTickets.length} Loại vé đã tạo</div>
                    </div>
                  </div>
                  {/* [SỬA]: Đổi icon 3 chấm thành icon Thùng rác để xóa suất diễn */}
                  <button 
                    onClick={(e) => handleDeleteShowtime(showtime.id, e)}
                    className="p-2 hover:bg-red-100 rounded-full transition opacity-0 group-hover:opacity-100"
                    title="Xóa suất diễn"
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>
              )}

              {/* TH 2: Block đang mở Form chỉnh sửa */}
              {showtime.isEditing && (
                <div className="border border-gray-600 rounded-lg bg-[#1c1d22]">
                  
                  {/* Header Block */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#222328]" onClick={() => toggleShowtimeEdit(showtime.id)}>
                    <div className="flex items-center text-sm font-medium cursor-pointer">
                      <ChevronUp size={18} className="mr-2" />
                      Suất diễn {index + 1}
                    </div>
                    {/* Nút X màu đỏ góc phải -> Xóa suất diễn */}
                    <X size={18} className="text-red-500 cursor-pointer hover:text-red-400" onClick={(e) => handleDeleteShowtime(showtime.id, e)} />
                  </div>

                  {/* Nội dung Block */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      {/* Input Thời gian bắt đầu */}
                      <div className="flex-1 relative">
                        <label className="block text-sm font-bold mb-2">Thời gian bắt đầu</label>
                        <div className="relative cursor-pointer" onClick={() => toggleDatePicker(`start_${showtime.id}`)}>
                          <input type="text" placeholder="DD-MM-YYYY HH:mm" readOnly value={showtime.startTime} className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" />
                          <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                        </div>
                        <DatePickerPopup isOpen={activeDatePicker === `start_${showtime.id}`} onClose={() => setActiveDatePicker(null)} value={showtime.startTime} onChange={(newDate) => handleUpdateShowtimeDate(showtime.id, 'startTime', newDate)} />
                      </div>

                      {/* Input Thời gian kết thúc */}
                      <div className="flex-1 relative">
                        <label className="block text-sm font-bold mb-2">Thời gian kết thúc</label>
                        <div className="relative cursor-pointer" onClick={() => toggleDatePicker(`end_${showtime.id}`)}>
                          <input type="text" placeholder="DD-MM-YYYY HH:mm" readOnly value={showtime.endTime} className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" />
                          <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                        </div>
                        <DatePickerPopup isOpen={activeDatePicker === `end_${showtime.id}`} onClose={() => setActiveDatePicker(null)} value={showtime.endTime} onChange={(newDate) => handleUpdateShowtimeDate(showtime.id, 'endTime', newDate)} />
                      </div>
                    </div>

                  {/* Khu vực tạo vé */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-gray-400">
                      <span className="text-red-500 mr-1">*</span>Loại vé
                    </label>
                    <div className="space-y-3 mb-4">
                      {showtime.tickets.map((ticket) => (
                        <div key={ticket.fakeId ?? ticket.id} className="flex items-center justify-between rounded-lg bg-[#4b4f5a] px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-gray-200 text-lg leading-none">≡</span>
                            <span className="text-gray-200 text-sm font-semibold truncate">{ticket.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => openEditTicketModal(showtime.id, ticket)}
                              className="w-9 h-9 rounded-md bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <PencilLine size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Chỉ hiện nút copy nếu không phải suất diễn đầu tiên */}
                    {index > 0 && (
                      <button className="px-4 py-1.5 border border-[#00b14f] text-[#00b14f] text-sm rounded hover:bg-[#00b14f]/10 transition mb-4">
                        Copy loại vé từ
                      </button>
                    )}

                  {/* Nút Tạo loại vé mới */}
                  <div className="border-t border-gray-800 pt-6 flex justify-center">
                    <button 
                      onClick={() => openTicketModal(showtime.id)} 
                      className="flex items-center text-[#00b14f] font-medium hover:text-[#009e47] transition-colors"
                    >
                      <PlusCircle size={20} className="mr-2" />
                      Tạo loại vé mới
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* ===== NÚT TẠO SUẤT DIỄN ===== */}
      <div className="flex justify-center mt-6 pt-4 border-t border-gray-800">
        <button onClick={handleAddShowtime} className="flex items-center text-[#00b14f] font-bold hover:text-[#009e47] transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Thêm suất diễn khác
        </button>
      </div>

      <div className="flex justify-center mt-2">
        <button
          onClick={handleSaveTicketTypesToDB}
          disabled={isSavingToDB}
          className="px-6 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition disabled:opacity-60"
        >
          {isSavingToDB ? 'Đang lưu...' : 'Upsert ticket type xuống DB'}
        </button>
      </div>


      {/* ========================================= */}
      {/* MODAL "TẠO/SỬA LOẠI VÉ"                   */}
      {/* ========================================= */}
      {activeShowtimeForTicket !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#222328] w-[800px] rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-700 relative">
              <h3 className="text-lg font-bold w-full text-center">{editingTicketId !== null ? 'Cập nhật loại vé' : 'Tạo loại vé mới'}</h3>
              <button onClick={() => { setIsTicketModalOpen(false); setEditingTicketId(null); resetTicketForm(); }} className="absolute right-6 text-gray-400 hover:text-white transition-colors">
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
                  onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                  className="w-full bg-white text-black text-sm p-3 rounded outline-none pr-12" 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Giá vé</label>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="VNĐ"
                      value={ticketData.price}
                      onChange={(e) => setTicketData({...ticketData, price: e.target.value})}
                      disabled={ticketData.isFree}
                      className="w-full bg-white text-black text-sm p-3 rounded outline-none disabled:bg-gray-300" 
                    />
                    <label className="flex items-center text-sm cursor-pointer mt-1">
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
                    <input type="text" value={ticketData.saleStart} placeholder="DD-MM-YYYY HH:mm" className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" readOnly />
                    <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  <DatePickerPopup isOpen={activeDatePicker === 'ticket_start'} onClose={() => setActiveDatePicker(null)} value={ticketData.saleStart} onChange={(newDate) => setTicketData({...ticketData, saleStart: newDate})} />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-bold mb-2"><span className="text-red-500 mr-1">*</span>Kết thúc bán vé</label>
                  <div className="relative cursor-pointer" onClick={() => toggleDatePicker('ticket_end')}>
                    <input type="text" value={ticketData.saleEnd} placeholder="DD-MM-YYYY HH:mm" className="w-full bg-white text-black text-sm p-3 rounded outline-none cursor-pointer" readOnly />
                    <CalendarIcon className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  <DatePickerPopup isOpen={activeDatePicker === 'ticket_end'} onClose={() => setActiveDatePicker(null)} value={ticketData.saleEnd} onChange={(newDate) => setTicketData({...ticketData, saleEnd: newDate})} />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700">
              <button 
                onClick={handleSaveTicketType} 
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