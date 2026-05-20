import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, User, Mail, Phone, Calendar, MapPin, Ticket, CreditCard, Hash, Tag } from 'lucide-react';

// 🚨 IMPORT HÀM SERVICE TỪ FILE API
import { serviceUpdateBookingStatusAdmin } from '../services/bookingService';

const STATUS_CFG = {
  SUCCESS:   { label: 'Thành công', badge: 'bg-[#26bc71]/10 text-[#26bc71] border-[#26bc71]/20',  dot: 'bg-[#26bc71]'  },
  PENDING:   { label: 'Chờ xử lý', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
  CANCELLED: { label: 'Đã huỷ',    badge: 'bg-red-500/10 text-red-400 border-red-500/20',          dot: 'bg-red-400'    },
};

// 💡 ĐỒNG BỘ DỮ LIỆU THẬT SANG CHI TIẾT TÍNH TOÁN CỦA MODAL
const deriveDetails = (order) => {
  const ticketsCount = order.tickets || 1; // Tránh chia cho 0
  
  // 1. Thành tiền vé = unitPrice từ API (theo yêu cầu của bạn)
  const subtotal = order.unitPrice || 0; 
  
  // 2. Đơn giá = Thành tiền chia cho số lượng
  const calculatedUnitPrice = subtotal / ticketsCount; 
  
  // 3. Phí phụ thu = Tổng tiền hóa đơn thực tế - Thành tiền vé gốc
  const serviceFee = Math.max(0, (order.total || 0) - subtotal);

  return { 
    email: order.customer?.email || 'Chưa cung cấp email', 
    phone: order.customer?.phone || 'Chưa cung cấp SĐT', 
    paymentMethod: 'Cổng thanh toán liên kết', 
    unitPrice: calculatedUnitPrice, 
    subtotal: subtotal,
    serviceFee: serviceFee, 
    grandTotal: order.total || 0, // Tổng giá hiển thị cuối cùng
    location: order.event?.location || 'Địa điểm hệ thống thông báo' 
  };
};

const Section = ({ title, icon: Icon, children }) => (<div><div className="flex items-center gap-2 mb-3"><Icon size={13} className="text-gray-500" /><p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{title}</p></div>{children}</div>);
const InfoItem = ({ label, value }) => (<div className="flex justify-between items-start py-2 border-b border-white/5 last:border-0"><span className="text-gray-500 text-xs">{label}</span><span className="text-gray-200 text-xs font-medium text-right max-w-[55%]">{value}</span></div>);

const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  if (!order) return null;

  const cfg = STATUS_CFG[order.status] || STATUS_CFG['PENDING'];
  const d = deriveDetails(order);

  const handleUpdate = async (newStatus) => {
    setIsUpdating(true);
    try {
      const backendStatus = newStatus === 'SUCCESS' ? 'PAID' : newStatus;
      
      // Gọi API thực tế cập nhật trạng thái
      await serviceUpdateBookingStatusAdmin(order.rawId, backendStatus);
      
      onStatusChange(); // Tải lại danh sách ngoài AdminOrders
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái DB:", error);
      alert("Hệ thống không thể cập nhật trạng thái đơn hàng. Thử lại sau!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold font-mono">{order.id}</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Thông tin khách hàng xịn */}
          <Section title="Thông tin khách hàng" icon={User}>
            <div className="bg-[#222] rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: order.customer.color }}>
                {order.customer.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{order.customer.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Mail size={11} /> {d.email}</span>
                  <span className="flex items-center gap-1.5 text-gray-500 text-xs"><Phone size={11} /> {d.phone}</span>
                </div>
              </div>
            </div>
          </Section>

          {/* Thông tin sự kiện xịn */}
          <Section title="Thông tin sự kiện" icon={Calendar}>
            <div className="bg-[#222] rounded-xl p-4 space-y-3">
              <div>
                <p className="text-white font-semibold text-sm">{order.event.name}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-[#1a1a1a] text-gray-400 text-xs">
                  <Tag size={10} /> {order.event.sub}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2"><Calendar size={12} className="text-gray-600 shrink-0" /><div><p className="text-gray-500 text-[11px]">Ngày đặt</p><p className="text-gray-200 text-xs">{order.date}</p></div></div>
                <div className="flex items-center gap-2"><MapPin size={12} className="text-gray-600 shrink-0" /><div><p className="text-gray-500 text-[11px]">Địa điểm</p><p className="text-gray-200 text-xs">{d.location}</p></div></div>
              </div>
            </div>
          </Section>

          {/* Chi tiết loại vé & đơn giá */}
          <Section title="Chi tiết vé" icon={Ticket}>
            <div className="bg-[#222] rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1a1a1a] text-gray-500">
                    <th className="px-4 py-2.5 text-left font-medium">Loại vé</th>
                    <th className="px-4 py-2.5 text-center font-medium">Số lượng</th>
                    <th className="px-4 py-2.5 text-right font-medium">Đơn giá</th>
                    <th className="px-4 py-2.5 text-right font-medium">Thành tiền vé</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-3 text-gray-200 font-medium">{order.event.sub}</td>
                    <td className="px-4 py-3 text-gray-400 text-center">{order.tickets}</td>
                    <td className="px-4 py-3 text-gray-400 text-right">
                      {/* Đơn giá đã được tính = Thành tiền / Số lượng */}
                      {d.unitPrice === 0 ? 'Miễn phí' : d.unitPrice.toLocaleString('vi-VN') + ' ₫'}
                    </td>
                    <td className="px-4 py-3 text-[#26bc71] font-semibold text-right">
                      {/* Thành tiền vé = subtotal */}
                      {d.subtotal === 0 ? 'Miễn phí' : d.subtotal.toLocaleString('vi-VN') + ' ₫'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-4">
            <Section title="Tóm tắt thanh toán" icon={CreditCard}>
              <div className="bg-[#222] rounded-xl p-4 space-y-0.5">
                {/* Đã cập nhật lại biến d.subtotal ở đây */}
                <InfoItem label="Tiền vé gốc" value={`${d.subtotal.toLocaleString('vi-VN')} ₫`} />
                <InfoItem label="Phí phụ thu hệ thống" value={`${d.serviceFee.toLocaleString('vi-VN')} ₫`} />
                <div className="flex justify-between items-center pt-2.5 mt-1 border-t border-white/10">
                  <span className="text-white text-xs font-semibold">Tổng cộng thanh toán</span>
                  <span className="text-[#26bc71] text-sm font-bold">{d.grandTotal.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </Section>
            <Section title="Thông tin đơn hàng" icon={Hash}>
              <div className="bg-[#222] rounded-xl p-4 space-y-0.5">
                <InfoItem label="Mã đơn hàng" value={order.id} />
                <InfoItem label="Ngày đặt" value={order.date} />
                <InfoItem label="Hình thức" value={d.paymentMethod} />
                <InfoItem label="Tổng số lượng" value={`${order.tickets} vé`} />
              </div>
            </Section>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#2a2a2a] text-gray-400 hover:text-white text-sm transition-colors">Đóng</button>

          {order.status === 'PENDING' && (
            <div className="flex gap-3">
              <button onClick={() => handleUpdate('CANCELLED')} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white text-sm font-medium transition-colors"><XCircle size={14} /> {isUpdating ? '...' : 'Huỷ đơn'}</button>
              <button onClick={() => handleUpdate('SUCCESS')} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors"><CheckCircle size={14} /> {isUpdating ? '...' : 'Xác nhận'}</button>
            </div>
          )}
          {order.status === 'SUCCESS' && <span className="flex items-center gap-2 text-[#26bc71] text-sm"><CheckCircle size={14} /> Đơn hàng đã hoàn thành</span>}
          {order.status === 'CANCELLED' && <span className="flex items-center gap-2 text-red-400 text-sm"><XCircle size={14} /> Đơn hàng đã bị huỷ</span>}
        </div>
      </div>
    </div>
  );
};
export default OrderDetailModal;