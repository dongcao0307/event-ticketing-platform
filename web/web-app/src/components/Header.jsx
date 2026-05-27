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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for openLoginModal event from other components
  useEffect(() => {
    const handleOpenLoginModal = () => setIsLoginOpen(true);
    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => window.removeEventListener('openLoginModal', handleOpenLoginModal);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
  };

  const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
  const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };

  const handleCreateEventClick = () => {
    if (!isLoggedIn) { setIsLoginOpen(true); return; }
    navigate('/organizer');
  };

  return (
    <>
      {/* ================================================================
          HEADER - Green gradient background, Ticketbox style
          ================================================================ */}
      <header className="tb-header" style={{ padding: '10px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          gap: '16px',
        }}>

          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'white', letterSpacing: '-1px', fontFamily: 'Inter, sans-serif' }}>
                ticketbox
              </span>
              <span style={{ fontSize: '16px' }}>🌸</span>
            </Link>
          </div>

          {/* Search bar */}
          <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }} ref={searchRef}>
            <div className="tb-search-bar" style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
              <div style={{ paddingLeft: '14px', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Bạn tìm gì hôm nay?"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: '0 10px',
                  fontSize: '13px',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <div style={{ width: '1px', height: '18px', background: '#e5e7eb' }} />
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); navigate(`/search?q=${searchQuery}`); }}
                style={{
                  padding: '0 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#26bc71',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Tìm kiếm
              </button>
            </div>

            {isSearchOpen && (
              <SearchOverlay
                query={searchQuery}
                onSelectSuggestion={(value) => { setSearchQuery(value); setIsSearchOpen(false); }}
                onClose={() => setIsSearchOpen(false)}
              />
            )}
          </div>

          {/* Right actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            fontSize: '13px',
            fontWeight: 500,
            color: 'white',
            flexShrink: 0,
          }}>
            <button
              onClick={handleCreateEventClick}
              className="tb-header-btn"
              title={isLoggedIn ? 'Tạo sự kiện mới' : 'Đăng nhập để tạo sự kiện'}
            >
              Tạo sự kiện
            </button>

            <div
              onClick={() => navigate('/my-account/tickets')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: 0.9, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
            >
              <Ticket size={16} />
              <span>Vé của tôi</span>
            </div>

            {!isLoggedIn ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                  opacity: 0.9,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
              >
                Đăng nhập | Đăng ký
              </button>
            ) : (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255,255,255,0.5)',
                  }}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/616/616554.png"
                      alt="Avatar"
                      style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: 0.85 }}
                    />
                  </div>
                  <span>Tài khoản</span>
                  <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                <DropDownMenu isDropdownOpen={isDropdownOpen} handleLogout={handleLogout} onClose={() => setIsDropdownOpen(false)} />
              </div>
            )}

            {isAdmin && (
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', textDecoration: 'none', opacity: 0.9 }}>
                <User size={16} />
                <span>Admin</span>
              </Link>
            )}

            {/* Vietnam flag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: 0.9 }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#da251d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#fde047',
              }}>★</div>
              <ChevronDown size={13} />
            </div>
          </div>

        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </>
  );
};

export default Header;

// ===================================================================
const accountMenuItems = [
  { icon: User, label: 'Tài khoản của tôi', to: '/my-account' },
  { icon: Ticket, label: 'Vé của tôi', to: '/my-account/tickets' },
];

const DropDownMenu = ({ isDropdownOpen, handleLogout, onClose }) => {
  const user = authService.getCurrentUser();
  const userRole = user?.role || 'USER';
  const roleLabel = userRole === 'ADMIN' ? '👨‍💼 Quản trị viên' : '👤 Người dùng';

  if (!isDropdownOpen) return null;

  return (
    <div
      className="tb-dropdown"
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 10px)',
        width: '240px',
        overflow: 'hidden',
        zIndex: 200,
      }}
    >
      {/* User info */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Tài khoản hiện tại</p>
        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email || 'User'}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{roleLabel}</p>
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px' }}>
        {accountMenuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `tb-dropdown-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} style={{ opacity: 0.7 }} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {userRole === 'ADMIN' && (
          <>
            <div style={{ margin: '4px 6px', borderTop: '1px solid var(--border-subtle)' }} />
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `tb-dropdown-item ${isActive ? 'active' : ''}`}
            >
              <User size={15} style={{ opacity: 0.7 }} />
              <span>Bảng điều khiển Admin</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Logout */}
      <div style={{ padding: '4px 6px 6px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#ef4444',
            background: 'none',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={15} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};