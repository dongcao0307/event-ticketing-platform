import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=2000&q=80",
    title: "Khám phá sự kiện nơi bạn muốn",
    desc: "Tìm vé nhanh, an toàn và nhận ưu đãi khi tham gia những trải nghiệm đáng nhớ.",
    link: "/events",
  },
  {
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80",
    title: "Concert & Festival hấp dẫn",
    desc: "Trải nghiệm âm nhạc đỉnh cao cùng nghệ sĩ yêu thích.",
    link: "/events/concert",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2000&q=80",
    title: "Workshop & Trải nghiệm",
    desc: "Khám phá những hoạt động sáng tạo thú vị.",
    link: "/events/workshop",
  },
];

const HomeHero = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // auto slide
  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timer);
  }, [paused]);

  const slide = slides[index];

  const goToSlide = (url) => {
    window.location.href = url;
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0f211d] via-[#112a25] to-[#0f211d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 lg:pb-24">
        <div
          className="relative rounded-3xl overflow-hidden shadow-xl group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* IMAGE */}
          <img
            src={slide.image}
            alt={slide.title}
            onClick={() => goToSlide(slide.link)}
            className="w-full h-[420px] md:h-[520px] object-cover cursor-pointer transition-opacity duration-700"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* CONTENT */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-14 lg:px-20">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg max-w-2xl">
              {slide.title}
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/80 max-w-xl">
              {slide.desc}
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => goToSlide(slide.link)}
                className="rounded-full bg-[#26bc71] px-6 py-3 text-sm font-semibold text-white 
                          shadow-lg shadow-[#26bc71]/40
                          group-hover:bg-[#32d583] hover:shadow-[0_0_25px_6px_rgba(38,188,113,0.7)]
                          transition-all duration-300"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* LEFT ARROW */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight />
          </button>

          {/* DOTS */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition ${i === index ? "bg-[#26bc71]" : "bg-white/50"
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeHero;