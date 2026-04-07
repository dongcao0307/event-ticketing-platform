import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Link2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full font-sans text-[13px] leading-relaxed">
      {/* --- PHẦN TRÊN: Thông tin & Liên kết (Nền Xám Xanh) --- */}
      <div className="bg-[#383d47] text-[#9ca3af] py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* CỘT 1: Thông tin liên hệ */}
          <div>
            <div className="mb-10">
              <h4 className="text-white font-bold mb-4">Hotline</h4>
              <div className="flex items-center gap-2 mb-1">
                <Phone size={14} />
                <span>Thứ 2 - Chủ Nhật (8:00 - 23:00)</span>
              </div>
              <div className="text-[#26bc71] font-bold text-lg mb-6">1900.6408</div>

              <h4 className="text-white font-bold mb-4">Email</h4>
              <div className="flex items-center gap-2 mb-6">
                <Mail size={14} />
                <a href="mailto:support@ticketbox.vn" className="hover:text-white transition">
                  support@ticketbox.vn
                </a>
              </div>

              <h4 className="text-white font-bold mb-4">Văn phòng chính</h4>
              <div className="flex gap-2">
                <MapPin size={14} className="shrink-0 mt-1" />
                <span>Tầng 12, Tòa nhà Viettel, 285 Cách Mạng Tháng Tám, Phường<br/>12, Quận 10, TP. Hồ Chí Minh</span>
              </div>
            </div>

            {/* App Box 1 */}
            <div>
              <h4 className="text-white font-bold mb-4">Ứng dụng Ticketbox</h4>
              <div className="flex flex-col gap-3 w-36">
                <button className="flex items-center gap-2 bg-black border border-gray-600 rounded px-3 py-1.5 hover:border-gray-400 transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
                </button>
                <button className="flex items-center gap-2 bg-black border border-gray-600 rounded px-3 py-1.5 hover:border-gray-400 transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* CỘT 2: Dành cho Khách hàng & Ban tổ chức */}
          <div>
            <div className="mb-10">
              <h4 className="text-white font-bold mb-4">Dành cho Khách hàng</h4>
              <a href="#" className="block hover:text-white transition mb-6">Điều khoản sử dụng cho khách hàng</a>

              <h4 className="text-white font-bold mb-4">Dành cho Ban Tổ chức</h4>
              <a href="#" className="block hover:text-white transition">Điều khoản sử dụng cho ban tổ chức</a>
            </div>

            {/* App Box 2 */}
            <div className="mt-[112px]"> {/* Đẩy phần này xuống ngang hàng với app box bên kia */}
              <h4 className="text-white font-bold mb-4">Ứng dụng check-in cho Ban Tổ chức</h4>
              <div className="flex flex-col gap-3 w-36">
                <button className="flex items-center gap-2 bg-black border border-gray-600 rounded px-3 py-1.5 hover:border-gray-400 transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
                </button>
                <button className="flex items-center gap-2 bg-black border border-gray-600 rounded px-3 py-1.5 hover:border-gray-400 transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* CỘT 3: Về công ty & Mạng xã hội */}
          <div>
            <div className="mb-10">
              <h4 className="text-white font-bold mb-4">Về công ty chúng tôi</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="hover:text-white transition">Quy chế hoạt động</a></li>
                <li><a href="#" className="hover:text-white transition">Chính sách bảo mật thông tin</a></li>
                <li><a href="#" className="hover:text-white transition">Cơ chế giải quyết tranh chấp/ khiếu nại</a></li>
                <li><a href="#" className="hover:text-white transition">Chính sách bảo mật thanh toán</a></li>
                <li><a href="#" className="hover:text-white transition">Chính sách đổi trả và kiểm hàng</a></li>
                <li><a href="#" className="hover:text-white transition">Điều kiện vận chuyển và giao nhận</a></li>
                <li><a href="#" className="hover:text-white transition">Phương thức thanh toán</a></li>
              </ul>
            </div>

            <div className="mt-8">
              <h4 className="text-white font-bold mb-4">Follow us</h4>
              <div className="flex items-center gap-2 mb-8 text-white">
                <a href="#" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-80 transition">
                  <Facebook size={16} fill="white" stroke="none" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center hover:opacity-80 transition">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition border border-gray-600">
                  {/* Icon tiktok tạm dùng icon Link */}
                  <span className="font-bold text-white text-[10px]">TikTok</span> 
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center hover:opacity-80 transition">
                  <Link2 size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center hover:opacity-80 transition">
                  <Linkedin size={16} fill="white" stroke="none" />
                </a>
              </div>

              <h4 className="text-white font-bold mb-4">Ngôn ngữ</h4>
              <div className="flex gap-2">
                <img src="https://flagcdn.com/w40/vn.png" alt="VN" className="w-8 h-5 object-cover cursor-pointer hover:opacity-80" />
                <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-8 h-5 object-cover cursor-pointer hover:opacity-80" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- PHẦN DƯỚI: Bản quyền & Thông tin pháp lý (Nền Đen) --- */}
      <div className="bg-[#1e1e1e] py-8 px-4 md:px-10 text-[#888]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Cột trái */}
          <div>
            <div className="flex items-baseline gap-1 mb-2">
              <h2 className="text-white text-2xl font-bold tracking-tighter">ticketbox</h2>
              <span className="text-xs italic">by</span>
              <span className="text-white font-bold text-sm">VNPAY</span>
            </div>
            <p className="mb-1">Nền tảng quản lý và phân phối vé sự kiện hàng đầu Việt Nam</p>
            <p>© 2017</p>
          </div>

          {/* Cột giữa */}
          <div className="md:max-w-sm">
            <p className="mb-1">Công ty TNHH Ticketbox</p>
            <p className="mb-1">Đại diện theo pháp luật: Phạm Thị Hương</p>
            <p>Giấy chứng nhận đăng ký doanh nghiệp số: 0313605444, cấp lần đầu ngày 07/01/2016 bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh</p>
          </div>

          {/* Cột phải: Logo Bộ Công Thương */}
          <div className="shrink-0 mt-4 md:mt-0">
            {/* Cấp sẵn kích thước cố định để chống giật/nháy layout */}
            <div className="w-[130px] h-[48px]"> 
              <img 
                src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png" 
                alt="Đã đăng ký Bộ Công Thương" 
                className="w-full h-full object-contain cursor-pointer"
                onError={(e) => {
                  e.currentTarget.onerror = null; // Chặn đứng vòng lặp vô hạn
                  e.currentTarget.src = "https://theme.hstatic.net/1000026602/1001190518/14/logo-bct.png";
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;