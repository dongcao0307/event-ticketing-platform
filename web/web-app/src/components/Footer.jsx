import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Link2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '13px', lineHeight: 1.7 }}>

      {/* ─── TOP SECTION ─── */}
      <div className="tb-footer-top" style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>

          {/* Column 1: Contact info */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Hotline</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <Phone size={13} />
                <span>Thứ 2 - Chủ Nhật (8:00 - 23:00)</span>
              </div>
              <div style={{ color: 'var(--brand-green)', fontWeight: 700, fontSize: '17px', marginBottom: '20px' }}>1900.6408</div>

              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px', fontSize: '13px' }}>Email</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                <Mail size={13} />
                <a href="mailto:support@ticketbox.vn" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  support@ticketbox.vn
                </a>
              </div>

              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px', fontSize: '13px' }}>Văn phòng chính</h4>
              <div style={{ display: 'flex', gap: '6px', color: 'var(--text-muted)' }}>
                <MapPin size={13} style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Tầng 12, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, Phường 12, Quận 10, TP. Hồ Chí Minh</span>
              </div>
            </div>

            {/* App downloads */}
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Ứng dụng Ticketbox</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '144px' }}>
                {['Google_Play_Store_badge_EN', 'Download_on_the_App_Store_Badge'].map((badge, i) => (
                  <button key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#111',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <img
                      src={`https://upload.wikimedia.org/wikipedia/commons/${i === 0 ? '7/78/Google_Play_Store_badge_EN.svg' : '3/3c/Download_on_the_App_Store_Badge.svg'}`}
                      alt={i === 0 ? 'Google Play' : 'App Store'}
                      style={{ height: '22px' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: For customers & organizers */}
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Dành cho Khách hàng</h4>
              <FooterLink href="#">Điều khoản sử dụng cho khách hàng</FooterLink>
            </div>
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Dành cho Ban Tổ chức</h4>
              <FooterLink href="#">Điều khoản sử dụng cho ban tổ chức</FooterLink>
            </div>

            <div style={{ marginTop: '40px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Ứng dụng check-in cho Ban Tổ chức</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '144px' }}>
                {[0, 1].map((i) => (
                  <button key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', background: '#111',
                    border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <img
                      src={`https://upload.wikimedia.org/wikipedia/commons/${i === 0 ? '7/78/Google_Play_Store_badge_EN.svg' : '3/3c/Download_on_the_App_Store_Badge.svg'}`}
                      alt={i === 0 ? 'Google Play' : 'App Store'}
                      style={{ height: '22px' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Company & Social */}
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Về công ty chúng tôi</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Quy chế hoạt động',
                  'Chính sách bảo mật thông tin',
                  'Cơ chế giải quyết tranh chấp/ khiếu nại',
                  'Chính sách bảo mật thanh toán',
                  'Chính sách đổi trả và kiểm hàng',
                  'Điều kiện vận chuyển và giao nhận',
                  'Phương thức thanh toán',
                ].map((label) => (
                  <li key={label}><FooterLink href="#">{label}</FooterLink></li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px', fontSize: '13px' }}>Follow us</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SocialBtn bg="#1877F2"><Facebook size={15} fill="white" stroke="none" /></SocialBtn>
                <SocialBtn bg="linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)"><Instagram size={15} /></SocialBtn>
                <SocialBtn bg="#000" border>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>TikTok</span>
                </SocialBtn>
                <SocialBtn bg="#333"><Link2 size={15} /></SocialBtn>
                <SocialBtn bg="#0A66C2"><Linkedin size={15} fill="white" stroke="none" /></SocialBtn>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px', fontSize: '13px' }}>Ngôn ngữ</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <img src="https://flagcdn.com/w40/vn.png" alt="VN" style={{ width: '32px', height: '22px', objectFit: 'cover', cursor: 'pointer', borderRadius: '3px', opacity: 0.9 }} />
                <img src="https://flagcdn.com/w40/gb.png" alt="UK" style={{ width: '32px', height: '22px', objectFit: 'cover', cursor: 'pointer', borderRadius: '3px', opacity: 0.6 }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── BOTTOM SECTION ─── */}
      <div className="tb-footer-bottom" style={{ padding: '28px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
              <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>ticketbox</h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>by</span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>VNPAY</span>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 2px' }}>Nền tảng quản lý và phân phối vé sự kiện hàng đầu Việt Nam</p>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>© 2017</p>
          </div>

          <div style={{ maxWidth: '380px' }}>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>Công ty TNHH Ticketbox</p>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>Đại diện theo pháp luật: Phạm Thị Hương</p>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '12px' }}>
              Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444, cấp lần đầu ngày 07/01/2016 bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh
            </p>
          </div>

          <div style={{ flexShrink: 0 }}>
            <div style={{ width: '130px', height: '48px' }}>
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png"
                alt="Đã đăng ký Bộ Công Thương"
                style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer', filter: 'brightness(0.85)' }}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://theme.hstatic.net/1000026602/1001190518/14/logo-bct.png'; }}
              />
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;

// ─── Small helper components ─────────────────────────────────
const FooterLink = ({ href, children }) => (
  <a
    href={href}
    style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', transition: 'color 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
  >
    {children}
  </a>
);

const SocialBtn = ({ bg, border, children }) => (
  <a
    href="#"
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: bg,
      border: border ? '1px solid var(--border-medium)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      transition: 'opacity 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.transform = 'scale(1.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
  >
    {children}
  </a>
);