import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Step4Payment = ({ eventData, setEventData }) => {
  const paymentInfo = eventData?.paymentInfo || eventData?.organizerPaymentInfo || {};

  const accountName = paymentInfo.accountName || paymentInfo.accountOwner || '';
  const accountNumber = paymentInfo.accountNumber || '';
  const bankName = paymentInfo.bankName || '';
  const branch = paymentInfo.branch || paymentInfo.bankBranch || '';
  const businessType = paymentInfo.businessType || 'Cá nhân';
  const fullName = paymentInfo.fullName || paymentInfo.accountOwner || ''; 
  const address = paymentInfo.address || '';
  const taxCode = paymentInfo.taxCode || '';

  // --- [MỚI] STATE QUẢN LÝ LỖI ---
  const [errors, setErrors] = useState({});

  // --- [MỚI] DANH SÁCH NGÂN HÀNG & CHI NHÁNH PHỔ BIẾN ---
  const bankList = [
    "Vietcombank", "Techcombank", "MBBank", "VietinBank", "ACB", 
    "VPBank", "BIDV", "Agribank", "Sacombank", "VIB", "TPBank", 
    "HDBank", "SHB", "SCB", "SeABank", "MSB", "OCB", "Khác..."
  ];

  const branchList = [
    "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
    "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu", "Bắc Ninh", "Thanh Hóa", 
    "Nghệ An", "Hải Dương", "Quảng Ninh", "Khánh Hòa", "Khác..."
  ];

  // --- [MỚI] HÀM VALIDATE ---
  const validateField = (field, value) => {
    let errorMsg = '';
    switch (field) {
      case 'accountName':
      case 'fullName':
        if (!value || !value.trim()) errorMsg = 'Vui lòng nhập họ tên';
        break;
      case 'accountNumber':
        if (!value || !value.trim()) errorMsg = 'Vui lòng nhập số tài khoản';
        else if (!/^\d+$/.test(value)) errorMsg = 'Số tài khoản chỉ được chứa chữ số';
        break;
      case 'bankName':
        if (!value) errorMsg = 'Vui lòng chọn ngân hàng';
        break;
      case 'branch':
        if (!value) errorMsg = 'Vui lòng chọn chi nhánh';
        break;
      case 'address':
        if (!value || !value.trim()) errorMsg = 'Vui lòng nhập địa chỉ';
        break;
      case 'taxCode':
        if (businessType === 'Doanh nghiệp' && (!value || !value.trim())) {
          errorMsg = 'Doanh nghiệp bắt buộc phải có Mã số thuế';
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      paymentInfo: {
        ...(prev.paymentInfo || paymentInfo),
        [field]: value
      }
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // --- [MỚI] HÀM ĐỒNG BỘ CHỦ TÀI KHOẢN VÀ HỌ TÊN (GÕ 1 ĐƯỢC 2) ---
  const handleSyncNameChange = (value) => {
    setEventData(prev => ({
      ...prev,
      paymentInfo: {
        ...(prev.paymentInfo || paymentInfo),
        accountName: value,
        fullName: value, 
        accountOwner: value 
      }
    }));
    // Xóa lỗi của cả 2 ô nếu có
    if (errors.accountName) setErrors(prev => ({ ...prev, accountName: '' }));
    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
  };

  return (
    <div className="max-w-[1100px] mx-auto text-gray-200 pb-20">
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
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0"><span className="text-red-500 mr-1">*</span>Chủ tài khoản:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={accountName}
                  onChange={(e) => handleSyncNameChange(e.target.value)} // Dùng hàm đồng bộ
                  onBlur={(e) => handleBlur('accountName', e.target.value)}
                  placeholder="TRẦN VĂN HẬU" 
                  className={`w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 uppercase transition-all ${errors.accountName ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{(accountName || '').length} / 100</span>
                {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
              </div>
            </div>

            {/* Row: Số tài khoản */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0"><span className="text-red-500 mr-1">*</span>Số tài khoản:</label>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  onBlur={(e) => handleBlur('accountNumber', e.target.value)}
                  placeholder="338858196" 
                  className={`w-full bg-white text-black text-sm p-2.5 rounded outline-none transition-all ${errors.accountNumber ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                />
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
              </div>
            </div>

            {/* Row: Tên ngân hàng (Select) */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0"><span className="text-red-500 mr-1">*</span>Tên ngân hàng:</label>
              <div className="flex-1 relative">
                <select 
                  value={bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  onBlur={(e) => handleBlur('bankName', e.target.value)}
                  className={`w-full appearance-none bg-white text-black text-sm p-2.5 rounded outline-none cursor-pointer transition-all ${errors.bankName ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`}
                >
                  <option value="">-- Chọn Ngân hàng --</option>
                  {bankList.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={18} />
                {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
              </div>
            </div>

            {/* Row: Chi nhánh (Select) */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0"><span className="text-red-500 mr-1">*</span>Chi nhánh (Tỉnh/Thành):</label>
              <div className="flex-1 relative">
                <select 
                  value={branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  onBlur={(e) => handleBlur('branch', e.target.value)}
                  className={`w-full appearance-none bg-white text-black text-sm p-2.5 rounded outline-none cursor-pointer transition-all ${errors.branch ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`}
                >
                  <option value="">-- Chọn Chi nhánh --</option>
                  {branchList.map(br => <option key={br} value={br}>{br}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" size={18} />
                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
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
                  value={businessType}
                  onChange={(e) => {
                    handleChange('businessType', e.target.value);
                    // Clear lỗi taxCode nếu chuyển lại thành Cá nhân
                    if (e.target.value === 'Cá nhân' && errors.taxCode) {
                      setErrors(prev => ({...prev, taxCode: ''}));
                    }
                  }}
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
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0"><span className="text-red-500 mr-1">*</span>Họ tên:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => handleSyncNameChange(e.target.value)} // Dùng hàm đồng bộ
                  onBlur={(e) => handleBlur('fullName', e.target.value)}
                  placeholder="Trần Văn Hậu" 
                  className={`w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 uppercase transition-all ${errors.fullName ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{(fullName || '').length} / 100</span>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
            </div>

            {/* Row: Địa chỉ */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0"><span className="text-red-500 mr-1">*</span>Địa chỉ:</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={(e) => handleBlur('address', e.target.value)}
                  placeholder="218 đường Lý Thường Kiệt" 
                  className={`w-full bg-white text-black text-sm p-2.5 rounded outline-none pr-16 transition-all ${errors.address ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                />
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{(address || '').length} / 100</span>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Row: Mã số thuế */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="md:w-[180px] text-sm font-bold md:text-right shrink-0">
                {businessType === 'Doanh nghiệp' && <span className="text-red-500 mr-1">*</span>}
                Mã số thuế:
              </label>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={taxCode}
                  onChange={(e) => handleChange('taxCode', e.target.value)}
                  onBlur={(e) => handleBlur('taxCode', e.target.value)}
                  placeholder="035467..." 
                  className={`w-full bg-white text-black text-sm p-2.5 rounded outline-none transition-all ${errors.taxCode ? 'border border-red-500 ring-1 ring-red-500' : 'focus:ring-2 focus:ring-[#00b14f]'}`} 
                />
                {errors.taxCode && <p className="text-red-500 text-xs mt-1">{errors.taxCode}</p>}
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Step4Payment;