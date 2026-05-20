import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Ticket, User, ChevronDown, LogOut, CalendarDays } from 'lucide-react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import SearchOverlay from './SearchOverlay';
import { authService } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // MỚI & ĐÃ SỬA: Lấy dữ liệu từ localStorage ngay lúc khởi tạo State 
  // (Dùng arrow function để chỉ chạy 1 lần duy nhất khi component mount)
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('jwt_token'));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user_email') || '');

  // State quản lý việc mở/đóng menu Tài khoản
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State quản lý tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dùng useRef để xử lý click ra ngoài thì đóng menu
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // ĐÃ SỬA: Chỉ giữ lại logic bắt sự kiện click ra ngoài trong useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu click vào một điểm trên màn hình KHÔNG nằm trong dropdownRef thì đóng menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function để gỡ sự kiện khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Cảnh báo cascading renders sẽ biến mất vì không còn setState đồng bộ ở đây nữa

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    authService.logout(); // Xóa dữ liệu trong localStorage
    setIsLoggedIn(false); // Cập nhật state để Header đổi giao diện ngay lập tức
    setUserEmail('');
    setIsDropdownOpen(false); // Đóng menu thả xuống
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <header className="bg-[#26bc71] py-3 px-4 flex items-center justify-between sticky top-0 z-50 font-sans text-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">

          {/* Cụm Bên Trái: Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-1 cursor-pointer">
              <span className="text-2xl font-bold tracking-tighter">ticketbox</span>
              <span className="text-lg">🌸</span>
            </Link>
          </div>

          {/* Cụm Giữa: Thanh tìm kiếm */}
          <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
            <div className="relative flex items-center bg-white rounded-md overflow-hidden h-10 shadow-sm">
              <div className="pl-3 text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Bạn tìm gì hôm nay?"
                className="w-full bg-transparent py-2 px-3 text-gray-700 outline-none text-sm"
              />
              <div className="h-5 w-[1px] bg-gray-200"></div>
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="px-5 text-[#555] hover:text-[#26bc71] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Tìm kiếm
              </button>
            </div>

            {isSearchOpen && (
              <SearchOverlay
                query={searchQuery}
                onSelectSuggestion={(value) => {
                  setSearchQuery(value);
                  setIsSearchOpen(false);
                }}
                onClose={() => setIsSearchOpen(false)}
              />
            )}
          </div>

          {/* Cụm Bên Phải */}
          <div className="flex items-center gap-6 text-sm font-medium whitespace-nowrap shrink-0">
            <Link to="/organizer" className="border border-white/80 rounded-full px-5 py-1.5 hover:bg-white/20 transition-colors">
              Tạo sự kiện
            </Link>

            <div
              onClick={() => navigate('/my-account/tickets')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <Ticket size={18} />
              <span>Vé của tôi</span>
            </div>

            {/* === KIỂM TRA ĐĂNG NHẬP ĐỂ ĐỔI GIAO DIỆN === */}
            {!isLoggedIn ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="cursor-pointer hover:opacity-80 transition-opacity font-medium outline-none"
              >
                Đăng nhập | Đăng ký
              </button>
            ) : (
              // CỤM MENU TÀI KHOẢN KHI ĐÃ ĐĂNG NHẬP
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity outline-none"
                >
                  {/* Avatar hình chú chó */}
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center overflow-hidden border border-white/40">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/616/616554.png"
                      alt="Avatar"
                      className="w-5 h-5 object-contain opacity-80"
                    />
                  </div>
                  <span className="font-medium">Tài khoản</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* MENU XỔ XUỐNG */}
                <DropDownMenu isDropdownOpen={isDropdownOpen} handleLogout={handleLogout} onClose={() => setIsDropdownOpen(false)} />
              </div>
            )}

            {/* Cục Admin */}
            <Link to="/admin" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
              <User size={18} />
              <span>Admin</span>
            </Link>

            {/* Nút chọn Quốc gia */}
            <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-5 h-5 rounded-full bg-[#da251d] flex items-center justify-center text-yellow-300 text-[10px] shadow-sm">
                ★
              </div>
              <ChevronDown size={14} />
            </div>
          </div>

        </div>
      </header>

      {/* Gọi Modal Đăng Nhập & Đăng Ký */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </>
  );
}

export default Header;

const accountMenuItems = [
  {
    icon: User,
    label: "Tài khoản của tôi",
    to: "/my-account",
  },
  {
    icon: Ticket,
    label: "Vé của tôi",
    to: "/my-account/tickets",
  },
];

const DropDownMenu = ({ isDropdownOpen, handleLogout, onClose }) => {
  if (!isDropdownOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

      {/* MENU */}
      <div className="py-2">

        {accountMenuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded transition ${isActive ? 'bg-[#26bc71] text-black' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={18} className="text-gray-500" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-100"></div>

      {/* LOGOUT */}
      <div className="py-1.5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>

    </div>
  );
};