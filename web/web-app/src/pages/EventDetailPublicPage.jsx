import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, ChevronRight, Clock, Building2, Share2, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTrendingEvents, getFavoriteStatus, toggleFavoriteEvent } from '../services/eventService';
import { getDetailedEventById } from '../services/bookingService';
import { authService } from '../services/authService';

const EventDetailPublicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [expandedPerformanceId, setExpandedPerformanceId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDetailedEventById(id);
        setEvent(data);
        const related = await getTrendingEvents();
        setRelatedEvents(related || []);

        if (authService.isLoggedIn()) {
          try {
            const isFav = await getFavoriteStatus(id);
            setLiked(!!isFav);
          } catch (err) {
            console.error('Lỗi khi tải trạng thái yêu thích:', err);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sự kiện:', err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatPrice = (p) => (Number(p) || 0).toLocaleString('vi-VN') + 'đ';

  const formatTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isSeatEvent = (event?.category || '').toUpperCase() === 'THEATER';

  const handlePurchase = (performanceId) => {
    if (!authService.isLoggedIn()) {
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }
    const params = new URLSearchParams({ showtime: performanceId });
    const nextPath = isSeatEvent ? 'seats' : 'tickets';
    navigate(`/event/${id}/${nextPath}?${params.toString()}`);
  };

  const togglePerformance = (performanceId) => {
    setExpandedPerformanceId((prev) => (prev === performanceId ? null : performanceId));
  };

  const handleToggleFavorite = async () => {
    if (!authService.isLoggedIn()) {
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }
    try {
      const isFav = await toggleFavoriteEvent(id);
      setLiked(isFav);
    } catch (err) {
      console.error('Lỗi khi thay đổi trạng thái yêu thích:', err);
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0] overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="bg-[#1a1a1a] border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#26bc71] transition-colors">Trang chủ</Link>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-gray-400">{event.category}</span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-gray-200 truncate max-w-[200px]">{event.title}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-6">
          {/* Ticket-shaped Banner (Full Width) */}
          <div className="relative flex flex-col md:flex-row bg-[#1e1e1e] rounded-2xl shadow-2xl mb-8 overflow-visible">
            {/* Left Stub: Event Details */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between min-w-0 md:pr-10 relative rounded-t-2xl md:rounded-t-none md:rounded-l-2xl border-b md:border-b-0 md:border-r border-dashed border-white/15 z-20">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#26bc71]/10 text-[#26bc71] text-xs font-bold uppercase tracking-wider">
                    {event.category || 'SỰ KIỆN'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-full border transition ${liked ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'border-white/10 text-gray-400 hover:border-[#26bc71] hover:text-[#26bc71]'}`}
                    >
                      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 rounded-full border border-white/10 text-gray-400 hover:border-[#26bc71] hover:text-[#26bc71] transition">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-5 tracking-tight">
                  {event.title}
                </h1>

                <div className="space-y-3.5 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-[#26bc71] shrink-0" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#26bc71]">
                        {event.performances?.length > 0 
                          ? `${formatTime(event.performances[0].startTime)} - ${formatTime(event.performances[0].endTime)}, ${formatDate(event.performances[0].startTime)}`
                          : (event.date || 'Đang cập nhật')}
                      </span>
                      {event.performances?.length > 1 && (
                        <span className="text-[11px] font-semibold text-[#26bc71] bg-[#26bc71]/10 px-2 py-0.5 rounded border border-[#26bc71]/20">
                          + {event.performances.length - 1} ngày khác
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#26bc71] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#26bc71]">{event.location || event.city}</div>
                      {event.address && <div className="text-gray-400 text-xs mt-0.5">{event.address}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="mt-8 border-t border-white/10 pt-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 cursor-pointer group/price" onClick={() => {
                  document.getElementById('showtimes-section')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span className="text-sm text-gray-400">Giá từ</span>
                  <span className="text-2xl font-black text-[#26bc71] tracking-tight hover:underline flex items-center gap-1">
                    {event.minPrice !== null && event.minPrice !== undefined && Number(event.minPrice) > 0 
                      ? formatPrice(event.minPrice) 
                      : 'Miễn phí'}
                  </span>
                  <ChevronRight size={20} className="text-[#26bc71] transition-transform group-hover/price:translate-x-1" />
                </div>
                <button
                  onClick={() => {
                    if (event.performances?.length > 0) {
                      if (event.performances.length === 1) {
                        handlePurchase(event.performances[0].id);
                      } else {
                        document.getElementById('showtimes-section')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className="w-full py-4 bg-[#26bc71] hover:bg-[#1fa86a] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#26bc71]/20 hover:shadow-[#26bc71]/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Mua vé ngay
                </button>
              </div>

              {/* Responsive Ticket Cutouts */}
              {/* Cutout 1: Left-Bottom on Mobile, Right-Top on Desktop */}
              <div className="absolute w-8 h-8 rounded-full bg-[#121212] z-30 left-0 bottom-0 -translate-x-1/2 translate-y-1/2 md:left-auto md:right-0 md:top-0 md:bottom-auto md:translate-x-1/2 md:-translate-y-1/2" />
              
              {/* Cutout 2: Right-Bottom on Mobile, Right-Bottom on Desktop */}
              <div className="absolute w-8 h-8 rounded-full bg-[#121212] z-30 right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
            </div>

            {/* Right: Event Poster/Cover */}
            <div className="w-full md:w-[46%] lg:w-[48%] shrink-0 relative overflow-hidden rounded-b-2xl md:rounded-b-none md:rounded-l-none md:rounded-r-2xl h-64 md:h-auto z-10">
              <img
                src={event.image || event.imageUrl || 'https://via.placeholder.com/1200x600?text=Ảnh+sự+kiện+không+tồn+tại'}
                alt={event.title}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=Ảnh+sự+kiện+không+tồn+tại'; }}
                className="w-full h-full object-cover md:absolute md:inset-0 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN */}
            <div className="flex-1 min-w-0">
              {/* Description */}
              <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 shadow-sm mb-4">
                <h2 className="text-base font-semibold text-white mb-3">Giới thiệu sự kiện</h2>
                <div 
                  className="event-description text-sm text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.description || 'Chưa có mô tả chi tiết cho sự kiện này.' }}
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div id="showtimes-section" className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4">
              {/* Tickets and showtimes */}
              <div className="bg-[#1e1e1e] border border-white/5 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-[#1a1a1a] p-4 text-white border-b border-white/5">
                  <h3 className="font-bold text-base">Lịch diễn & vé</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-400">
                    <MapPin size={14} className="text-[#26bc71]" />
                    <span>{event.location || event.city}</span>
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {(event.performances || []).length === 0 && (
                    <div className="p-4 text-sm text-gray-400">Chưa có suất diễn cho sự kiện này.</div>
                  )}
                  {(event.performances || []).map((perf) => {
                    const timeLabel = perf.label || `${formatTime(perf.startTime)} - ${formatTime(perf.endTime)}`;
                    const dateLabel = perf.date || formatDate(perf.startTime) || 'Đang cập nhật';
                    const isDisabled = perf.status && perf.status !== 'OPEN';
                    const isExpanded = expandedPerformanceId === perf.id;
                    return (
                      <div key={perf.id} className="bg-[#1e1e1e]">
                        <button
                          onClick={() => togglePerformance(perf.id)}
                          className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[#252525] transition"
                        >
                          <div>
                            <div className="text-sm text-white font-semibold">{timeLabel || 'Chưa có giờ'}</div>
                            <div className="text-xs text-[#26bc71] mt-0.5">{dateLabel}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isDisabled && (
                              <span className="text-xs text-gray-400">Vé ngừng bán online</span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePurchase(perf.id);
                              }}
                              disabled={isDisabled}
                              className="px-3 py-1.5 bg-[#26bc71] text-white text-xs font-semibold rounded-md hover:bg-[#1fa86a] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              Mua vé
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="bg-[#151515] px-4 py-3 border-t border-white/5">
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Thông tin vé</div>
                            {(perf.tickets || []).length === 0 && (
                              <div className="text-xs text-gray-500">Chưa có loại vé cho suất diễn này.</div>
                            )}
                            {(perf.tickets || []).map((tt) => (
                              <div key={tt.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                <span className="text-xs text-gray-300">{tt.label || tt.name}</span>
                                <span className="text-xs font-semibold text-[#26bc71]">{formatPrice(tt.price)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Event Info */}
              <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-semibold text-white mb-3">Thông tin sự kiện</h2>
                <div className="grid gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#26bc71]" />
                    <span>{event.date || 'Chưa có thời gian'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#26bc71]" />
                    <span>{event.location || event.city || 'Đang cập nhật'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#26bc71]" />
                    <span>{event.category || 'Khác'}</span>
                  </div>
                  {event.status && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 border border-green-500/20">
                      <span>{event.status}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    {event.availableTickets != null ? `${event.availableTickets} / ${event.totalTickets} vé còn lại` : 'Thông tin vé chưa có'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Related events section */}
      <div className="bg-[#151515] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-white text-xl font-bold text-center mb-8">Bạn có thể quan tâm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedEvents
              .filter((e) => String(e.id) !== String(id))
              .slice(0, 8)
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => navigate(`/event/${ev.id}`)}
                  className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:border-white/10 hover:shadow-lg group"
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
                    <div className="text-[#26bc71] font-bold text-sm mt-2">{ev.price || ev.priceDisplay || 'Miễn phí'}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                      <Calendar size={12} className="text-[#26bc71]" />
                      <span>{ev.date || ev.formattedDate}</span>
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
