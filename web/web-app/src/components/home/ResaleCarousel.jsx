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
      prev === 0 ? events.length - VISIBLE_ITEMS : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [events]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-6">

        {/* LEFT BANNER */}
        <div className="relative w-[320px] min-w-[320px] rounded-3xl overflow-hidden bg-[#7ddc9a] p-6 flex flex-col justify-between">

          <img
            src={greenCloud}
            className="absolute bottom-0 left-0 w-full"
          />

          <div className="relative z-10">
            <h2 className="text-3xl font-black leading-tight">
              Resale <br /> Ticket
            </h2>

            <div className="mt-2 inline-block bg-yellow-300 px-3 py-1 rounded-full text-sm font-bold">
              VÉ BÁN LẠI
            </div>
          </div>

          <div className="relative z-10 flex justify-center">
            <img
              src={dogResale}
              className="w-36"
            />
          </div>

          <div className="relative z-10 text-white font-semibold cursor-pointer">
            Xem thêm →
          </div>
        </div>

        {/* RIGHT CAROUSEL */}
        <div className="flex-1 relative overflow-hidden">

          {/* arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          >
            <ChevronRight />
          </button>

          {/* carousel track */}
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${index * 272}px)`
            }}
          >
            {events.map((event) => (
              <div key={event.id} className="mr-4">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ResaleCarousel;