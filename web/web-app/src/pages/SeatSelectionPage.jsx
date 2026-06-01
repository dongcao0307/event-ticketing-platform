import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, AlertCircle, Ticket, Armchair } from 'lucide-react';
import { getDetailedEventById, serviceCreateBookingWithItems } from '../services/bookingService';
import { buildFreeCheckoutPayload, serviceCreateFreeCheckout } from '../services/paymentService';
import { serviceGetBookedSeats } from '../services/ticketService';
import { useEvent } from '../hooks/useEvent';
import { getUserIdFromToken } from '../utils/tokenUtils';

const EMPTY_ARRAY = [];

const LEGEND = [
  { color: '#22c55e', label: 'Đang trống' },
  { color: '#f97316', label: 'Đang chọn' },
  { color: '#ef4444', label: 'Không chọn được' },
];

const SeatSelectionPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showtimeId = searchParams.get('showtime');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { setBookingSelection, setBookingOrderData } = useEvent();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getDetailedEventById(id);
      setEvent(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const occupiedSet = useMemo(
    () => new Set([...(event?.occupiedSeats || []), ...bookedSeats]),
    [event, bookedSeats]
  );

  const activePerformance = useMemo(() => {
    if (!event?.performances?.length) return null;
    const matched = event.performances.find((p) => String(p.id) === String(showtimeId));
    return matched || event.performances[0];
  }, [event, showtimeId]);

  const activeShowtime = activePerformance
    ? { label: activePerformance.label, date: activePerformance.date }
    : null;

  useEffect(() => {
    setSelectedSeats([]);
    if (!activePerformance?.id) return;
    const fetchBookedSeats = async () => {
      try {
        const res = await serviceGetBookedSeats(activePerformance.id);
        if (res.data?.body || res.data?.data) {
          setBookedSeats(res.data.body || res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch booked seats', err);
      }
    };
    fetchBookedSeats();
  }, [activePerformance?.id]);

  const toggleSeat = (seatKey) => {
    if (occupiedSet.has(seatKey)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatKey) ? prev.filter((s) => s !== seatKey) : [...prev, seatKey]
    );
  };

  const getSeatColor = (seatKey) => {
    if (occupiedSet.has(seatKey)) return '#ef4444';
    if (selectedSeats.includes(seatKey)) return '#f97316';
    return null;
  };

  const buildZonesFromSeatMap = (seatMapConfig, tickets) => {
    if (!seatMapConfig) return [];
    let parsed = null;
    try {
      parsed = JSON.parse(seatMapConfig);
    } catch {
      parsed = null;
    }
    const zoneLabels = Array.isArray(parsed?.zones) ? parsed.zones : [];
    if (!zoneLabels.length) return [];

    const colors = ['#f97316', '#3b82f6', '#0ea5e9', '#22c55e', '#a855f7', '#ef4444'];
    const rowsPerZone = 4;
    const seatsPerRow = 22;
    const fallbackPrice = tickets?.[0]?.price || 0;

    let rowIndex = 0;
    return zoneLabels.map((label, index) => {
      const rows = Array.from({ length: rowsPerZone }, (_, i) => String.fromCharCode(65 + rowIndex + i));
      rowIndex += rowsPerZone;
      const match = tickets?.find((t) => (t.name || t.label || '').toLowerCase().includes(String(label).toLowerCase()));
      return {
        id: `zone-${index}`,
        label,
        color: colors[index % colors.length],
        price: match?.price ?? fallbackPrice,
        rows,
        seatsPerRow,
      };
    });
  };

  const ticketTypes = activePerformance?.tickets || EMPTY_ARRAY;
  const defaultTicketType = ticketTypes[0];

  const zonesGrouped = useMemo(() => {
    if (!activePerformance) return [];
    if (event?.ticketZones?.length) return event.ticketZones;
    return buildZonesFromSeatMap(activePerformance?.venue?.seatMapConfig, ticketTypes);
  }, [activePerformance, event?.ticketZones, ticketTypes]);

  const getZoneForRow = (row) => {
    if (!zonesGrouped.length) return null;
    return zonesGrouped.find((z) => z.rows.includes(row)) || null;
  };

  const totalPrice = useMemo(() => {
    if (!defaultTicketType) return 0;
    return selectedSeats.length * (defaultTicketType.price || 0);
  }, [selectedSeats, defaultTicketType]);

  const formatPrice = (p) => (Number(p) || 0).toLocaleString('vi-VN') + 'đ';

  const validateSeatQuantityLimit = () => {
    const min = Number(defaultTicketType?.minTicketsPerUser ?? 0);
    const max = Number(defaultTicketType?.maxTicketsPerUser ?? 0);
    const quantity = selectedSeats.length;

    if (min > 0 && quantity < min) {
      throw new Error(`Phải chọn ít nhất ${min} ghế cho ${defaultTicketType?.label || defaultTicketType?.name || 'loại vé này'}`);
    }

    if (max > 0 && quantity > max) {
      throw new Error(`Tối đa ${max} ghế cho ${defaultTicketType?.label || defaultTicketType?.name || 'loại vé này'}`);
    }
  };

  const resolveMockUserId = () => {
    try {
      const userId = getUserIdFromToken();
      if (Number.isFinite(userId) && userId > 0) {
        return userId;
      }
    } catch (error) {
      console.error('Error getting user ID from token:', error);
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

  const handleContinue = async () => {
    if (!activePerformance || !defaultTicketType || selectedSeats.length === 0 || submitting) return;
    setSubmitError('');
    setSubmitting(true);

    try {
      const performanceId = toValidLong(activePerformance.id, 'suat dien');
      const ticketTypeId = toValidLong(defaultTicketType.id, 'loai ve');
      const userId = resolveMockUserId();

      const orderItemsPayload = [{
        ticketTypeId,
        quantity: selectedSeats.length,
        unitPrice: Number(defaultTicketType.price) || 0,
      }];

      validateSeatQuantityLimit();

      const createdBooking = await serviceCreateBookingWithItems({
        userId,
        idempotenceKey: `BOOK-${id}-${performanceId}-${Date.now()}`,
        discountAmount: 0,
        items: orderItemsPayload,
      });

      const bookingId = createdBooking?.id;
      if (!bookingId) {
        throw new Error('Khong nhan duoc ma don hang tu backend.');
      }
      const finalBooking = createdBooking;

      const showtimeContext = activePerformance
        ? { id: activePerformance.id, label: activePerformance.label, date: activePerformance.date }
        : null;

      setBookingOrderData({
        order: finalBooking,
        orderItems: orderItemsPayload,
        context: {
          event,
          showtime: showtimeContext,
          seats: selectedSeats,
          tickets: defaultTicketType ? [{ ...defaultTicketType, quantity: selectedSeats.length }] : [],
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
    const tickets = defaultTicketType
      ? [{ ...defaultTicketType, quantity: selectedSeats.length }]
      : [];
    setBookingSelection({
      eventId: event?.id,
      performanceId: activePerformance.id,
      seats: selectedSeats,
      tickets,
      source: 'seats',
    });
  }, [activePerformance, defaultTicketType, event?.id, selectedSeats, setBookingSelection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4 animate-fadeInUp">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Đang tải sơ đồ chỗ ngồi...</p>
        </div>
      </div>
    );
  }
  if (!event) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black flex flex-col items-center justify-center text-white p-4">
        <div className="bg-zinc-950/60 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 max-w-sm text-center shadow-2xl animate-fadeInUp">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Không tìm thấy sự kiện</h3>
          <p className="text-sm text-zinc-400 mb-6">Sự kiện bạn yêu cầu không tồn tại hoặc đã bị gỡ bỏ.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition text-sm w-full"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const hasZones = zonesGrouped.length > 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-950 via-black to-black flex flex-col text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-900/60 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(`/event/${id}`)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all text-sm font-medium bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/40 px-3.5 py-1.5 rounded-xl"
        >
          <ChevronLeft size={16} />
          <span>Trở về</span>
        </button>
        <div className="text-center">
          <h1 className="text-white font-bold text-lg tracking-wide">Chọn Vé & Ghế</h1>
          <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mt-0.5">Sơ đồ chỗ ngồi 2D</p>
        </div>
        <div className="w-24 opacity-0 pointer-events-none" />
      </div>

      {/* Legend */}
      <div className="py-4 px-4 flex items-center justify-center relative z-10">
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-full px-6 py-2.5 flex items-center gap-6 md:gap-8 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded border border-emerald-500 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
            <span className="text-xs text-zinc-300 font-medium">Đang trống</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded border border-orange-500 bg-orange-500/85 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            <span className="text-xs text-zinc-300 font-medium">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-center text-zinc-700 text-[8px] font-bold">×</div>
            <span className="text-xs text-zinc-400 font-medium">Đã bán</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Seat map */}
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          {/* Stage */}
          <div className="mx-auto max-w-2xl mb-12 text-center relative">
            {/* Perspective glow arc */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent blur-xl pointer-events-none rounded-t-full" />
            
            {/* The Stage bar */}
            <div className="relative z-10 mx-auto w-4/5">
              <div className="h-[6px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full shadow-[0_0_12px_#10b981]" />
              <div className="mt-3 text-zinc-400 text-[10px] font-bold tracking-[0.3em] uppercase">SÂN KHẤU / STAGE</div>
            </div>
          </div>

          {/* Seat zones */}
          <div className="mx-auto max-w-2xl space-y-8 pb-10">
            {zonesGrouped.map((zone) => (
              <div key={zone.id} className="bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                {/* Zone label shown above every zone */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-900/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: zone.color, boxShadow: `0 0 8px ${zone.color}` }} />
                    <span className="text-zinc-200 font-bold text-sm tracking-wider uppercase">Phân khu: {zone.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-400 bg-zinc-900/60 border border-zinc-800/40 px-3 py-1 rounded-full">
                    {formatPrice(zone.price)}
                  </span>
                </div>

                <div className="space-y-3">
                  {zone.rows.map((row) => (
                    <div key={row} className="flex items-center gap-3">
                      <span className="text-zinc-500 text-xs w-5 text-center font-bold font-mono">{row}</span>
                      <div className="flex gap-1.5 flex-wrap justify-center flex-1">
                        {Array.from({ length: zone.seatsPerRow || 22 }, (_, i) => {
                          const seatNum = i + 1;
                          const seatKey = `${row}-${seatNum}`;
                          const isSelected = selectedSeats.includes(seatKey);
                          const isOccupied = occupiedSet.has(seatKey);
                          
                          // Style objects
                          let seatStyle = {};
                          let seatClass = "";

                          if (isOccupied) {
                            seatClass = "w-6 h-6 md:w-7 md:h-7 rounded-md text-[9px] font-semibold flex items-center justify-center bg-zinc-950/60 border border-zinc-900 text-zinc-700 cursor-not-allowed";
                          } else if (isSelected) {
                            seatClass = "w-6 h-6 md:w-7 md:h-7 rounded-md text-[9px] font-bold flex items-center justify-center text-white transition-all duration-300 scale-105 active:scale-95";
                            seatStyle = {
                              backgroundColor: zone.color,
                              boxShadow: `0 0 10px ${zone.color}`,
                              borderColor: zone.color,
                            };
                          } else {
                            // Available seat
                            seatClass = "w-6 h-6 md:w-7 md:h-7 rounded-md text-[9px] font-medium flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border";
                            seatStyle = {
                              borderColor: `${zone.color}aa`,
                              color: zone.color,
                              backgroundColor: `${zone.color}0a`,
                            };
                          }

                          return (
                            <button
                              key={seatNum}
                              onClick={() => toggleSeat(seatKey)}
                              disabled={isOccupied}
                              title={`Ghế ${row}${seatNum}`}
                              className={seatClass}
                              style={seatStyle}
                              onMouseEnter={(e) => {
                                if (!isOccupied && !isSelected) {
                                  e.currentTarget.style.backgroundColor = `${zone.color}22`;
                                  e.currentTarget.style.color = '#fff';
                                  e.currentTarget.style.borderColor = zone.color;
                                  e.currentTarget.style.boxShadow = `0 0 6px ${zone.color}88`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isOccupied && !isSelected) {
                                  e.currentTarget.style.backgroundColor = `${zone.color}0a`;
                                  e.currentTarget.style.color = zone.color;
                                  e.currentTarget.style.borderColor = `${zone.color}aa`;
                                  e.currentTarget.style.boxShadow = 'none';
                                }
                              }}
                            >
                              {isOccupied ? '×' : seatNum}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-zinc-500 text-xs w-5 text-center font-bold font-mono">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right info panel */}
        <div className="w-80 bg-zinc-950/70 border-l border-zinc-900 backdrop-blur-xl flex flex-col shadow-2xl relative z-20">
          {/* Header context */}
          <div className="p-5 border-b border-zinc-900">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 tracking-wider uppercase inline-block mb-3">
              Thông tin sự kiện
            </span>
            <h2 className="text-white font-bold text-base leading-snug tracking-tight mb-3">
              {event.title}
            </h2>
            
            <div className="space-y-2 mt-2">
              {activeShowtime && (
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock size={14} className="text-emerald-500" />
                  <span className="font-medium">{activeShowtime.label}, {activeShowtime.date}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <MapPin size={14} className="text-emerald-500" />
                <span className="font-medium line-clamp-2">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Ticket zone pricing */}
          <div className="p-5 border-b border-zinc-900 bg-zinc-950/40">
            <div className="text-xs text-zinc-400 font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
              <Ticket size={14} className="text-emerald-500" />
              <span>Bảng Giá Theo Phân Khu</span>
            </div>
            {!hasZones && (
              <div className="text-xs text-zinc-500 italic">Chưa có cấu hình chỗ ngồi.</div>
            )}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {zonesGrouped.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between py-2 border-b border-zinc-900/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color, boxShadow: `0 0 6px ${zone.color}` }} />
                    <span className="text-xs text-zinc-300 font-medium">{zone.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{formatPrice(zone.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected seats */}
          <div className="p-5 flex-1 overflow-auto bg-zinc-950/20">
            <div className="text-xs text-zinc-400 font-semibold mb-4 uppercase tracking-wider flex items-center gap-2">
              <Armchair size={14} className="text-emerald-500" />
              <span>Ghế Đang Chọn ({selectedSeats.length})</span>
            </div>
            {selectedSeats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-900/30 border border-zinc-900/80 border-dashed rounded-xl">
                <Armchair size={24} className="text-zinc-700 mb-2" />
                <p className="text-xs text-zinc-600 font-medium">Vui lòng chọn ghế trên sơ đồ</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((s) => {
                  const row = s.split('-')[0];
                  const zone = getZoneForRow(row);
                  return (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-lg text-white font-semibold flex items-center gap-1 border transition-all hover:scale-105"
                      style={{
                        backgroundColor: zone?.color ? `${zone.color}20` : '#26bc7120',
                        borderColor: zone?.color || '#26bc71',
                        color: zone?.color || '#26bc71',
                        boxShadow: `0 2px 8px ${zone?.color ? zone.color : '#26bc71'}15`,
                      }}
                    >
                      <span>Ghế {s}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom total + continue */}
          <div className="p-5 border-t border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
            {submitError && (
              <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5 flex items-start gap-2 animate-fadeInUp">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}
            
            {selectedSeats.length > 0 && (
              <div className="flex items-center justify-between mb-4 bg-zinc-900/40 border border-zinc-900 px-3.5 py-2.5 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">Tổng tiền thanh toán</span>
                <span className="text-white font-extrabold text-base tracking-tight">{formatPrice(totalPrice)}</span>
              </div>
            )}
            
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0 || submitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl transition duration-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] active:scale-[0.98]"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý đặt vé...</span>
                </div>
              ) : (
                <>
                  <span>Tiếp tục thanh toán</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
            <p className="text-[10px] text-zinc-500 text-center mt-3 font-medium">
              Bằng cách tiếp tục, bạn đồng ý với các Điều khoản mua vé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
