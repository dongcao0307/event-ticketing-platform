import React, { useState } from 'react';
import { Lock, Users, User, Mail } from 'lucide-react';

// Nhận eventData và setEventData từ component cha (OrganizerPage)
const Step3Settings = ({ eventData, setEventData }) => {
  
  // 1. TỰ ĐỘNG DỊCH CHUỖI JSON TỪ BACKEND
  let settings = eventData?.settings || {};
  
  if (Object.keys(settings).length === 0 && eventData?.settingsConfig) {
    try {
      settings = typeof eventData.settingsConfig === 'string' 
        ? JSON.parse(eventData.settingsConfig) 
        : eventData.settingsConfig;
    } catch (e) {
      console.error("Lỗi đọc dữ liệu settings từ Backend:", e);
    }
  }

  // 2. LẤY GIÁ TRỊ TỪ SETTINGS ĐỂ HIỂN THỊ
  const customUrl = settings.customUrl !== undefined ? settings.customUrl : '';
  const privacy = settings.privacy || 'public'; 
  const confirmMsg = settings.confirmMsg !== undefined ? settings.confirmMsg : '';
  const enableQuestionnaire = settings.enableQuestionnaire || false;

  // --- [MỚI] STATE QUẢN LÝ LỖI RÀNG BUỘC ---
  const [errors, setErrors] = useState({});

  // --- [MỚI] HÀM KIỂM TRA LỖI ---
  const validateField = (field, value) => {
    let errorMsg = '';
    switch (field) {
      case 'customUrl':
        if (!value || !value.trim()) {
          errorMsg = 'Vui lòng nhập đường dẫn tùy chỉnh';
        } else if (value.length > 80) {
          errorMsg = 'Đường dẫn tối đa 80 ký tự';
        } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
          // Bắt buộc: Không dấu, không khoảng trắng, chỉ chữ, số và gạch ngang
          errorMsg = 'Đường dẫn chỉ được chứa chữ không dấu, số và dấu gạch ngang (-)';
        }
        break;
      case 'confirmMsg':
        if (value && value.length > 500) {
          errorMsg = 'Tin nhắn tối đa 500 ký tự';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  // --- [MỚI] XỬ LÝ KHI USER CLICK RA NGOÀI Ô NHẬP (BLUR) ---
  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // --- CẬP NHẬT: XÓA LỖI KHI USER ĐANG GÕ ---
  const handleSettingChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      settings: {
        ...(prev.settings || settings), 
        [field]: value
      }
    }));
    
    // Nếu đang có lỗi ở field này thì xóa đi để user gõ tiếp
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const baseUrl = 'https://ticketbox.vn/';
  const eventId = eventData?.id || '25598'; 

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 text-gray-200 pb-20">
      
      {/* ===== BLOCK 1: LINK DẪN ĐẾN SỰ KIỆN ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <h3 className="font-bold text-sm mb-4">
          <span className="text-red-500 mr-1">*</span>Link dẫn đến sự kiện
        </h3>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
          <label className="text-sm font-bold whitespace-nowrap">
            <span className="text-red-500 mr-1">*</span>Tùy chỉnh đường dẫn:
          </label>
          <div className="relative flex-1">
            <input 
              type="text" 
              value={customUrl}
              onChange={(e) => handleSettingChange('customUrl', e.target.value)}
              onBlur={(e) => handleBlur('customUrl', e.target.value)} // [MỚI]
              placeholder="duaxemorong" 
              className={`w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 transition-all ${errors.customUrl ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
            />
            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
              {customUrl.length} / 80
            </span>
          </div>
        </div>
        {/* [MỚI] Hiển thị dòng lỗi nếu nhập sai URL */}
        {errors.customUrl && <p className="text-red-500 text-xs mb-3 md:ml-[160px]">{errors.customUrl}</p>}

        <p className="text-sm text-gray-400">
          Đường dẫn sự kiện của bạn là: <a href={`${baseUrl}${customUrl || 'duaxemorong'}-${eventId}`} className="text-[#0084ff] hover:underline" target="_blank" rel="noreferrer">{`${baseUrl}${customUrl || 'duaxemorong'}-${eventId}`}</a>
        </p>
      </div>

      {/* ===== BLOCK 2: QUYỀN RIÊNG TƯ ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <div className="flex items-center mb-6">
          <Lock size={18} className="mr-2" />
          <h3 className="font-bold text-sm">Quyền riêng tư sự kiện</h3>
        </div>

        <div className="space-y-4 ml-2">
          {/* Lựa chọn 1: Công khai */}
          <label className="flex items-start cursor-pointer group" onClick={() => handleSettingChange('privacy', 'public')}>
            <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 transition-colors ${privacy === 'public' ? 'border-[#00b14f]' : 'border-gray-500 group-hover:border-gray-300'}`}>
              {privacy === 'public' && <div className="w-2 h-2 rounded-full bg-[#00b14f]"></div>}
            </div>
            <Users size={20} className="mr-3 text-gray-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-white">Sự kiện mở cho mọi người</p>
              <p className="text-sm text-gray-400">Tất cả mọi người đều có thể đặt vé</p>
            </div>
          </label>

          {/* Lựa chọn 2: Riêng tư */}
          <label className="flex items-start cursor-pointer group" onClick={() => handleSettingChange('privacy', 'private')}>
            <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 transition-colors ${privacy === 'private' ? 'border-[#00b14f]' : 'border-gray-500 group-hover:border-gray-300'}`}>
              {privacy === 'private' && <div className="w-2 h-2 rounded-full bg-[#00b14f]"></div>}
            </div>
            <User size={20} className="mr-3 text-gray-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-white">Sự kiện dành riêng cho 1 nhóm</p>
              <p className="text-sm text-gray-400">Chỉ người có link truy cập mới đặt được vé</p>
            </div>
          </label>
        </div>
      </div>

      {/* ===== BLOCK 3: TIN NHẮN XÁC NHẬN ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <div className="flex items-center mb-2">
          <Mail size={18} className="mr-2" />
          <h3 className="font-bold text-sm">Tin nhắn xác nhận cho người tham gia</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4 ml-6">
          Tin nhắn xác nhận này sẽ được gửi đến cho người tham gia sau khi đặt vé thành công
        </p>
        
        <div className="relative ml-6">
          <textarea 
            value={confirmMsg}
            onChange={(e) => handleSettingChange('confirmMsg', e.target.value)}
            onBlur={(e) => handleBlur('confirmMsg', e.target.value)} // [MỚI]
            placeholder="Cảm ơn bạn đã tham gia sự kiện" 
            className={`w-full bg-white text-black text-sm p-3 rounded outline-none h-[120px] resize-none pr-4 transition-all ${errors.confirmMsg ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`}
          ></textarea>
          <span className="absolute right-3 bottom-3 text-gray-400 text-sm bg-white pl-2">
            {confirmMsg.length} / 500
          </span>
        </div>
        {/* [MỚI] Hiển thị dòng lỗi nếu vượt quá 500 ký tự */}
        {errors.confirmMsg && <p className="text-red-500 text-xs mt-2 ml-6">{errors.confirmMsg}</p>}
      </div>

      {/* ===== BLOCK 4: TẠO BẢNG CÂU HỎI ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <h3 className="font-bold text-sm mb-3">Tạo bảng câu hỏi cho người tham gia</h3>
        <p className="text-sm text-gray-300 mb-1">Hệ thống giúp bạn tạo câu hỏi với 3 mẫu:</p>
        <ol className="text-sm text-gray-400 list-decimal list-inside mb-5 space-y-1">
          <li>Điền câu trả lời</li>
          <li>Chọn 1 câu trả lời</li>
          <li>Chọn nhiều câu trả lời</li>
        </ol>

        <label className="flex items-center cursor-pointer group" onClick={() => handleSettingChange('enableQuestionnaire', !enableQuestionnaire)}>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 transition-colors ${enableQuestionnaire ? 'border-[#00b14f] bg-[#00b14f]' : 'border-gray-400 bg-white group-hover:border-gray-300'}`}>
             {!enableQuestionnaire && <div className="w-full h-full rounded-full bg-white border-2 border-[#1c1d22]"></div>}
             {enableQuestionnaire && <div className="w-2 h-2 rounded-full bg-white"></div>}
          </div>
          <span className="text-sm text-gray-200 font-medium">
            Mở chức năng này (tạo câu hỏi ở bước sau)
          </span>
        </label>
      </div>

    </div>
  );
};

export default Step3Settings;