import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, User, LogOut } from 'lucide-react';
import { authService } from '../services/authService'; // Đảm bảo đường dẫn này đúng

const OrganizerHeader = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Khởi tạo state đăng nhập trực tiếp từ localStorage để tránh render 2 lần
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('jwt_token'));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Xử lý đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserEmail('');
    setIsDropdownOpen(false);
    navigate('/'); // Sau khi đăng xuất thì đẩy về trang chủ
  };

  return (
    <header className="w-full h-[76px] bg-[#1a211e] flex items-center justify-end px-8 border-b border-white/5 font-sans relative z-[60]">
      
      <div className="flex items-center gap-6 shrink-0">
        
        {/* NÚT TẠO SỰ KIỆN */}
        <Link 
          to="/organizer" 
          className="flex items-center gap-1.5 bg-[#29c371] hover:bg-[#23a861] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tạo sự kiện</span>
        </Link>

        {/* NÚT TÀI KHOẢN (Chỉ hiển thị khi đã đăng nhập) */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              {/* Avatar vòng tròn trắng */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-300 shadow-sm shrink-0 overflow-hidden">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/616/616554.png" 
                  alt="Avatar" 
                  className="w-6 h-6 object-contain opacity-80"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="text-[#e2e8f0] text-sm font-medium leading-none mb-1">Tài khoản</span>
                <span className="text-gray-500 text-[10px] truncate max-w-[100px]">{userEmail.split('@')[0]}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 mt-0.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* DROPDOWN MENU */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-xs text-gray-400">Đang quản lý bởi</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{userEmail}</p>
                </div>
                
                <div className="p-1.5">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Nếu chưa đăng nhập thì hiện nút Quay lại trang chủ để Login */
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            Đăng nhập
          </Link>
        )}

      </div>
    </header>
  );
};

export default OrganizerHeader;