import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=2000&q=80",
    title: "Khám phá sự kiện nổi bật nhất",
    desc: "Tìm vé nhanh, an toàn và nhận ưu đãi khi tham gia những trải nghiệm đáng nhớ.",
    link: "/events",
    tag: "🎵 ÂM NHẠC",
  },
  {
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=2000&q=80",
    title: "Concert & Festival hấp dẫn",
    desc: "Trải nghiệm âm nhạc đỉnh cao cùng nghệ sĩ yêu thích của bạn.",
    link: "/events/concert",
    tag: "🎤 CONCERT",
  },
  {
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80",
    title: "Workshop & Trải nghiệm sáng tạo",
    desc: "Khám phá những hoạt động sáng tạo thú vị, kết nối và học hỏi.",
    link: "/events/workshop",
    tag: "💡 WORKSHOP",
  },
];

const HomeHero = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, index]);

  const slide = slides[index];

  return (
    <section
      className="tb-hero-section"
      style={{ padding: '24px 20px 32px', maxWidth: '1280px', margin: '0 auto' }}
    >
      <div
        className="tb-hero-slide"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ position: 'relative', height: '440px' }}
      >
        {/* Background Image */}
        <img
          src={slide.image}
          alt={slide.title}
          onClick={() => window.location.href = slide.link}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 48px',
        }}>
          {/* Tag */}
          <div style={{
            display: 'inline-block',
            background: 'var(--brand-green)',
            color: 'white',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '12px',
            marginBottom: '16px',
            letterSpacing: '0.5px',
            alignSelf: 'flex-start',
          }}>
            {slide.tag}
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: 900,
            color: 'white',
            margin: 0,
            lineHeight: 1.15,
            maxWidth: '540px',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            letterSpacing: '-0.5px',
          }}>
            {slide.title}
          </h1>

          <p style={{
            marginTop: '16px',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '440px',
            lineHeight: 1.6,
          }}>
            {slide.desc}
          </p>

          <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
            <Link
              to={slide.link}
              style={{
                display: 'inline-block',
                background: 'var(--brand-green)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(38,188,113,0.5)',
                transition: 'all 0.25s ease',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--brand-green-light)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(38,188,113,0.7)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--brand-green)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(38,188,113,0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Khám phá ngay
            </Link>
            <Link
              to="/events"
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Tất cả sự kiện
            </Link>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={prev}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 5,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(38,188,113,0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 5,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(38,188,113,0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 5,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === index ? 'var(--brand-green)' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;