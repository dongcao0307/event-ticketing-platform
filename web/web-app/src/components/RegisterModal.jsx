import React, { useState } from 'react';
import { X, EyeOff, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '../services/authService';

const RuleIcon = ({ isValid }) => {
  if (isValid) return <CheckCircle2 size={14} fill="#26bc71" className="text-white shrink-0" />;
  return <XCircle size={14} fill="#d93025" className="text-white shrink-0" />;
};

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const rules = {
    length: password.length >= 8 && password.length <= 32,
    numberAndLower: /(?=.*[a-z])(?=.*[0-9])/.test(password),
    specialChar: /(?=.*[!$@%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password),
    upperCase: /(?=.*[A-Z])/.test(password),
  };
  const isPasswordValid = rules.length && rules.numberAndLower && rules.specialChar && rules.upperCase;

  const handleRegister = async () => {
    if (!userName.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập!');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await authService.register(userName.trim(), email.trim(), password, fullName.trim() || undefined);
      setSuccessMsg('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="bg-[#26bc71] h-[60px] relative flex items-center justify-center">
          <h2 className="text-white text-[18px] font-bold">Đăng ký tài khoản</h2>
          <button
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-white/80 hover:text-white transition-colors p-1"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 space-y-4">

          {/* Tên đăng nhập */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Tên đăng nhập *</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] transition-colors">
              <input
                type="text"
                placeholder="Ví dụ: nguyen_van_a"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Họ và tên</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] transition-colors">
              <input
                type="text"
                placeholder="Nhập họ tên của bạn"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email *</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] transition-colors">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Mật khẩu *</label>
            <div className={`flex items-center border rounded-md px-3 h-11 transition-colors ${password.length > 0 && !isPasswordValid ? 'border-red-500' : 'border-gray-300 focus-within:border-[#26bc71]'}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="outline-none shrink-0">
                {showPassword ? <Eye size={18} className="text-gray-400" /> : <EyeOff size={18} className="text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nhập lại mật khẩu *</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] transition-colors">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
              />
              <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="outline-none shrink-0">
                {showConfirmPassword ? <Eye size={18} className="text-gray-400" /> : <EyeOff size={18} className="text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Bảng điều kiện mật khẩu */}
          {password.length > 0 && !isPasswordValid && (
            <div className="border border-red-400 rounded-md p-4 bg-white space-y-2">
              <div className="flex items-center gap-2 text-[#d93025] font-bold text-[13px]">
                <XCircle size={15} fill="#d93025" className="text-white" />
                <span>Mật khẩu chưa hợp lệ</span>
              </div>
              <ul className="space-y-1.5 text-[12px] text-[#444] ml-1">
                <li className={`flex items-center gap-2 ${rules.length ? 'text-[#26bc71]' : ''}`}><RuleIcon isValid={rules.length} /><span>Từ 8 - 32 ký tự</span></li>
                <li className={`flex items-center gap-2 ${rules.numberAndLower ? 'text-[#26bc71]' : ''}`}><RuleIcon isValid={rules.numberAndLower} /><span>Bao gồm chữ thường và số</span></li>
                <li className={`flex items-center gap-2 ${rules.specialChar ? 'text-[#26bc71]' : ''}`}><RuleIcon isValid={rules.specialChar} /><span>Bao gồm ký tự đặc biệt (!,$,@,...)</span></li>
                <li className={`flex items-center gap-2 ${rules.upperCase ? 'text-[#26bc71]' : ''}`}><RuleIcon isValid={rules.upperCase} /><span>Có ít nhất 1 chữ in hoa</span></li>
              </ul>
            </div>
          )}

          {errorMsg && <p className="text-red-500 text-[13px] font-medium text-center">{errorMsg}</p>}
          {successMsg && <p className="text-[#26bc71] text-[13px] font-bold text-center">{successMsg}</p>}

          <div className="text-center text-[14px] pt-1">
            <span className="text-gray-500 font-medium">Đã có tài khoản? </span>
            <button onClick={onSwitchToLogin} className="text-[#26bc71] font-bold hover:underline">
              Đăng nhập ngay
            </button>
          </div>

          <button
            onClick={handleRegister}
            disabled={!isPasswordValid || !email || !userName || !confirmPassword || isLoading}
            className={`w-full font-bold py-3 rounded-md text-[15px] transition-colors ${
              isPasswordValid && email && userName && confirmPassword && !isLoading
                ? 'bg-[#26bc71] text-white cursor-pointer hover:bg-[#23a861]'
                : 'bg-[#e0e0e0] text-[#999] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
