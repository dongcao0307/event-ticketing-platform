import React, { useState } from 'react';
import { Search, Info, Edit, Trash2, ArrowLeft, Calendar, ChevronDown } from 'lucide-react';

const Voucher = () => {
  // State quản lý việc đang ở màn hình Danh sách (false) hay màn hình Tạo mới (true)
  const [isCreating, setIsCreating] = useState(false);

  // ==========================================
  // GIAO DIỆN 1: MÀN HÌNH TẠO VOUCHER MỚI
  // ==========================================
  if (isCreating) {
    return (
      <div className="max-w-[1100px] mx-auto pb-20 text-gray-800">
        {/* Header Tạo Voucher */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setIsCreating(false)} 
            className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} className="text-black" />
          </button>
          <h2 className="text-xl font-bold text-white">Tạo voucher mới</h2>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm">
          
          {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="font-bold text-base mb-6">Thông tin cơ bản</h3>
            
            <div className="space-y-5">
              {/* Tên chương trình */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Tên chương trình khuyến mãi :</label>
                <div className="flex-1 relative">
                  <input type="text" placeholder="Nhập tên chương trình khuyến mãi" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f] transition" />
                  <span className="absolute right-3 top-2.5 text-gray-400 text-xs">0 / 80</span>
                  <p className="text-xs text-gray-500 mt-1">Tên chương trình sẽ không hiển thị cho người mua</p>
                </div>
              </div>

              {/* Mã voucher */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Mã voucher :</label>
                <div className="flex-1 relative">
                  <input type="text" placeholder="Nhập mã voucher" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f] transition uppercase" />
                  <span className="absolute right-3 top-2.5 text-gray-400 text-xs">0 / 12</span>
                  <p className="text-xs text-gray-500 mt-1">Chỉ cho phép những giá trị sau (A-Z and 0-9), tối thiểu 6 và tối đa 12 ký tự</p>
                </div>
              </div>

              {/* Thời gian sử dụng */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Thời gian sử dụng mã :</label>
                <div className="flex-1 flex items-center border border-gray-300 rounded px-3 py-2.5 text-sm">
                  <span className="text-gray-400 flex-1">Start date</span>
                  <span className="text-gray-300 mx-4">→</span>
                  <span className="text-gray-400 flex-1">End date</span>
                  <Calendar size={16} className="text-gray-400" />
                </div>
              </div>

              {/* Nội dung */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Nội dung :</label>
                <div className="flex-1">
                  <textarea placeholder="Điều khoản và quy định của chương trình khuyến mãi này" className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-[#00b14f] transition h-[100px] resize-none"></textarea>
                </div>
              </div>

              {/* Ảnh chương trình & Thiết lập hiển thị */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Ảnh chương trình :</label>
                <div className="flex-1 flex gap-6">
                  {/* Ảnh giả lập */}
                  <div className="w-[120px] h-[120px] bg-gray-900 rounded-lg overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1540039155733-d76e6c4849ec?auto=format&fit=crop&q=80&w=200&h=200" alt="Preview" className="w-full h-full object-cover opacity-60" />
                  </div>
                  
                  {/* Thiết lập hiển thị */}
                  <div>
                    <h4 className="font-bold text-sm mb-3">Thiết lập hiển thị</h4>
                    <label className="flex items-start mb-4 cursor-pointer">
                      <input type="radio" name="visibility" className="mt-1 mr-2 accent-[#00b14f]" />
                      <div>
                        <div className="font-bold text-sm">Công khai</div>
                        <div className="text-xs text-gray-500">Mã voucher sẽ được hiển thị tự động trên trang thanh toán, giúp khách hàng dễ dàng nhận biết và chủ động sử dụng.</div>
                      </div>
                    </label>
                    <label className="flex items-start cursor-pointer">
                      <input type="radio" name="visibility" defaultChecked className="mt-1 mr-2 accent-[#00b14f]" />
                      <div>
                        <div className="font-bold text-sm">Riêng tư</div>
                        <div className="text-xs text-gray-500">Mã voucher sẽ không được công khai, vì vậy bạn cần chủ động chia sẻ mã với khách hàng.</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 2: THIẾT LẬP MÃ VOUCHER */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="font-bold text-base mb-6">Thiết lập mã voucher</h3>
            
            <div className="space-y-5">
              {/* Loại khuyến mãi */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Loại khuyến mãi :</label>
                <div className="flex-1 flex gap-2">
                  <div className="relative w-1/3">
                    <select className="w-full appearance-none border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f] bg-white cursor-pointer">
                      <option>Theo số tiền</option>
                      <option>Theo phần trăm</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <input type="text" placeholder="Nhập mức giảm" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f]" />
                    <span className="absolute right-4 top-2.5 text-gray-500 font-medium">đ</span>
                  </div>
                </div>
              </div>

              {/* Tổng số vé được áp dụng */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Tổng số vé được áp dụng :</label>
                <div className="flex-1">
                  <div className="flex gap-6 mb-3">
                    <label className="flex items-center cursor-pointer text-sm">
                      <input type="radio" name="totalTickets" defaultChecked className="mr-2 accent-[#00b14f]" /> Giới hạn
                    </label>
                    <label className="flex items-center cursor-pointer text-sm text-gray-500">
                      <input type="radio" name="totalTickets" className="mr-2 accent-[#00b14f]" /> Không giới hạn
                    </label>
                  </div>
                  <input type="text" placeholder="Nhập số lượng vé" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f]" />
                  <p className="text-xs text-gray-500 mt-1">Số vé được khuyến mãi mỗi voucher</p>
                </div>
              </div>

              {/* Số đơn hàng tối đa / Người mua */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Số đơn hàng tối đa/Người mua :</label>
                <div className="flex-1">
                  <input type="text" placeholder="Nhập số đơn hàng tối đa" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f]" />
                  <p className="text-xs text-gray-500 mt-1">Tổng số đơn hàng mà người mua có thể áp dụng voucher</p>
                </div>
              </div>

              {/* Số lượng vé tối thiểu */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Số lượng vé tối thiểu :</label>
                <div className="flex-1">
                  <input type="text" placeholder="Nhập số lượng vé tối thiểu" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f]" />
                  <p className="text-xs text-gray-500 mt-1">Số lượng vé tối thiểu trong đơn hàng để có thể áp dụng mã voucher</p>
                </div>
              </div>

              {/* Số lượng vé tối đa */}
              <div className="flex flex-col md:flex-row gap-4">
                <label className="md:w-[220px] text-sm font-bold md:text-right shrink-0 mt-2.5">Số lượng vé tối đa :</label>
                <div className="flex-1">
                  <input type="text" placeholder="Nhập số lượng vé tối đa" className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#00b14f]" />
                  <p className="text-xs text-gray-500 mt-1">Số lượng vé tối đa trong đơn hàng có thể áp dụng mã voucher</p>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 3: PHẠM VI ÁP DỤNG */}
          <div className="p-8">
            <h3 className="font-bold text-base mb-4">Phạm vi áp dụng</h3>
            <div className="flex gap-6 mb-4">
              <label className="flex items-center cursor-pointer text-sm text-gray-500">
                <input type="radio" name="scope" className="mr-2 accent-[#00b14f]" /> Toàn bộ suất diễn
              </label>
              <label className="flex items-center cursor-pointer text-sm font-bold">
                <input type="radio" name="scope" defaultChecked className="mr-2 accent-[#00b14f]" /> Giới hạn suất diễn
              </label>
            </div>
            
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded border border-gray-100">
              <div className="text-sm">
                <span className="font-bold mr-4">Các suất diễn áp dụng</span>
                <span className="text-gray-500">0 suất diễn được chọn</span>
              </div>
              <button className="bg-[#00b14f] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#009e47] transition">
                Thêm suất diễn
              </button>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
            <button 
              onClick={() => setIsCreating(false)}
              className="px-6 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button className="px-6 py-2 bg-[#00b14f] text-white rounded text-sm font-medium hover:bg-[#009e47] transition">
              Tạo voucher
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // GIAO DIỆN 2: MÀN HÌNH DANH SÁCH VOUCHER
  // ==========================================
  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        
        {/* Khối Tìm kiếm & Info */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[350px]">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên chương trình và mã voucher" 
              className="w-full bg-white text-black pl-3 pr-10 py-2 rounded outline-none text-sm placeholder-gray-400"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-[#00b14f] w-10 flex items-center justify-center rounded-r hover:bg-[#009e47] transition">
              <Search size={16} className="text-white" />
            </button>
          </div>
          <div className="bg-white text-black text-sm font-bold px-3 py-2 rounded flex items-center gap-2">
            1 / 5000 <Info size={14} className="text-gray-400" />
          </div>
        </div>

        {/* Nút Tạo voucher (Click đổi state) */}
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[#00b14f] text-white px-5 py-2 rounded text-sm font-medium hover:bg-[#009e47] transition shadow-sm whitespace-nowrap"
        >
          Tạo voucher
        </button>
      </div>

      {/* Bảng Danh sách */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-800">
            
            {/* Table Header */}
            <thead className="bg-white border-b border-gray-200 text-gray-500 font-medium">
              <tr>
                <th className="px-4 py-4 w-[50px] text-center border-r border-gray-100">
                  <input type="checkbox" className="w-4 h-4 accent-[#00b14f] cursor-pointer" />
                </th>
                <th className="px-4 py-4 font-bold border-r border-gray-100 whitespace-nowrap text-center">Tên chương trình khuyến mãi</th>
                <th className="px-4 py-4 font-bold border-r border-gray-100 whitespace-nowrap text-center">Mã voucher</th>
                <th className="px-4 py-4 font-bold border-r border-gray-100 whitespace-nowrap text-center">Mức giảm</th>
                <th className="px-4 py-4 font-bold border-r border-gray-100 whitespace-nowrap text-center">Thời gian áp dụng</th>
                <th className="px-4 py-4 font-bold border-r border-gray-100 whitespace-nowrap text-center">
                  Trạng thái hoạt động <Info size={14} className="inline text-gray-400 ml-1" />
                </th>
                <th className="px-4 py-4 font-bold whitespace-nowrap text-center">Action</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {/* Row 1 (Dữ liệu mẫu từ ảnh) */}
              <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-center border-r border-gray-100">
                  <input type="checkbox" className="w-4 h-4 accent-[#00b14f] cursor-pointer" />
                </td>
                <td className="px-4 py-4 text-center border-r border-gray-100">giảm giá</td>
                <td className="px-4 py-4 text-center border-r border-gray-100">234567</td>
                <td className="px-4 py-4 text-center border-r border-gray-100">20 %</td>
                <td className="px-4 py-4 text-center border-r border-gray-100">
                  <div className="flex flex-col items-center justify-center gap-1">
                     <span className="text-[10px] font-bold text-[#0084ff] bg-[#0084ff]/10 px-2 py-0.5 rounded border border-[#0084ff]/20">Sắp diễn ra</span>
                     <span className="text-gray-500 text-xs">29/01/2026 07:00 - 31/01/2026 00:07</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center border-r border-gray-100">
                  {/* Toggle Switch */}
                  <div className="w-10 h-5 bg-[#00b14f] rounded-full relative cursor-pointer mx-auto">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="w-7 h-7 bg-[#00b14f]/10 text-[#00b14f] rounded flex items-center justify-center hover:bg-[#00b14f]/20 transition">
                      <Edit size={14} />
                    </button>
                    <button className="w-7 h-7 border border-gray-200 text-gray-400 rounded flex items-center justify-center hover:bg-gray-100 transition">
                      {/* Icon Detail/View (Giả lập khoảng trắng giữa như ảnh) */}
                    </button>
                    <button className="w-7 h-7 bg-red-50 text-red-500 rounded flex items-center justify-center hover:bg-red-100 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default Voucher;