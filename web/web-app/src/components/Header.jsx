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
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('jwt_token'));
  const isAdmin = user?.role === 'ADMIN';

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Listen for openLoginModal event from other components
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setIsLoginOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
    };
  }, []);

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  // Handle create event button - require authentication
  const handleCreateEventClick = () => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    navigate('/organizer');
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
                onClick={() => {
                  setIsSearchOpen(false)
                  navigate(`/search?find=${searchQuery}`)
                }}
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
            <button 
              onClick={handleCreateEventClick}
              className="border border-white/80 rounded-full px-5 py-1.5 hover:bg-white/20 transition-colors cursor-pointer"
              title={isLoggedIn ? "Tạo sự kiện mới" : "Đăng nhập để tạo sự kiện"}
            >
              Tạo sự kiện
            </button>

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
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <User size={18} />
                <span>Admin</span>
              </Link>
            )}

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
  const user = authService.getCurrentUser();
  const userRole = user?.role || 'USER';
  const roleLabel = userRole === 'ADMIN' ? '👨‍💼 Quản trị viên' : '👤 Người dùng';

  if (!isDropdownOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

      {/* USER INFO */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-400">Tài khoản hiện tại</p>
        <p className="text-sm font-bold text-gray-800 truncate">{user?.email || 'User'}</p>
        <p className="text-xs text-gray-500 mt-1">{roleLabel}</p>
      </div>

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

        {/* ADMIN MENU - Hiển thị nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <>
            <div className="mx-2 my-2 border-t border-gray-100"></div>
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded transition ${isActive ? 'bg-[#26bc71] text-black' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <User size={18} className="text-gray-500" />
              <span>🔧 Bảng điều khiển Admin</span>
            </NavLink>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div className="p-1.5 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};