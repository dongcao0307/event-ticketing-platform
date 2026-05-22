import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';

const EventSection = ({ title, events = [] }) => {
  const scrollerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: 'smooth',
    });
  };

  return (
    <section className="tb-section">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 className="tb-section-title">{title}</h2>
        <a
          href={`/category/${encodeURIComponent(title)}`}
          className="tb-see-more"
        >
          Xem thêm <ChevronRight size={15} />
        </a>
      </div>

      {/* Card Scroller */}
      <div style={{ position: 'relative' }}>
        <div
          ref={scrollerRef}
          style={{
            display: 'flex',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
          className="hide-scrollbar"
        >
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))
          ) : (
            <div className="tb-empty-state">
              <div style={{ fontSize: '36px' }}>🎫</div>
              <p className="tb-empty-state-title">Hiện chưa có sự kiện hoạt động</p>
              <p className="tb-empty-state-desc">
                Chúng tôi đang cập nhật thêm sự kiện. Vui lòng quay lại sau hoặc thử lựa chọn thể loại khác.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventSection;
