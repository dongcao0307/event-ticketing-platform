import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';

const EventSection = ({ title, events = [] }) => {
  const scrollerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <a
          href={`/category/${encodeURIComponent(title)}`}
          className="flex items-center gap-1 text-[#26bc71] hover:underline font-medium transition"
        >
          Xem thêm <ChevronRight size={18} />
        </a>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-2 hide-scrollbar"
      >
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))
        ) : (
          <div className="w-full rounded-3xl border border-dashed border-gray-300 bg-white/80 px-6 py-10 text-center text-gray-500 min-h-[220px] flex flex-col items-center justify-center gap-3">
            <div className="text-4xl">🎫</div>
            <p className="text-lg font-semibold text-gray-800">Hiện chưa có sự kiện hoạt động</p>
            <p className="max-w-lg text-sm text-gray-500">
              Chúng tôi đang cập nhật thêm sự kiện. Vui lòng quay lại sau hoặc thử lựa chọn thể loại khác.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventSection;
