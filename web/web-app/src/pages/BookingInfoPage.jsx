import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, Clock, MapPin, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { getDetailedEventById, submitBooking } from '../services/bookingService';
import BookingSuccessModal from '../components/BookingSuccessModal';

const BookingInfoPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showtimeId = searchParams.get('showtime');
  const seatsParam = searchParams.get('seats');
  const ticketsParam = searchParams.get('tickets');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await getDetailedEventById(id);
      setEvent(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const activeShowtime = event?.showtimes?.find((s) => s.id === showtimeId) || event?.showtimes?.[0];

  const selectedSeats = useMemo(() => {
    if (!seatsParam) return [];
    return seatsParam.split(',').filter(Boolean);
  }, [seatsParam]);

  const selectedTickets = useMemo(() => {
    if (!ticketsParam || !event?.ticketTypes) return [];
    return ticketsParam.split(',').filter(Boolean).map((t) => {
      const [ttId, qty] = t.split(':');
      const tt = event.ticketTypes.find((x) => x.id === ttId);
      return tt ? { ...tt, quantity: parseInt(qty, 10) } : null;
    }).filter(Boolean);
  }, [ticketsParam, event]);

  const getZoneForRow = (row) => {
    if (!event?.ticketZones) return null;
    return event.ticketZones.find((z) => z.rows.includes(row)) || null;
  };

  const totalPrice = useMemo(() => {
    if (event?.type === 'theater') {
      return selectedSeats.reduce((sum, seatKey) => {
        const row = seatKey.split('-')[0];
        const zone = getZoneForRow(row);
        return sum + (zone?.price || 0);
      }, 0);
    }
    return selectedTickets.reduce((s, i) => s + i.quantity * i.price, 0);
  }, [selectedSeats, selectedTickets, event]);

  const formatPrice = (p) => p.toLocaleString('vi-VN') + 'đ';

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ';
    if (!form.phone.trim() || !/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Số điện thoại không hợp lệ';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    const result = await submitBooking({
      eventId: id,
      eventTitle: event.title,
      showtime: activeShowtime,
      seats: selectedSeats,
      tickets: selectedTickets,
      buyer: form,
      total: totalPrice,
    });
    setSubmitting(false);
    if (result.success) {
      setOrderId(result.orderId);
      setShowSuccess(true);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">Đang tải...</div>;
  }
  if (!event) {
    return <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">Không tìm thấy sự kiện.</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#26bc71] transition text-sm"
          >
            <ChevronLeft size={18} />
            <span>Trở về</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/3448/3448609.png" alt="ticketbox" className="w-6 h-6" />
            <span className="font-bold text-[#26bc71] text-lg">ticketbox</span>
          </div>
          <div className="w-20" />
        </div>

        {/* Progress indicator */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">1</div>
              <span className="hidden sm:inline">Chọn vé</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-[#26bc71]">
              <div className="w-6 h-6 rounded-full bg-[#26bc71] text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="hidden sm:inline font-semibold">Thông tin</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">3</div>
              <span className="hidden sm:inline">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 w-full flex flex-col lg:flex-row gap-6">
          {/* Form */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <User size={20} className="text-[#26bc71]" />
                Thông tin người đặt vé
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:border-[#26bc71] focus:ring-1 focus:ring-[#26bc71] ${errors.fullName ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition focus:border-[#26bc71] focus:ring-1 focus:ring-[#26bc71] ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  <p className="text-xs text-gray-400 mt-1">Vé điện tử sẽ được gửi đến email này</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="0901234567"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none transition focus:border-[#26bc71] focus:ring-1 focus:ring-[#26bc71] ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú (tùy chọn)</label>
                  <textarea
                    placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung..."
                    value={form.note}
                    onChange={(e) => handleChange('note', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#26bc71] focus:ring-1 focus:ring-[#26bc71] resize-none"
                  />
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-400">
                  Bằng việc đặt vé, bạn đồng ý với{' '}
                  <span className="text-[#26bc71] cursor-pointer hover:underline">Điều khoản sử dụng</span> và{' '}
                  <span className="text-[#26bc71] cursor-pointer hover:underline">Chính sách bảo mật</span> của Ticketbox.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#26bc71] text-white font-bold rounded-xl hover:bg-[#1fa86a] transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
              <div className="bg-[#1a1a2e] p-4 text-white">
                <h3 className="font-bold text-sm leading-snug">{event.title}</h3>
                {activeShowtime && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-300">
                    <Clock size={12} />
                    <span>{activeShowtime.label}, {activeShowtime.date}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-300">
                  <MapPin size={12} />
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Chi tiết đơn hàng</div>

                {/* Theater seats */}
                {event.type === 'theater' && selectedSeats.map((seatKey) => {
                  const row = seatKey.split('-')[0];
                  const zone = getZoneForRow(row);
                  return (
                    <div key={seatKey} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: zone?.color || '#26bc71' }} />
                        <span className="text-xs text-gray-700">Ghế {seatKey} – {zone?.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{formatPrice(zone?.price || 0)}</span>
                    </div>
                  );
                })}

                {/* Tham quan tickets */}
                {event.type === 'tham-quan' && selectedTickets.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-1.5 border-b border-gray-100 last:border-0 gap-2">
                    <span className="text-xs text-gray-700 leading-tight">{item.label} x{item.quantity}</span>
                    <span className="text-xs font-semibold text-gray-900 shrink-0">{formatPrice(item.quantity * item.price)}</span>
                  </div>
                ))}

                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-[#26bc71] font-bold text-base">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <BookingSuccessModal
          orderId={orderId}
          event={event}
          showtime={activeShowtime}
          seats={selectedSeats}
          tickets={selectedTickets}
          total={totalPrice}
          buyer={form}
          onClose={() => navigate('/')}
          onViewTicket={() => navigate('/my-account/tickets')}
        />
      )}
    </>
  );
};

export default BookingInfoPage;
