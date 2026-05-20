import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { getDetailedEventById } from '../services/bookingService';

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

  useEffect(() => {
    const load = async () => {
      const data = await getDetailedEventById(id);
      setEvent(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const occupiedSet = useMemo(
    () => new Set(event?.occupiedSeats || []),
    [event]
  );

  const activeShowtime = event?.showtimes?.find((s) => s.id === showtimeId) || event?.showtimes?.[0];

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

  const getZoneColor = (row) => {
    if (!event) return '#22c55e';
    for (const zone of event.ticketZones) {
      if (zone.rows.includes(row)) return zone.color;
    }
    return '#22c55e';
  };

  const getZoneForRow = (row) => {
    if (!event) return null;
    return event.ticketZones.find((z) => z.rows.includes(row)) || null;
  };

  const totalPrice = useMemo(() => {
    if (!event) return 0;
    return selectedSeats.reduce((sum, seatKey) => {
      const row = seatKey.split('-')[0];
      const zone = getZoneForRow(row);
      return sum + (zone?.price || 0);
    }, 0);
  }, [selectedSeats, event]);

  const formatPrice = (p) => p.toLocaleString('vi-VN') + 'đ';

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    const params = new URLSearchParams({
      showtime: showtimeId || '',
      seats: selectedSeats.join(','),
    });
    navigate(`/event/${id}/booking?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
        Đang tải sơ đồ chỗ ngồi...
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

  const allRows = event.ticketZones.flatMap((z) => z.rows);

  const zonesGrouped = event.ticketZones.map((zone) => ({
    ...zone,
    seatsPerRow: zone.seatsPerRow || 22,
  }));

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      {/* Top bar */}
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

      {/* Legend */}
      <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-6 justify-center">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Seat map */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Stage */}
          <div className="mx-auto max-w-2xl mb-8">
            <div className="bg-gray-600 text-white text-center py-4 rounded-lg text-xl font-bold tracking-widest shadow-lg">
              STAGE
            </div>
          </div>

          {/* Seat zones */}
          <div className="mx-auto max-w-2xl space-y-6">
            {zonesGrouped.map((zone) => (
              <div key={zone.id}>
                {/* Zone label shown above every zone */}
                <div
                  className="text-center py-2 mb-3 rounded text-white font-bold text-sm tracking-widest"
                  style={{ backgroundColor: zone.color + '33', border: `1px solid ${zone.color}44` }}
                >
                  {zone.label.toUpperCase()}
                </div>

                <div className="space-y-1.5">
                  {zone.rows.map((row) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs w-4 text-center font-mono">{row}</span>
                      <div className="flex gap-1 flex-wrap justify-center flex-1">
                        {Array.from({ length: zone.seatsPerRow }, (_, i) => {
                          const seatNum = i + 1;
                          const seatKey = `${row}-${seatNum}`;
                          const overrideColor = getSeatColor(seatKey);
                          const zoneColor = zone.color;
                          const isOccupied = occupiedSet.has(seatKey);
                          const isSelected = selectedSeats.includes(seatKey);
                          return (
                            <button
                              key={seatNum}
                              onClick={() => toggleSeat(seatKey)}
                              disabled={isOccupied}
                              title={`Ghế ${row}${seatNum}`}
                              className="w-5 h-5 rounded-sm text-[8px] font-bold flex items-center justify-center transition-transform hover:scale-110 disabled:cursor-not-allowed"
                              style={{
                                backgroundColor: overrideColor || zoneColor,
                                opacity: isOccupied ? 0.9 : 1,
                                color: 'white',
                              }}
                            >
                              {seatNum}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-gray-400 text-xs w-4 text-center font-mono">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

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

          {/* Ticket zone pricing */}
          <div className="p-4 border-b border-gray-800">
            <div className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wide">Giá vé</div>
            {event.ticketZones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: zone.color }} />
                  <span className="text-xs text-gray-300">{zone.label}</span>
                </div>
                <span className="text-xs font-semibold text-white">{formatPrice(zone.price)}</span>
              </div>
            ))}
          </div>

          {/* Selected seats */}
          <div className="p-4 flex-1 overflow-auto">
            <div className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wide">
              Ghế đã chọn ({selectedSeats.length})
            </div>
            {selectedSeats.length === 0 ? (
              <p className="text-xs text-gray-600 italic">Chưa chọn ghế nào</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((s) => {
                  const row = s.split('-')[0];
                  const zone = getZoneForRow(row);
                  return (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                      style={{ backgroundColor: zone?.color || '#26bc71' }}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom total + continue */}
          <div className="p-4 border-t border-gray-800">
            {selectedSeats.length > 0 && (
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-gray-400">Tổng cộng</span>
                <span className="text-white font-bold text-base">{formatPrice(totalPrice)}</span>
              </div>
            )}
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="w-full py-3 bg-[#26bc71] text-white font-bold rounded-xl hover:bg-[#1fa86a] transition text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Vui lòng chọn vé
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
