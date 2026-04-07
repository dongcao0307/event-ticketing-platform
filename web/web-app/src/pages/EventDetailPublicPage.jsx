import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, ChevronRight, Clock, Building2, Share2, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getDetailedEventById, relatedEvents } from '../services/bookingService';

const EventDetailPublicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getDetailedEventById(id);
      setEvent(data);
      if (data?.showtimes?.length) setSelectedShowtime(data.showtimes[0].id);
      setLoading(false);
    };
    load();
  }, [id]);

  const formatPrice = (p) =>
    p?.toLocaleString('vi-VN') + 'đ';

  const handleChooseTicket = (zoneId) => {
    if (event.type === 'theater') {
      navigate(`/event/${id}/seats?showtime=${selectedShowtime}&zone=${zoneId}`);
    } else {
      navigate(`/event/${id}/tickets?showtime=${selectedShowtime}`);
    }
  };

  const handleBookNow = () => {
    if (event.type === 'theater') {
      navigate(`/event/${id}/seats?showtime=${selectedShowtime}`);
    } else {
      navigate(`/event/${id}/tickets?showtime=${selectedShowtime}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-white">Không tìm thấy sự kiện.</div>
      </div>
    );
  }

  const activeShowtime = event.showtimes?.find((s) => s.id === selectedShowtime);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#26bc71]">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-400">{event.category}</span>
            <ChevronRight size={14} />
            <span className="text-gray-700 truncate max-w-[200px]">{event.title}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN */}
            <div className="flex-1 min-w-0">
              {/* Banner */}
              <div className="rounded-xl overflow-hidden shadow-md mb-5">
                <img src={event.image} alt={event.title} className="w-full h-64 lg:h-80 object-cover" />
              </div>

              {/* Title & actions */}
              <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{event.title}</h1>
                    {event.subtitle && <p className="text-gray-500 mt-1 text-sm">{event.subtitle}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-full border transition ${liked ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                    >
                      <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 text-gray-400 hover:border-gray-300 transition">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#26bc71] shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#26bc71] shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  {event.address && (
                    <div className="flex items-start gap-2">
                      <Building2 size={16} className="text-[#26bc71] shrink-0 mt-0.5" />
                      <span className="text-gray-400">{event.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Giới thiệu sự kiện</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              {/* Showtimes */}
              <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Lịch diễn</h2>
                  <label className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Múi giờ Việt Nam (GMT+7)</span>
                    <div className="relative w-9 h-5 bg-[#26bc71] rounded-full cursor-pointer">
                      <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  {event.showtimes.map((st) => (
                    <label
                      key={st.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        selectedShowtime === st.id
                          ? 'border-[#26bc71] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="showtime"
                        className="accent-[#26bc71]"
                        checked={selectedShowtime === st.id}
                        onChange={() => setSelectedShowtime(st.id)}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-sm text-gray-800">{st.label}</span>
                        <span className="text-xs text-gray-500 ml-2">{st.date}</span>
                      </div>
                      {selectedShowtime === st.id && (
                        <span className="text-xs text-[#26bc71] font-medium bg-green-100 px-2 py-0.5 rounded-full">
                          Đã chọn
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Ticket zones (theater) */}
              {event.type === 'theater' && (
                <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Thông tin vé</h2>
                  <p className="text-xs text-gray-400 mb-4">Chọn khu vé phù hợp với bạn</p>
                  <div className="space-y-3">
                    {event.ticketZones.map((zone) => (
                      <div key={zone.id} className="rounded-xl border border-gray-200 hover:border-gray-300 transition overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-900 text-sm">{zone.label}</span>
                                {zone.tag && (
                                  <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                    style={{ backgroundColor: zone.color }}
                                  >
                                    {zone.tag}
                                  </span>
                                )}
                              </div>
                              <div className="text-[#26bc71] font-bold text-base mt-0.5">
                                {formatPrice(zone.price)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleChooseTicket(zone.id)}
                            disabled={!selectedShowtime}
                            className="px-4 py-2 bg-[#26bc71] text-white text-sm font-semibold rounded-full hover:bg-[#1fa86a] transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                          >
                            Chọn vé ngay
                          </button>
                        </div>
                        {zone.tip && (
                          <div className="px-4 pb-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100 pt-2.5">
                            <span className="shrink-0 mt-0.5">💡</span>
                            <span>{zone.tip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ticket types (tham-quan) */}
              {event.type === 'tham-quan' && (
                <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Loại vé</h2>
                  <div className="space-y-3">
                    {event.ticketTypes.map((tt) => (
                      <div key={tt.id} className="p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{tt.label}</div>
                            <div className="text-[#26bc71] font-bold text-base mt-1">
                              {formatPrice(tt.price)}
                            </div>
                          </div>
                        </div>
                        {tt.description && (
                          <div className="mt-2 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                            <span className="mt-0.5">ℹ</span>
                            <span>{tt.description}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Ban tổ chức</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#26bc71] flex items-center justify-center text-white font-bold text-lg">
                    {event.organizer?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{event.organizer}</div>
                    <div className="text-xs text-gray-500">Ban tổ chức sự kiện</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-4 space-y-4">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-[#1a1a2e] p-4 text-white">
                    <h3 className="font-bold text-base truncate">{event.title}</h3>
                    {activeShowtime && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-300">
                        <Clock size={14} />
                        <span>{activeShowtime.label}, {activeShowtime.date}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-300">
                      <MapPin size={14} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Giá vé</div>
                    {event.type === 'theater' && event.ticketZones.map((zone) => (
                      <div key={zone.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: zone.color }} />
                          <span className="text-sm text-gray-600">{zone.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(zone.price)}</span>
                      </div>
                    ))}
                    {event.type === 'tham-quan' && event.ticketTypes.map((tt) => (
                      <div key={tt.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0 gap-2">
                        <span className="text-xs text-gray-600 leading-tight">{tt.label}</span>
                        <span className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(tt.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={handleBookNow}
                      disabled={!selectedShowtime}
                      className="w-full py-3 bg-[#26bc71] text-white font-bold rounded-xl hover:bg-[#1fa86a] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      Vui lòng chọn vé
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related events section */}
      <div className="bg-[#1a1a2e] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-white text-xl font-bold text-center mb-8">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedEvents
              .filter((e) => e.id !== id)
              .slice(0, 8)
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => navigate(`/event/${ev.id}`)}
                  className="bg-[#232340] rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 leading-snug min-h-[2.5rem]">
                      {ev.title}
                    </h3>
                    <div className="text-[#26bc71] font-bold text-sm mt-2">{ev.price}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{ev.date}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-2.5 bg-[#26bc71] text-white font-semibold rounded-full hover:bg-[#1fa86a] transition text-sm"
            >
              Xem thêm sự kiện
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EventDetailPublicPage;
