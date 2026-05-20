import React, { useState, useEffect, useRef } from 'react';
import { X, Info, EyeOff, Eye, Loader2, ShieldAlert } from 'lucide-react';
import mascotImg from '../assets/mascot.png';
import { authService } from '../services/authService';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_LOCKOUT_MS = 5 * 60 * 1000;

const getRateLimitState = () => {
  try {
    const raw = localStorage.getItem('login_rate_limit');
    return raw ? JSON.parse(raw) : { attempts: [], lockedUntil: null };
  } catch {
    return { attempts: [], lockedUntil: null };
  }
};

const setRateLimitState = (state) => {
  localStorage.setItem('login_rate_limit', JSON.stringify(state));
};

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const checkLockout = () => {
      const state = getRateLimitState();
      if (state.lockedUntil && Date.now() < state.lockedUntil) {
        setLockoutRemaining(Math.ceil((state.lockedUntil - Date.now()) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    };
    checkLockout();
    timerRef.current = setInterval(() => {
      const state = getRateLimitState();
      if (state.lockedUntil && Date.now() < state.lockedUntil) {
        setLockoutRemaining(Math.ceil((state.lockedUntil - Date.now()) / 1000));
      } else {
        setLockoutRemaining(0);
        clearInterval(timerRef.current);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  const isLocked = lockoutRemaining > 0;

  const formatLockout = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m} phút ${s} giây` : `${s} giây`;
  };

  const handleLogin = async () => {
    if (!email || !password || isLocked) return;

    const now = Date.now();
    const state = getRateLimitState();
    const recentAttempts = state.attempts.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (recentAttempts.length >= RATE_LIMIT_MAX) {
      const lockedUntil = now + RATE_LIMIT_LOCKOUT_MS;
      setRateLimitState({ attempts: recentAttempts, lockedUntil });
      setLockoutRemaining(Math.ceil(RATE_LIMIT_LOCKOUT_MS / 1000));
      setErrorMsg(`Quá nhiều lần thử. Vui lòng đợi ${formatLockout(Math.ceil(RATE_LIMIT_LOCKOUT_MS / 1000))}.`);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await authService.login(email, password);
      setRateLimitState({ attempts: [], lockedUntil: null });
      window.location.reload();
    } catch (error) {
      const updatedAttempts = [...recentAttempts, now];
      const remaining = RATE_LIMIT_MAX - updatedAttempts.length;
      setRateLimitState({ attempts: updatedAttempts, lockedUntil: state.lockedUntil });
      if (remaining <= 0) {
        const lockedUntil = now + RATE_LIMIT_LOCKOUT_MS;
        setRateLimitState({ attempts: updatedAttempts, lockedUntil });
        setLockoutRemaining(Math.ceil(RATE_LIMIT_LOCKOUT_MS / 1000));
        setErrorMsg(`Quá nhiều lần thử. Tài khoản bị tạm khóa ${formatLockout(Math.ceil(RATE_LIMIT_LOCKOUT_MS / 1000))}.`);
      } else {
        setErrorMsg(`${error.message} (còn ${remaining} lần thử)`);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          
          {/* Input Email/SĐT */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 h-11 focus-within:border-[#26bc71] focus-within:ring-1 focus-within:ring-[#26bc71] transition-all bg-white">
            <input 
              type="text" 
              placeholder="Nhập email hoặc tên đăng nhập" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400 bg-transparent"
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
              className="flex-1 w-full outline-none text-[15px] text-gray-700 placeholder:text-gray-400 bg-transparent"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="outline-none shrink-0">
              {showPassword ? (
                <Eye size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeOff size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>

          {/* THÔNG BÁO KHÓA TÀI KHOẢN */}
          {isLocked && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2.5">
              <ShieldAlert size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-600 text-[13px] font-medium leading-snug">
                Đăng nhập tạm bị khóa do quá nhiều lần thử sai.<br />
                Vui lòng thử lại sau <span className="font-bold">{formatLockout(lockoutRemaining)}</span>.
              </p>
            </div>
          )}

          {/* HIỂN THỊ THÔNG BÁO LỖI (NẾU ĐĂNG NHẬP SAI) */}
          {errorMsg && !isLocked && (
            <p className="text-red-500 text-[13px] font-medium m-0">{errorMsg}</p>
          )}

          {/* Nút Tiếp tục */}
          <button 
            onClick={handleLogin}
            disabled={!email || !password || isLoading || isLocked}
            className={`w-full font-bold py-2.5 rounded-md text-[15px] transition-colors mt-2 
              ${(!email || !password || isLoading || isLocked) ? 'bg-[#e0e0e0] text-[#999] cursor-not-allowed' : 'bg-[#26bc71] text-white cursor-pointer hover:bg-[#23a861]'}
            `}
          >
            {isLoading ? 'Đang xử lý...' : isLocked ? `Chờ ${formatLockout(lockoutRemaining)}` : 'Tiếp tục'}
          </button>

          {/* Giả lập Cloudflare Captcha */}
          <div className="w-full h-[60px] border border-[#e0e0e0] bg-[#fafafa] rounded shadow-sm flex items-center justify-between px-4 mt-4">
            <div className="flex items-center gap-3 text-sm text-[#333]">
              <Loader2 size={24} className="text-[#26bc71] animate-spin" />
              <span>Đang xác minh...</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-700 text-xs">CLOUDFLARE</span>
              <div className="text-[9px] text-gray-500 flex gap-1">
                <a href="#" className="hover:underline">Quyền riêng tư</a> • 
                <a href="#" className="hover:underline">Điều khoản</a>
              </div>
            </div>
          </div>

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