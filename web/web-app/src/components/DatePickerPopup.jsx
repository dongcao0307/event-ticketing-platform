import React, { useState, useEffect, useRef } from 'react';

const DatePickerPopup = ({ isOpen, onClose, value, onChange }) => {
  const popupRef = useRef(null);

  // Hàm chuyển đổi string "DD-MM-YYYY HH:mm" thành object Date
  const parseDateString = (dateStr) => {
    if (!dateStr) return new Date();
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) return new Date();
    const [day, month, year] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    return new Date(year, month - 1, day, hour, minute);
  };

  // State lưu trữ ngày đang chọn và tháng/năm đang hiển thị trên lịch
  const [selectedDate, setSelectedDate] = useState(() => parseDateString(value));
  const [viewDate, setViewDate] = useState(() => parseDateString(value));

  // THAY BẰNG ĐOẠN CODE NÀY:
  // Theo dõi sự thay đổi của props mà không dùng useEffect
  const [prevValue, setPrevValue] = useState(value);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Nếu props thay đổi, cập nhật lại state "nháp" ngay trong lúc render
  if (value !== prevValue || isOpen !== prevIsOpen) {
    setPrevValue(value);
    setPrevIsOpen(isOpen);
    
    if (isOpen) {
      const newDate = parseDateString(value);
      setSelectedDate(newDate);
      setViewDate(newDate);
    }
  }
  // Click ra ngoài để đóng popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // --- LOGIC TÍNH TOÁN LỊCH ---
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Chủ nhật
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Tạo mảng ngày để render
  const calendarDays = [];
  
  // Ngày của tháng trước (làm mờ)
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, monthOffset: -1 });
  }
  
  // Ngày của tháng hiện tại
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true, monthOffset: 0 });
  }
  
  // Ngày của tháng sau (làm mờ) cho đủ 42 ô (6 dòng x 7 cột)
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false, monthOffset: 1 });
  }

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));
  const handlePrevYear = () => setViewDate(new Date(currentYear - 1, currentMonth, 1));
  const handleNextYear = () => setViewDate(new Date(currentYear + 1, currentMonth, 1));

  const handleDayClick = (day, monthOffset) => {
    const newDate = new Date(currentYear, currentMonth + monthOffset, day, selectedDate.getHours(), selectedDate.getMinutes());
    setSelectedDate(newDate);
    if (monthOffset !== 0) {
      setViewDate(newDate);
    }
  };

  const handleTimeChange = (type, val) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') newDate.setHours(val);
    if (type === 'minute') newDate.setMinutes(val);
    setSelectedDate(newDate);
  };

  const handleNow = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewDate(now);
  };

  const handleOk = () => {
    // Format lại thành string: "DD-MM-YYYY HH:mm"
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const y = selectedDate.getFullYear();
    const h = String(selectedDate.getHours()).padStart(2, '0');
    const min = String(selectedDate.getMinutes()).padStart(2, '0');
    
    onChange(`${d}-${m}-${y} ${h}:${min}`);
    onClose();
  };

  // Tạo mảng giờ (0-23) và phút (0-59)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div ref={popupRef} className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl text-black z-50 w-[360px] p-4 flex border border-gray-200" onClick={(e) => e.stopPropagation()}>
      
      {/* CỘT TRÁI: LỊCH */}
      <div className="flex-1 border-r border-gray-100 pr-4">
        {/* Header Lịch */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevYear} className="text-gray-400 hover:text-[#00b14f] transition">{'<<'}</button>
          <button onClick={handlePrevMonth} className="text-gray-400 hover:text-[#00b14f] transition">{'<'}</button>
          <span className="font-bold text-sm">{monthNames[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} className="text-gray-400 hover:text-[#00b14f] transition">{'>'}</button>
          <button onClick={handleNextYear} className="text-gray-400 hover:text-[#00b14f] transition">{'>>'}</button>
        </div>
        
        {/* Thứ trong tuần */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500 font-medium">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        
        {/* Ngày trong tháng */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {calendarDays.map((item, index) => {
            const isSelected = item.isCurrentMonth && item.day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
            
            return (
              <div 
                key={index} 
                onClick={() => handleDayClick(item.day, item.monthOffset)}
                className={`py-1 rounded cursor-pointer transition
                  ${!item.isCurrentMonth ? 'text-gray-300 hover:bg-gray-50' : 'hover:bg-gray-100'} 
                  ${isSelected ? 'bg-[#00b14f] text-white font-bold hover:bg-[#009e47]' : ''}
                `}
              >
                {item.day}
              </div>
            );
          })}
        </div>
        
        {/* Nút Now */}
        <div className="mt-4">
          <button onClick={handleNow} className="text-[#00b14f] text-sm hover:underline font-medium">Now</button>
        </div>
      </div>
      
      {/* CỘT PHẢI: GIỜ PHÚT */}
      <div className="w-[100px] pl-4 flex flex-col h-[260px]">
        <div className="font-bold text-sm text-[#00b14f] mb-2 text-center border-b pb-2">
          {String(selectedDate.getHours()).padStart(2, '0')}:{String(selectedDate.getMinutes()).padStart(2, '0')}
        </div>
        
        <div className="flex justify-between px-1 text-sm overflow-y-auto custom-scrollbar flex-1 mb-2">
          {/* Cột Giờ */}
          <div className="space-y-1 w-1/2 text-center border-r border-gray-100 pr-1">
            {hours.map(h => (
              <div 
                key={h} 
                onClick={() => handleTimeChange('hour', h)}
                className={`cursor-pointer py-1 rounded transition ${selectedDate.getHours() === h ? 'text-[#00b14f] font-bold bg-green-50' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {String(h).padStart(2, '0')}
              </div>
            ))}
          </div>
          {/* Cột Phút */}
          <div className="space-y-1 w-1/2 text-center pl-1">
            {minutes.map(m => (
              <div 
                key={m} 
                onClick={() => handleTimeChange('minute', m)}
                className={`cursor-pointer py-1 rounded transition ${selectedDate.getMinutes() === m ? 'text-[#00b14f] font-bold bg-green-50' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {String(m).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>

        {/* Nút OK */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
           <button 
             onClick={handleOk} 
             className="bg-[#00b14f] text-white text-xs px-4 py-1.5 rounded hover:bg-[#009e47] transition font-bold"
           >OK</button>
        </div>
      </div>
    </div>
  );
};

export default DatePickerPopup;