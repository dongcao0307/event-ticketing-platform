import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Step4Payment = () => {
  // State quản lý form (Khởi tạo sẵn data giống trong hình)
  const [formData, setFormData] = useState({
    accountName: 'Trần Văn Hậu',
    accountNumber: '338858196',
    bankName: 'MBBank',
    branch: 'Dĩ An',
    businessType: 'Cá nhân',
    fullName: 'Trần Văn Hậu',
    address: '218 đường Lý Thường Kiệt',
    taxCode: '035467'
  });

  // Hàm update state
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-[1100px] mx-auto text-gray-200 pb-20">
      
      {/* KHỐI BAO QUANH CHUNG */}
      <div className="bg-[#1c1d22] p-8 rounded-lg border border-[#2a2b31] space-y-10">
        
        {/* ========================================== */}
        {/* PHẦN 1: THÔNG TIN THANH TOÁN               */}
        {/* ========================================== */}
        <div>
          <h3 className="text-lg font-bold mb-2">Thông tin thanh toán</h3>
          <p className="text-sm text-gray-300 mb-1">Ticketbox sẽ chuyển tiền bán vé đến tài khoản của bạn</p>
          <p className="text-sm text-gray-400 mb-6">
            Tiền bán vé (sau khi trừ phí dịch vụ cho Ticketbox) sẽ vào tài khoản của bạn sau khi xác nhận sale report từ 7 - 10 ngày. 
            Nếu bạn muốn nhận được tiền sớm hơn, vui lòng liên hệ chúng tôi qua số <span className="text-white font-medium">1900.6408</span> hoặc <span className="text-white font-medium">info@ticketbox.vn</span>
          </p>

          <div className="space-y-4 max-w-[900px]">
            {/* Row: Chủ tài khoản */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Chủ tài khoản:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={formData.accountName}
                  onChange={(e) => handleChange('accountName', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 focus:ring-2 focus:ring-[#00b14f] transition-all" 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{formData.accountName.length} / 100</span>
              </div>
            </div>

            {/* Row: Số tài khoản */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Số tài khoản:</label>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none focus:ring-2 focus:ring-[#00b14f] transition-all" 
                />
              </div>
            </div>

            {/* Row: Tên ngân hàng */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Tên ngân hàng:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 focus:ring-2 focus:ring-[#00b14f] transition-all" 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{formData.bankName.length} / 100</span>
              </div>
            </div>

            {/* Row: Chi nhánh */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Chi nhánh:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 focus:ring-2 focus:ring-[#00b14f] transition-all" 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{formData.branch.length} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* PHẦN 2: HOÁ ĐƠN ĐỎ                         */}
        {/* ========================================== */}
        <div className="pt-2">
          <h3 className="text-lg font-bold mb-6">Hoá đơn đỏ</h3>

          <div className="space-y-4 max-w-[900px]">
            {/* Row: Loại hình kinh doanh */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Loại hình kinh doanh:</label>
              <div className="flex-1 relative">
                <select 
                  value={formData.businessType}
                  onChange={(e) => handleChange('businessType', e.target.value)}
                  className="w-full appearance-none bg-white text-black text-sm p-2.5 rounded outline-none cursor-pointer focus:ring-2 focus:ring-[#00b14f]"
                >
                  <option value="Cá nhân">Cá nhân</option>
                  <option value="Doanh nghiệp">Doanh nghiệp</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Row: Họ tên */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Họ tên:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 focus:ring-2 focus:ring-[#00b14f] transition-all" 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{formData.fullName.length} / 100</span>
              </div>
            </div>

            {/* Row: Địa chỉ */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Địa chỉ:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 focus:ring-2 focus:ring-[#00b14f] transition-all" 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{formData.address.length} / 100</span>
              </div>
            </div>

            {/* Row: Mã số thuế (Đang active viền xanh) */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">Mã số thuế:</label>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={formData.taxCode}
                  onChange={(e) => handleChange('taxCode', e.target.value)}
                  className="w-full bg-white text-black text-sm p-2.5 rounded outline-none border-2 border-[#00b14f] focus:ring-2 focus:ring-[#00b14f]" 
                />
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Step4Payment;