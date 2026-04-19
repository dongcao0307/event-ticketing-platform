import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, MapPin, ChevronRight, Clock, Building2, Share2, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getEventById, getTrendingEvents } from '../services/eventService';

const EventDetailPublicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getEventById(id);
        setEvent(data);
        const related = await getTrendingEvents();
        setRelatedEvents(related || []);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sự kiện:', err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatPrice = (p) =>
    p?.toLocaleString('vi-VN') + 'đ';

  const handleBookNow = () => {
    navigate(`/event/${id}/tickets`);
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

              <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Thông tin sự kiện</h2>
                <div className="grid gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{event.date || 'Chưa có thời gian'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.location || event.city || 'Đang cập nhật'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#26bc71]" />
                    <span>{event.category || 'Khác'}</span>
                  </div>
                  {event.status && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#effaf0] px-3 py-1 text-xs font-semibold text-[#166534]">
                      <span>{event.status}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {event.availableTickets != null ? `${event.availableTickets} / ${event.totalTickets} vé còn lại` : 'Thông tin vé chưa có'}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Mô tả</h2>
                <p className="text-sm leading-relaxed text-gray-600">{event.description || 'Chưa có mô tả chi tiết cho sự kiện này.'}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-[#1a1a2e] p-4 text-white">
                  <h3 className="font-bold text-base">{event.title}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-300">
                    <MapPin size={14} />
                    <span>{event.location || event.city}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Giá vé</div>
                  <div className="text-2xl font-bold text-[#26bc71]">{event.price || event.priceDisplay || 'Miễn phí'}</div>
                  <div className="mt-3 text-sm text-gray-500">
                    {event.organizerName ? `Tổ chức bởi ${event.organizerName}` : 'Ban tổ chức chưa cập nhật'}
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button
                    onClick={handleBookNow}
                    className="w-full py-3 bg-[#26bc71] text-white font-bold rounded-xl hover:bg-[#1fa86a] transition text-sm flex items-center justify-center gap-2"
                  >
                    Mua vé ngay
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related events section */}
      <div className="bg-[#1a1a2e] py-10">
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
                    <div className="text-[#26bc71] font-bold text-sm mt-2">{ev.price || ev.priceDisplay || 'Miễn phí'}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                      <Calendar size={12} />
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
