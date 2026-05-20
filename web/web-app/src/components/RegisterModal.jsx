import React, { useState } from 'react';
import { X, EyeOff, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '../services/authService';
import OtpVerificationModal from './OtpVerificationModal';

// Render icon check hoặc X tùy theo điều kiện
const RuleIcon = ({ isValid }) => {
  if (isValid) return <CheckCircle2 size={14} fill="#26bc71" className="text-white shrink-0" />;
  return <XCircle size={14} fill="#d93025" className="text-white shrink-0" />;
};

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State quản lý form đăng ký
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Thêm state cho thông báo thành công và OTP
  const [successMsg, setSuccessMsg] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Nếu isOpen = false thì không render Modal
  if (!isOpen) return null;

  // Logic kiểm tra các điều kiện của mật khẩu
  const rules = {
    length: password.length >= 8 && password.length <= 32,
    numberAndLower: /(?=.*[a-z])(?=.*[0-9])/.test(password),
    specialChar: /(?=.*[!$@%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password), 
    upperCase: /(?=.*[A-Z])/.test(password)
  };
  
  // Nếu tất cả các điều kiện đều đúng thì pass = true
  const isPasswordValid = rules.length && rules.numberAndLower && rules.specialChar && rules.upperCase;

  // Hàm xử lý khi bấm Tiếp tục
  const handleRegister = async () => {
    // 1. Kiểm tra hai mật khẩu có khớp không
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpError('');
    setOtpSuccess('');
    
    try {
      const response = await authService.register(email, password);
      setSuccessMsg(response.message);
      setIsOtpStep(true);
      setShowOtpModal(true);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (code) => {
    if (code.trim().length !== 4) {
      setOtpError('Vui lòng nhập đúng 4 chữ số OTP.');
      return;
    }

    setIsLoading(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const response = await authService.verifyOtp(code.trim());
      setOtpSuccess(response.message);
      setTimeout(() => {
        onSwitchToLogin();
        setIsOtpStep(false);
        setShowOtpModal(false);
        setOtpCode('');
        setSuccessMsg('');
      }, 1200);
    } catch (error) {
      setOtpError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER XANH LÁ */}
        <div className="bg-[#26bc71] h-[60px] relative flex items-center justify-center">
          <h2 className="text-white text-[18px] font-bold">Đăng ký tài khoản</h2>
          <button 
            onClick={onClose}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-white/80 hover:text-white transition-colors p-1"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* NỘI DUNG FORM */}
        <div className="p-6 space-y-4">
          
          {/* Nút đăng ký Google */}
          <button className="w-full bg-[#1a73e8] hover:bg-[#155dbb] transition-colors text-white font-medium py-2 rounded flex items-center h-11 shadow-sm relative">
            <div className="absolute left-1 top-1 bottom-1 w-[36px] bg-white rounded-[3px] flex items-center justify-center">
               <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span className="flex-1 text-center text-[15px]">Đăng ký bằng Google</span>
          </button>

          {/* Dòng chữ HOẶC */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-gray-500 text-[13px]">Hoặc</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Input Email */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] transition-colors">
            <input 
              type="text" 
              placeholder="Nhập email của bạn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Input Mật khẩu (Viền đổi màu theo độ hợp lệ) */}
          <div className={`flex items-center border rounded-md px-3 h-11 transition-colors ${password.length > 0 && !isPasswordValid ? 'border-red-500' : 'border-gray-300 focus-within:border-[#26bc71]'}`}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Nhập mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="outline-none shrink-0">
              {showPassword ? <Eye size={18} className="text-gray-400" /> : <EyeOff size={18} className="text-gray-400" />}
            </button>
          </div>

          {/* Input Nhập lại Mật khẩu */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] transition-colors">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Nhập lại mật khẩu" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400"
            />
            <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="outline-none shrink-0">
              {showConfirmPassword ? <Eye size={18} className="text-gray-400" /> : <EyeOff size={18} className="text-gray-400" />}
            </button>
          </div>

          {/* BẢNG BÁO LỖI (Chỉ hiện khi mật khẩu chưa hợp lệ) */}
          {!isPasswordValid && (
             <div className="border border-red-400 rounded-md p-4 bg-white space-y-3">
              <div className="flex items-center gap-2 text-[#d93025] font-bold text-[14px]">
                <XCircle size={16} fill="#d93025" className="text-white" />
                <span>Mật khẩu chưa hợp lệ</span>
              </div>
              <ul className="space-y-2.5 text-[13px] text-[#444] ml-1">
                <li className={`flex items-center gap-2 ${rules.length ? 'text-[#26bc71]' : ''}`}>
                  <RuleIcon isValid={rules.length} />
                  <span>Từ 8 - 32 ký tự</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.numberAndLower ? 'text-[#26bc71]' : ''}`}>
                  <RuleIcon isValid={rules.numberAndLower} />
                  <span>Bao gồm chữ thường và số</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.specialChar ? 'text-[#26bc71]' : ''}`}>
                  <RuleIcon isValid={rules.specialChar} />
                  <span>Bao gồm ký tự đặc biệt (!,$,@,%,...)</span>
                </li>
                <li className={`flex items-center gap-2 ${rules.upperCase ? 'text-[#26bc71]' : ''}`}>
                  <RuleIcon isValid={rules.upperCase} />
                  <span>Có ít nhất 1 ký tự in hoa</span>
                </li>
              </ul>
            </div>
          )}

          {/* HIỂN THỊ LỖI (Trùng pass, trùng email...) */}
          {errorMsg && (
            <p className="text-red-500 text-[13px] font-medium m-0 text-center">{errorMsg}</p>
          )}

          {successMsg && !isOtpStep && (
            <p className="text-[#26bc71] text-[13px] font-bold m-0 text-center">{successMsg}</p>
          )}

          {/* Đã có tài khoản? Đăng nhập */}
          <div className="text-center text-[14px] pt-2">
            <span className="text-gray-500 font-medium">Đã có tài khoản? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-[#26bc71] font-bold hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>

          {/* Giả lập Cloudflare Captcha */}
          <div className="w-full h-[64px] border border-[#e0e0e0] bg-[#fafafa] rounded shadow-sm flex items-center justify-between px-4 mt-2">
            <div className="flex items-center gap-2.5 text-sm text-[#333]">
              <CheckCircle2 size={26} fill="#26bc71" className="text-white" />
              <span>Thành công!</span>
            </div>
            <div className="flex flex-col items-end mt-1">
              <span className="font-bold text-gray-700 text-xs">CLOUDFLARE</span>
              <div className="text-[9px] text-gray-500 flex gap-1">
                <a href="#" className="hover:underline">Quyền riêng tư</a> •
                <a href="#" className="hover:underline">Điều khoản</a>
              </div>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={!isPasswordValid || !email || !confirmPassword || isLoading}
            className={`w-full font-bold py-3 rounded-md text-[15px] transition-colors mt-2 ${
              isPasswordValid && email && confirmPassword && !isLoading
                ? 'bg-[#26bc71] text-white cursor-pointer hover:bg-[#23a861]'
                : 'bg-[#e0e0e0] text-[#999] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Đang tạo tài khoản...' : 'Tiếp tục'}
          </button>
        
        </div>
      </div>

      {showOtpModal && (
        <OtpVerificationModal
          isOpen={showOtpModal}
          email={email}
          isLoading={isLoading}
          errorMsg={otpError}
          successMsg={otpSuccess || successMsg}
          onClose={() => {
            setShowOtpModal(false);
            setIsOtpStep(false);
          }}
          onVerify={handleVerifyOtp}
          onResend={async () => {
            setOtpError('');
            setIsLoading(true);
            try {
              await authService.resendOtp();
              setOtpSuccess('OTP đã được gửi lại.');
            } catch (err) {
              setOtpError(err.message);
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}

    </div>
  );
};

export default RegisterModal;