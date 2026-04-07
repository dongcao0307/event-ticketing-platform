import React from 'react';
import {
  X, CheckCircle, XCircle, Clock, User,
  Mail, Phone, Calendar, MapPin, Ticket,
  CreditCard, Hash, Tag,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────── */
const STATUS_CFG = {
  SUCCESS:   { label: 'Thành công', badge: 'bg-[#26bc71]/10 text-[#26bc71] border-[#26bc71]/20',   dot: 'bg-[#26bc71]'  },
  PENDING:   { label: 'Chờ xử lý', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
  CANCELLED: { label: 'Đã huỷ',    badge: 'bg-red-500/10 text-red-400 border-red-500/20',          dot: 'bg-red-400'    },
};

const PAYMENT_METHODS = ['VNPay', 'MoMo', 'Chuyển khoản', 'ZaloPay'];
const SERVICE_FEE_RATE = 0.05;

// Derive mock detail data from the order object
const deriveDetails = (order) => {
  const seed = parseInt(order.id.replace(/\D/g, ''), 10) || 1;
  const nameParts = order.customer.name.toLowerCase().split(' ');
  const email = `${nameParts[nameParts.length - 1]}.${nameParts[0]}@gmail.com`;
  const phonePrefixes = ['0901', '0912', '0933', '0944', '0955', '0976', '0988', '0909'];
  const phone = phonePrefixes[seed % phonePrefixes.length] + String((seed * 1337) % 1000000).padStart(6, '0');
  const paymentMethod = order.total === 0 ? 'Miễn phí' : PAYMENT_METHODS[seed % PAYMENT_METHODS.length];
  const unitPrice = order.tickets > 0 && order.total > 0 ? Math.round(order.total / order.tickets) : 0;
  const serviceFee = order.total > 0 ? Math.round(order.total * SERVICE_FEE_RATE) : 0;
  const grandTotal = order.total + serviceFee;
  // Derive event location & date from order meta
  const isOnline = order.event.sub.toLowerCase().includes('trực tuyến') || order.event.sub.toLowerCase().includes('online');
  const location = isOnline ? 'Online (Zoom)' : 'TP. Hồ Chí Minh';
  return { email, phone, paymentMethod, unitPrice, serviceFee, grandTotal, location, isOnline };
};

/* ── sub components ──────────────────────────────────────────── */
const Section = ({ title, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} className="text-gray-500" />
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{title}</p>
    </div>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="text-gray-200 text-xs font-medium text-right max-w-[55%]">{value}</span>
  </div>
);

/* ── modal ───────────────────────────────────────────────────── */
const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  if (!order) return null;

  const cfg = STATUS_CFG[order.status];
  const d   = deriveDetails(order);

  const handleConfirm = () => { onStatusChange(order.id, 'SUCCESS');   onClose(); };
  const handleCancel  = () => { onStatusChange(order.id, 'CANCELLED'); onClose(); };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1e1e] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold font-mono">{order.id}</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Customer */}
          <Section title="Thông tin khách hàng" icon={User}>
            <div className="bg-[#222] rounded-xl p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: order.customer.color }}
              >
                {order.customer.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{order.customer.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Mail size={11} /> {d.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Phone size={11} /> {d.phone}
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Event */}
          <Section title="Thông tin sự kiện" icon={Calendar}>
            <div className="bg-[#222] rounded-xl p-4 space-y-3">
              <div>
                <p className="text-white font-semibold text-sm">{order.event.name}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-[#1a1a1a] text-gray-400 text-xs">
                  <Tag size={10} /> {order.event.sub}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-gray-600 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-[11px]">Ngày đặt</p>
                    <p className="text-gray-200 text-xs">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-gray-600 shrink-0" />
                  <div>
                    <p className="text-gray-500 text-[11px]">Địa điểm</p>
                    <p className="text-gray-200 text-xs">{d.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Ticket breakdown */}
          <Section title="Chi tiết vé" icon={Ticket}>
            <div className="bg-[#222] rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1a1a1a] text-gray-500">
                    <th className="px-4 py-2.5 text-left font-medium">Loại vé</th>
                    <th className="px-4 py-2.5 text-center font-medium">Số lượng</th>
                    <th className="px-4 py-2.5 text-right font-medium">Đơn giá</th>
                    <th className="px-4 py-2.5 text-right font-medium">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="px-4 py-3 text-gray-200 font-medium">
                      {order.event.sub.split('·')[0].trim()}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-center">{order.tickets}</td>
                    <td className="px-4 py-3 text-gray-400 text-right">
                      {d.unitPrice === 0 ? 'Miễn phí' : d.unitPrice.toLocaleString('vi-VN') + ' ₫'}
                    </td>
                    <td className="px-4 py-3 text-[#26bc71] font-semibold text-right">
                      {order.total === 0 ? 'Miễn phí' : order.total.toLocaleString('vi-VN') + ' ₫'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Payment summary + order meta */}
          <div className="grid grid-cols-2 gap-4">

            {/* Payment summary */}
            <Section title="Tóm tắt thanh toán" icon={CreditCard}>
              <div className="bg-[#222] rounded-xl p-4 space-y-0.5">
                <InfoItem label="Tạm tính"
                  value={order.total === 0 ? 'Miễn phí' : order.total.toLocaleString('vi-VN') + ' ₫'} />
                <InfoItem label={`Phí dịch vụ (${(SERVICE_FEE_RATE * 100).toFixed(0)}%)`}
                  value={d.serviceFee === 0 ? '0 ₫' : d.serviceFee.toLocaleString('vi-VN') + ' ₫'} />
                <div className="flex justify-between items-center pt-2.5 mt-1 border-t border-white/10">
                  <span className="text-white text-xs font-semibold">Tổng cộng</span>
                  <span className="text-[#26bc71] text-sm font-bold">
                    {d.grandTotal === 0 ? 'Miễn phí' : d.grandTotal.toLocaleString('vi-VN') + ' ₫'}
                  </span>
                </div>
              </div>
            </Section>

            {/* Order meta */}
            <Section title="Thông tin đơn hàng" icon={Hash}>
              <div className="bg-[#222] rounded-xl p-4 space-y-0.5">
                <InfoItem label="Mã đơn hàng"  value={order.id} />
                <InfoItem label="Ngày đặt"      value={order.date} />
                <InfoItem label="Thanh toán qua" value={d.paymentMethod} />
                <InfoItem label="Số vé"          value={`${order.tickets} vé`} />
              </div>
            </Section>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2a2a2a] text-gray-400 hover:text-white text-sm transition-colors"
          >
            Đóng
          </button>

          {order.status === 'PENDING' && (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:border-red-500 hover:text-white text-sm font-medium transition-colors"
              >
                <XCircle size={14} /> Huỷ đơn
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#26bc71] hover:bg-[#1ea860] text-white text-sm font-medium transition-colors"
              >
                <CheckCircle size={14} /> Xác nhận
              </button>
            </div>
          )}

          {order.status === 'SUCCESS' && (
            <span className="flex items-center gap-2 text-[#26bc71] text-sm">
              <CheckCircle size={14} /> Đơn hàng đã hoàn thành
            </span>
          )}

          {order.status === 'CANCELLED' && (
            <span className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle size={14} /> Đơn hàng đã bị huỷ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
