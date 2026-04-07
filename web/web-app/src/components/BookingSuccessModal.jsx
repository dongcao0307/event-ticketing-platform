import { CheckCircle, Calendar, MapPin, Ticket, X, Download } from 'lucide-react';

const BookingSuccessModal = ({ orderId, event, showtime, seats, tickets, total, buyer, onClose, onViewTicket }) => {
  const formatPrice = (p) => p?.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition z-10"
        >
          <X size={18} />
        </button>

        {/* Success header */}
        <div className="bg-gradient-to-br from-[#26bc71] to-[#1a9a5c] px-6 pt-8 pb-6 text-center text-white">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>
          <h2 className="text-xl font-bold">Đặt vé thành công!</h2>
          <p className="text-green-100 text-sm mt-1">Vé điện tử đã được gửi đến email của bạn</p>
        </div>

        {/* Order info */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Mã đơn hàng</span>
            <span className="font-bold text-gray-900 text-sm tracking-wider">{orderId}</span>
          </div>
        </div>

        {/* Event details */}
        <div className="px-6 py-4 space-y-2.5">
          <div className="font-semibold text-gray-900 text-base leading-tight">{event?.title}</div>

          {showtime && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={15} className="text-[#26bc71] shrink-0" />
              <span>{showtime.label}, {showtime.date}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={15} className="text-[#26bc71] shrink-0" />
            <span>{event?.location}</span>
          </div>

          {/* Seats */}
          {seats && seats.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Ticket size={15} className="text-[#26bc71] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Ghế: </span>
                <span>{seats.join(', ')}</span>
              </div>
            </div>
          )}

          {/* Tham quan tickets */}
          {tickets && tickets.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Ticket size={15} className="text-[#26bc71] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {tickets.map((t) => (
                  <div key={t.id}>{t.label} x{t.quantity}</div>
                ))}
              </div>
            </div>
          )}

          {/* Buyer info */}
          {buyer && (
            <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-1">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">Thông tin người đặt</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Họ tên</span>
                <span className="text-gray-900 font-medium">{buyer.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">{buyer.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Điện thoại</span>
                <span className="text-gray-900">{buyer.phone}</span>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-900">Tổng thanh toán</span>
            <span className="text-[#26bc71] font-bold text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onViewTicket}
            className="flex-1 py-2.5 bg-[#26bc71] text-white font-semibold rounded-xl hover:bg-[#1fa86a] transition text-sm flex items-center justify-center gap-2"
          >
            <Ticket size={16} />
            Xem vé của tôi
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Tải vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
