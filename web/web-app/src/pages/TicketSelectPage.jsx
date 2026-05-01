import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, Info, Plus, Minus } from 'lucide-react';
import { getDetailedEventById, serviceAddBookingItems, serviceCreateBooking, serviceCreateTickets } from '../services/bookingService';
import { buildFreeCheckoutPayload, serviceCreateFreeCheckout } from '../services/paymentService';
import { useEvent } from '../hooks/useEvent';

const EMPTY_ARRAY = [];

const TicketSelectPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showtimeId = searchParams.get('showtime');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { setBookingSelection, setBookingOrderData } = useEvent();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await getDetailedEventById(id);
      setEvent(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const activePerformance = useMemo(() => {
    if (!event?.performances?.length) return null;
    const matched = event.performances.find((p) => String(p.id) === String(showtimeId));
    return matched || event.performances[0];
  }, [event, showtimeId]);

  const ticketTypes = activePerformance?.tickets || EMPTY_ARRAY;

  useEffect(() => {
    const init = {};
    ticketTypes.forEach((tt) => { init[tt.id] = 0; });
    setQuantities(init);
  }, [ticketTypes]);

  const activeShowtime = activePerformance
    ? { label: activePerformance.label, date: activePerformance.date }
    : null;

  const formatPrice = (p) => (Number(p) || 0).toLocaleString('vi-VN') + 'đ';

  const changeQty = (ttId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [ttId]: Math.max(0, (prev[ttId] || 0) + delta),
    }));
  };

  const selectedItems = useMemo(() => {
    if (!ticketTypes.length) return [];
    return ticketTypes
      .filter((tt) => quantities[tt.id] > 0)
      .map((tt) => ({ ...tt, quantity: quantities[tt.id] }));
  }, [quantities, ticketTypes]);

  const totalQty = selectedItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = selectedItems.reduce((s, i) => s + i.quantity * i.price, 0);

  const resolveMockUserId = () => {
    try {
      const userDataRaw = localStorage.getItem('user_data');
      if (!userDataRaw) return 1;

      const userData = JSON.parse(userDataRaw);
      if (Number.isFinite(Number(userData?.id))) {
        return Number(userData.id);
      }

      if (userData?.email) {
        let hash = 0;
        for (let i = 0; i < userData.email.length; i += 1) {
          hash = (hash * 31 + userData.email.charCodeAt(i)) % 100000;
        }
        return hash + 1;
      }
    } catch {
      return 1;
    }
    return 1;
  };

  const toValidLong = (rawValue, fieldLabel) => {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error(`Khong tim thay ${fieldLabel} hop le.`);
    }
    return parsed;
  };

  const buildQrCode = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `QR-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  };

  const handleContinue = async () => {
    if (!activePerformance || totalQty === 0 || submitting) return;
    setSubmitError('');
    setSubmitting(true);

    try {
      const performanceId = toValidLong(activePerformance.id, 'suat dien');
      const userId = resolveMockUserId();

      const orderItemsPayload = selectedItems.map((item) => ({
        ticketTypeId: toValidLong(item.id, 'loai ve'),
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.price) || 0,
      })).filter((item) => item.quantity > 0);

      if (!orderItemsPayload.length) {
        throw new Error('Khong co ve hop le de tao don hang.');
      }

      const createdBooking = await serviceCreateBooking({
        userId,
        idempotenceKey: `BOOK-${id}-${performanceId}-${Date.now()}`,
        discountAmount: 0,
      });

      const bookingId = createdBooking?.id;
      if (!bookingId) {
        throw new Error('Khong nhan duoc ma don hang tu backend.');
      }

      const updatedBooking = await serviceAddBookingItems(bookingId, orderItemsPayload);
      const finalBooking = updatedBooking ?? createdBooking;

      const ticketPayload = orderItemsPayload.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({
          ticketTypeId: item.ticketTypeId,
          performanceId,
          userId,
          orderId: bookingId,
          qrCode: buildQrCode(),
          priceAtPurchase: item.unitPrice,
          seatNumber: null,
        }))
      );

      if (ticketPayload.length) {
        await serviceCreateTickets(ticketPayload);
      }

      const showtimeContext = activePerformance
        ? { id: activePerformance.id, label: activePerformance.label, date: activePerformance.date }
        : null;

      setBookingOrderData({
        order: finalBooking,
        orderItems: orderItemsPayload,
        context: {
          event,
          showtime: showtimeContext,
          seats: [],
          tickets: selectedItems,
          total: totalPrice,
        },
      });

      const totalAmount = Number(finalBooking?.totalAmount ?? totalPrice);
      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        const payload = buildFreeCheckoutPayload({
          order: finalBooking,
          event,
          showtime: showtimeContext,
        });
        await serviceCreateFreeCheckout(payload);
        navigate('/');
        return;
      }

      navigate(`/event/${id}/payment?orderId=${bookingId}`);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || 'Tao don hang that bai.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!activePerformance) return;
    setBookingSelection({
      eventId: event?.id,
      performanceId: activePerformance.id,
      seats: [],
      tickets: selectedItems,
      source: 'tickets',
    });
  }, [activePerformance, event?.id, selectedItems, setBookingSelection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }
  if (!event) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
        Không tìm thấy sự kiện.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(`/event/${id}`)}
          className="flex items-center gap-2 text-white hover:text-[#26bc71] transition text-sm"
        >
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <h1 className="text-[#26bc71] font-semibold text-base">Chọn vé</h1>
        <div className="w-20" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Ticket list */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {ticketTypes.length === 0 && (
              <div className="text-sm text-gray-500">Chưa có loại vé cho suất diễn này.</div>
            )}
            {ticketTypes.map((tt) => {
              const qty = quantities[tt.id] || 0;
              return (
                <div key={tt.id} className="bg-[#1c1c1c] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">{tt.label || tt.name}</div>
                      <div className="text-[#26bc71] font-bold text-base mt-1">{formatPrice(tt.price)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => changeQty(tt.id, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white disabled:opacity-30 hover:border-[#26bc71] hover:text-[#26bc71] transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold w-6 text-center">{qty}</span>
                      <button
                        onClick={() => changeQty(tt.id, 1)}
                        className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#26bc71] hover:text-[#26bc71] transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  {tt.description && (
                    <div className="px-4 pb-3 flex items-start gap-2 text-xs text-gray-400 bg-[#161616] border-t border-gray-800 pt-2.5">
                      <Info size={13} className="shrink-0 mt-0.5 text-gray-500" />
                      <span>{tt.description}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right info panel */}
        <div className="w-72 bg-[#1a1a1a] border-l border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold text-sm leading-snug">{event.title}</h2>
            {activeShowtime && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                <Clock size={12} />
                <span>{activeShowtime.label}, {activeShowtime.date}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <MapPin size={12} />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Selected ticket summary */}
          <div className="p-4 flex-1 overflow-auto">
            <div className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wide">Giá vé</div>
            {ticketTypes.map((tt) => (
              <div key={tt.id} className="flex items-start justify-between py-2 border-b border-gray-800 last:border-0 gap-2">
                <span className="text-xs text-gray-300 leading-tight">{tt.label || tt.name}</span>
                <span className="text-xs font-semibold text-white shrink-0">{formatPrice(tt.price)}</span>
              </div>
            ))}

            {selectedItems.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Đã chọn</div>
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 truncate">{item.label || item.name} x{item.quantity}</span>
                    <span className="text-white font-semibold shrink-0 ml-2">{formatPrice(item.quantity * item.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom total + continue */}
          <div className="p-4 border-t border-gray-800">
            {submitError && (
              <div className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {submitError}
              </div>
            )}
            {totalQty > 0 && (
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-gray-400">Tổng cộng ({totalQty} vé)</span>
                <span className="text-white font-bold text-base">{formatPrice(totalPrice)}</span>
              </div>
            )}
            <button
              onClick={handleContinue}
              disabled={totalQty === 0 || submitting}
              className="w-full py-3 bg-[#26bc71] text-white font-bold rounded-xl hover:bg-[#1fa86a] transition text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? 'Dang tao don hang...' : 'Tiep tuc thanh toan'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelectPage;
