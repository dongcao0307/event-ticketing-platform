import React, { useState, useMemo, useEffect } from 'react';
import { X, Info, EyeOff, Eye, Loader2 } from 'lucide-react';
import mascotImg from '../assets/mascot.png';
import { authService } from '../services/authService'; // Nhớ tạo file này như hướng dẫn trước đó
import Turnstile from './Turnstile';
import { createCallLimiter } from '../utils/rateLimiter';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // State quản lý form đăng nhập
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState(null);
  
  // Rate Limiter state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 phút

  // Tự động đếm ngược và mở khóa khi hết thời gian lockout
  useEffect(() => {
    if (!lockoutTime) return;
    
    setCurrentTime(new Date().getTime());

    const interval = setInterval(() => {
      const now = new Date().getTime();
      setCurrentTime(now);
      if (now >= lockoutTime) {
        setLockoutTime(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  // Kiểm tra xem có bị khóa do quá nhiều lần thất bại
  const isLockedOut = lockoutTime && currentTime < lockoutTime;
  const remainingLockoutTime = isLockedOut ? Math.ceil((lockoutTime - currentTime) / 1000) : 0;

  // Hàm xử lý Đăng nhập
  const handleLogin = async () => {
    // Ngăn người dùng bấm nếu chưa nhập đủ thông tin hoặc bị khóa hoặc chưa xác thực Turnstile
    if (!input || !password || isLockedOut || !turnstileToken) return;
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      // Phát hiện loại đầu vào (email hay username)
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input || '').trim());
      const loginData = {
        password,
        turnstileToken,
        ...(isEmail ? { email: input } : { userName: input })
      };

      // Gọi service đăng nhập
      await authService.login(loginData);
      
      // Reset rate limiter nếu đăng nhập thành công
      setFailedAttempts(0);
      setLockoutTime(null);
      
      // Nếu đăng nhập thành công, load lại trang để Header cập nhật giao diện
      window.location.reload(); 
    } catch (error) {
      // Nếu backend/nginx trả 429 (Too Many Requests), hiển thị thông báo riêng
      if (error?.status === 429) {
        // không tăng failedAttempts, nhưng tạm thông báo và khóa UI nhẹ trong 60s
        const serverLockMs = 60 * 1000; // 1 phút tạm thời
        setLockoutTime(new Date().getTime() + serverLockMs);
        setErrorMsg('Quá nhiều yêu cầu đăng nhập. Vui lòng thử lại sau vài chục giây.');
        return;
      }

      // Tăng số lần thất bại (logic theo trước)
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // Nếu vượt quá số lần cho phép, khóa tài khoản
      if (newFailedAttempts >= MAX_ATTEMPTS) {
        const newLockoutTime = new Date().getTime() + LOCKOUT_DURATION;
        setLockoutTime(newLockoutTime);
        setErrorMsg(`Quá nhiều lần thất bại. Vui lòng thử lại sau ${Math.ceil(LOCKOUT_DURATION / 60000)} phút.`);
      } else {
        const attemptsLeft = MAX_ATTEMPTS - newFailedAttempts;
        setErrorMsg(`${error.message} (Còn ${attemptsLeft} lần thử)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side limiter to avoid rapid repeated login attempts (5 calls / 1s)
  const loginCallLimiter = useMemo(() => createCallLimiter(5, 1000), []);

  const handleLoginWithLimiter = async () => {
    try {
      await loginCallLimiter.call(handleLogin);
    } catch (err) {
      // If too many local clicks
      if (err?.code === 'TOO_MANY_REQUESTS') {
        setErrorMsg('Quá nhiều yêu cầu. Vui lòng thử lại sau vài giây.');
        return;
      }
      // Unexpected error: rethrow so it surfaces in console during dev
      throw err;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* === HEADER XANH LÁ === */}
        <div className="bg-[#26bc71] h-[90px] px-6 relative flex items-center overflow-hidden">
          <h2 className="text-white text-[22px] font-bold z-10">Đăng nhập</h2>
          
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors p-1 z-20"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* HÌNH MASCOT CHÚ CHÓ */}
          <img 
            src={mascotImg}   
            alt="Mascot Shiba" 
            className="absolute bottom-[-2px] right-2 w-[85px] object-contain pointer-events-none z-0"
          />
        </div>

        {/* NỘI DUNG FORM */}
        <div className="p-6 pt-8 space-y-4 relative z-0">
          
          {/* Input Tên đăng nhập / Email */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] focus-within:ring-1 focus-within:ring-[#26bc71] transition-all bg-white">
            <input 
              type="text" 
              placeholder="Nhập tên đăng nhập hoặc email" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLockedOut}
              className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
            />
            <Info size={18} className="text-gray-400 cursor-pointer shrink-0" />
          </div>

          {/* Input Mật khẩu */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] focus-within:ring-1 focus-within:ring-[#26bc71] transition-all bg-white">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Nhập mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLockedOut}
              className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="outline-none shrink-0" disabled={isLockedOut}>
              {showPassword ? (
                <Eye size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeOff size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>

          {/* HIỂN THỊ THÔNG BÁO LỖI (NẾU ĐĂNG NHẬP SAI) */}
          {errorMsg && (
            <p className={`text-[13px] font-medium m-0 ${isLockedOut ? 'text-orange-500' : 'text-red-500'}`}>{errorMsg}</p>
          )}

          {/* Nút Tiếp tục */}
          <button 
            onClick={handleLoginWithLimiter}
            disabled={!input || !password || isLoading || isLockedOut || !turnstileToken}
            className={`w-full font-bold py-2.5 rounded-md text-[15px] transition-colors mt-2 
              ${(!input || !password || isLoading || isLockedOut || !turnstileToken) ? 'bg-[#e0e0e0] text-[#999] cursor-not-allowed' : 'bg-[#26bc71] text-white cursor-pointer hover:bg-[#23a861]'}
            `}
          >
            {isLockedOut ? `Thử lại sau ${remainingLockoutTime}s` : isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>

          {/* Cloudflare Turnstile CAPTCHA */}
          <Turnstile 
            sitekey="1x00000000000000000000AA" 
            onVerify={(token) => setTurnstileToken(token)} 
          />

          {/* === QUÊN MẬT KHẨU & TẠO TÀI KHOẢN === */}
          <div className="text-center text-[14px] mt-4 space-y-1.5">
            <a href="#" className="text-gray-500 hover:text-[#26bc71] transition-colors block font-medium">
              Quên mật khẩu?
            </a>
            <div className="text-gray-500 font-medium">
              Chưa có tài khoản? 
              <button 
                onClick={onSwitchToRegister} 
                className="text-[#26bc71] hover:underline font-bold ml-1 outline-none cursor-pointer"
              >
                Tạo tài khoản ngay
              </button>
            </div>
          </div>

          {/* Dòng chữ HOẶC */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-medium">Hoặc</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Nút đăng nhập Google */}
          <button className="w-full bg-[#1a73e8] hover:bg-[#155dbb] transition-colors text-white font-medium py-2 rounded flex items-center justify-center gap-3 h-10 shadow-sm relative cursor-pointer">
            <div className="absolute left-1 top-1 bottom-1 w-8 bg-white rounded-sm flex items-center justify-center">
               <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span className="text-[14px] tracking-wide">Đăng nhập bằng Google</span>
          </button>

          {/* Điều khoản sử dụng */}
          <div className="text-center text-[11px] text-gray-500 mt-6 leading-relaxed px-2">
            Bằng việc tiếp tục, bạn đã đọc và đồng ý với <a href="#" className="text-[#26bc71] hover:underline font-medium">Điều khoản sử dụng</a> và <a href="#" className="text-[#26bc71] hover:underline font-medium">Chính sách bảo mật thông tin cá nhân</a> của Ticketbox
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;