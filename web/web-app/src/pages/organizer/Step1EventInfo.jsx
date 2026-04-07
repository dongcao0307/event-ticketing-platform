import React, { useState } from 'react';
import { ImageIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Image as ImageIcon2, PlaySquare, ChevronDown } from 'lucide-react';

const Step1EventInfo = () => {
  const [eventType, setEventType] = useState('offline');

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* ===== BLOCK 1: UPLOAD HÌNH ẢNH ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-red-500 mr-1">*</span> 
            <span className="font-bold text-sm">Upload hình ảnh</span>
            <a href="#" className="text-[#00b14f] text-sm hover:underline ml-4">Xem vị trí hiển thị các ảnh</a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-[30%] border-2 border-dashed border-gray-600 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition-colors cursor-pointer flex flex-col items-center justify-center h-[320px]">
            <div className="text-[#00b14f] mb-3"><ImageIcon size={40} strokeWidth={1.5} /></div>
            <p className="text-center text-sm text-gray-300">Thêm ảnh sự kiện để<br/>hiển thị ở các vị trí khác<br/><span className="font-bold text-gray-200">(720x958)</span></p>
          </div>
          <div className="w-full md:w-[70%] border-2 border-dashed border-gray-600 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition-colors cursor-pointer flex flex-col items-center justify-center h-[320px]">
            <div className="text-[#00b14f] mb-3"><ImageIcon size={40} strokeWidth={1.5} /></div>
            <p className="text-center text-sm text-gray-300">Thêm ảnh nền sự kiện<br/><span className="font-bold text-gray-200">(1280x720)</span></p>
          </div>
        </div>
      </div>

      {/* ===== BLOCK 2: TÊN SỰ KIỆN ===== */}
      <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
        <label className="block mb-2 font-bold text-sm"><span className="text-red-500 mr-1">*</span>Tên sự kiện</label>
        <div className="relative">
          <input type="text" placeholder="Tên sự kiện" className="w-full p-2.5 rounded bg-white text-black text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none pr-16" />
          <span className="absolute right-3 top-2.5 text-gray-400 text-sm">0 / 100</span>
        </div>
      </div>

     {/* ===== BLOCK 2: TÊN SỰ KIỆN ===== */}
                   <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
                     <label className="block mb-2 font-bold text-sm">
                       <span className="text-red-500 mr-1">*</span>Tên sự kiện
                     </label>
                     <div className="relative">
                       <input 
                         type="text" 
                         placeholder="Tên sự kiện" 
                         className="w-full p-2.5 rounded bg-white text-black text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none pr-16" 
                       />
                       <span className="absolute right-3 top-2.5 text-gray-400 text-sm">0 / 100</span>
                     </div>
                   </div>
     
                   {/* ===== BLOCK 3: ĐỊA CHỈ SỰ KIỆN ===== */}
                   <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
                     {/* Radio Buttons */}
                     <div className="mb-5">
                       <label className="block mb-3 font-bold text-sm">
                         <span className="text-red-500 mr-1">*</span>Địa chỉ sự kiện
                       </label>
                       <div className="flex space-x-8">
                         <label className="flex items-center cursor-pointer group">
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 transition-colors ${eventType === 'offline' ? 'border-[#00b14f]' : 'border-gray-400 group-hover:border-gray-300'}`}>
                             {eventType === 'offline' && <div className="w-2.5 h-2.5 rounded-full bg-[#00b14f]"></div>}
                           </div>
                           <span className="text-sm">Sự kiện Offline</span>
                           <input type="radio" className="hidden" checked={eventType === 'offline'} onChange={() => setEventType('offline')} />
                         </label>
                         <label className="flex items-center cursor-pointer group">
                           <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 transition-colors ${eventType === 'online' ? 'border-[#00b14f]' : 'border-gray-400 group-hover:border-gray-300'}`}>
                             {eventType === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-[#00b14f]"></div>}
                           </div>
                           <span className="text-sm">Sự kiện Online</span>
                           <input type="radio" className="hidden" checked={eventType === 'online'} onChange={() => setEventType('online')} />
                         </label>
                       </div>
                     </div>
     
                     {/* Tên địa điểm */}
                     <div className="mb-5 relative">
                       <label className="block mb-2 font-bold text-sm"><span className="text-red-500 mr-1">*</span>Tên địa điểm</label>
                       <input type="text" placeholder="Tên địa điểm" className="w-full p-2.5 rounded bg-white text-black text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none pr-16" />
                       <span className="absolute right-3 bottom-2.5 text-gray-400 text-sm">0 / 80</span>
                     </div>
     
                     {/* Grid Select & Input */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="relative">
                         <label className="block mb-2 font-bold text-sm"><span className="text-red-500 mr-1">*</span>Tỉnh/Thành</label>
                         <select className="w-full p-2.5 rounded bg-white text-gray-600 text-sm border-none outline-none appearance-none cursor-pointer">
                           <option>Tỉnh/Thành</option>
                         </select>
                         <ChevronDown className="absolute right-3 bottom-2.5 text-gray-400 pointer-events-none" size={18} />
                       </div>
                       <div className="relative">
                         <label className="block mb-2 font-bold text-sm">Quận/Huyện</label>
                         <select className="w-full p-2.5 rounded bg-white text-gray-600 text-sm border-none outline-none appearance-none cursor-pointer">
                           <option>Quận/Huyện</option>
                         </select>
                         <ChevronDown className="absolute right-3 bottom-2.5 text-gray-400 pointer-events-none" size={18} />
                       </div>
                       <div className="relative">
                         <label className="block mb-2 font-bold text-sm">Phường/Xã</label>
                         <select className="w-full p-2.5 rounded bg-white text-gray-600 text-sm border-none outline-none appearance-none cursor-pointer">
                           <option>Phường/Xã</option>
                         </select>
                         <ChevronDown className="absolute right-3 bottom-2.5 text-gray-400 pointer-events-none" size={18} />
                       </div>
                       <div className="relative">
                         <label className="block mb-2 font-bold text-sm"><span className="text-red-500 mr-1">*</span>Số nhà, đường</label>
                         <input type="text" placeholder="Số nhà, đường" className="w-full p-2.5 rounded bg-white text-black text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none pr-16" />
                         <span className="absolute right-3 bottom-2.5 text-gray-400 text-sm">0 / 80</span>
                       </div>
                     </div>
                   </div>
     
                   {/* ===== BLOCK 4: THỂ LOẠI SỰ KIỆN ===== */}
                   <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
                     <label className="block mb-2 font-bold text-sm">
                       <span className="text-red-500 mr-1">*</span>Thể loại sự kiện
                     </label>
                     <div className="relative">
                       <select className="w-full p-2.5 rounded bg-white text-gray-600 text-sm border-none outline-none appearance-none cursor-pointer">
                         <option>Vui lòng chọn</option>
                       </select>
                       <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
                     </div>
                   </div>
     
                   {/* ===== BLOCK 5: THÔNG TIN SỰ KIỆN (Trình soạn thảo) ===== */}
                   <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31]">
                     <label className="block mb-2 font-bold text-sm">
                       <span className="text-red-500 mr-1">*</span>Thông tin sự kiện
                     </label>
                     <div className="border border-[#3a3b40] rounded-md overflow-hidden bg-[#2a2b31]">
                       
                       {/* Toolbar */}
                       <div className="px-3 py-2 flex flex-wrap items-center gap-4 border-b border-[#3a3b40]">
                         <div className="flex items-center gap-1 bg-transparent text-sm text-gray-300 cursor-pointer">
                           Paragraph <ChevronDown size={14} className="ml-1" />
                         </div>
                         
                         {/* Bảng màu giả lập */}
                         <div className="flex items-center gap-1">
                           <div className="w-4 h-4 bg-white border border-gray-400 rounded-sm cursor-pointer"></div>
                           <div className="w-4 h-4 bg-black border border-gray-600 rounded-sm cursor-pointer"></div>
                           <div className="w-4 h-4 bg-red-500 rounded-sm cursor-pointer"></div>
                           <div className="w-4 h-4 bg-yellow-400 rounded-sm cursor-pointer"></div>
                         </div>
     
                         {/* Định dạng chữ */}
                         <div className="flex items-center gap-2 text-gray-400 border-l border-gray-600 pl-4">
                           <button className="hover:text-white"><Bold size={16} /></button>
                           <button className="hover:text-white"><Italic size={16} /></button>
                           <button className="hover:text-white"><Underline size={16} /></button>
                         </div>
     
                         {/* Căn lề */}
                         <div className="flex items-center gap-2 text-gray-400 border-l border-gray-600 pl-4">
                           <button className="hover:text-white"><AlignLeft size={16} /></button>
                           <button className="hover:text-white"><AlignCenter size={16} /></button>
                           <button className="hover:text-white"><AlignRight size={16} /></button>
                           <button className="hover:text-white"><AlignJustify size={16} /></button>
                         </div>
     
                         {/* Danh sách & Media */}
                         <div className="flex items-center gap-2 text-gray-400 border-l border-gray-600 pl-4">
                           <button className="hover:text-white"><List size={16} /></button>
                           <button className="hover:text-white"><ListOrdered size={16} /></button>
                           <button className="hover:text-white ml-2"><ImageIcon2 size={16} /></button>
                           <button className="hover:text-white"><PlaySquare size={16} /></button>
                         </div>
                       </div>
     
                       {/* Vùng nhập nội dung */}
                       <textarea 
                         className="w-full p-4 bg-[#1f2026] text-sm text-gray-300 border-none outline-none resize-y min-h-[250px] leading-relaxed"
                         defaultValue={`Giới thiệu sự kiện:\n[Tóm tắt ngắn gọn về sự kiện: Nội dung chính của sự kiện, điểm đặc sắc nhất và lý do khiến người tham gia không nên bỏ lỡ]\n\nChi tiết sự kiện:\n• Chương trình chính: [Liệt kê những hoạt động nổi bật trong sự kiện: các phần trình diễn, khách mời đặc biệt...]\n• Khách mời: [Thông tin về các khách mời đặc biệt, nghệ sĩ...]\n• Trải nghiệm đặc biệt: [Nếu có các hoạt động đặc biệt khác như workshop, khu trải nghiệm...]\n\nĐiều khoản và điều kiện:\n[TnC] sự kiện\n\nLưu ý về điều khoản trẻ em\nLưu ý về điều khoản VAT`}
                       ></textarea>
                     </div>
                   </div>
     
                   {/* ===== BLOCK 6: BAN TỔ CHỨC ===== */}
                   <div className="bg-[#1c1d22] p-6 rounded-lg border border-[#2a2b31] flex flex-col md:flex-row gap-6">
                     {/* Logo BTC */}
                     <div className="w-full md:w-[220px] shrink-0">
                       <div className="border-2 border-dashed border-gray-600 rounded-lg bg-[#2a2b31] hover:bg-[#34353c] transition-colors cursor-pointer flex flex-col items-center justify-center h-[220px]">
                         <div className="text-[#00b14f] mb-3">
                           <ImageIcon size={32} strokeWidth={1.5} />
                         </div>
                         <p className="text-center text-sm text-gray-300">
                           Thêm logo ban tổ chức<br/>
                           <span className="font-bold text-gray-200">(275x275)</span>
                         </p>
                       </div>
                     </div>
                     
                     {/* Thông tin BTC */}
                     <div className="flex-1 flex flex-col gap-5">
                       <div className="relative">
                         <label className="block mb-2 font-bold text-sm"><span className="text-red-500 mr-1">*</span>Tên ban tổ chức</label>
                         <input type="text" placeholder="Tên ban tổ chức" className="w-full p-2.5 rounded bg-white text-black text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none pr-16" />
                         <span className="absolute right-3 bottom-2.5 text-gray-400 text-sm">0 / 80</span>
                       </div>
                       <div className="relative flex-1 flex flex-col">
                         <label className="block mb-2 font-bold text-sm"><span className="text-red-500 mr-1">*</span>Thông tin ban tổ chức</label>
                         <textarea 
                           placeholder="Thông tin ban tổ chức" 
                           className="w-full flex-1 p-2.5 rounded bg-white text-black text-sm border-none focus:ring-2 focus:ring-[#00b14f] outline-none resize-none pr-16"
                         ></textarea>
                         <span className="absolute right-3 bottom-2.5 text-gray-400 text-sm">0 / 500</span>
                       </div>
                     </div>
                   </div>
     
      
    </div>
  );
};

export default Step1EventInfo;