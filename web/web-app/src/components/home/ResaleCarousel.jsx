import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "./EventCard";

import dogResale from "../../assets/dog_resale_ticket.png";
import greenCloud from "../../assets/green_cloud.svg";

const VISIBLE_ITEMS = 3;

const ResaleCarousel = ({ events = [] }) => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) =>
      prev + 1 > events.length - VISIBLE_ITEMS ? 0 : prev + 1
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? Math.max(0, events.length - VISIBLE_ITEMS) : prev - 1
    );
  };

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [events]);

  return (
    <section className="tb-section">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>

        {/* LEFT BANNER */}
        <div className="tb-resale-banner" style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={greenCloud}
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 0, opacity: 0.6 }}
            alt=""
            aria-hidden="true"
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: 0 }}>
              Resale <br /> Ticket
            </h2>
            <div style={{
              marginTop: '10px',
              display: 'inline-block',
              background: '#fde047',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#1a1a1a',
            }}>
              VÉ BÁN LẠI
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
            <img src={dogResale} style={{ width: '120px' }} alt="Resale mascot" />
          </div>

          <div style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            Xem thêm →
          </div>
        </div>

        {/* RIGHT CAROUSEL */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Arrow buttons */}
          <div className="tb-resale-carousel-arrows">
            <button
              onClick={prev}
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Carousel track */}
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease',
              transform: `translateX(-${index * 234}px)`,
              gap: '14px',
              padding: '0 36px',
            }}
          >
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} style={{ flexShrink: 0 }}>
                  <EventCard {...event} />
                </div>
              ))
            ) : (
              <div className="tb-empty-state" style={{ minWidth: '300px' }}>
                <div style={{ fontSize: '36px' }}>🎫</div>
                <p className="tb-empty-state-title">Chưa có vé bán lại</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ResaleCarousel;