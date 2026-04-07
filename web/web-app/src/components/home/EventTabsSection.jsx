import { useState } from "react";
import { ChevronRight } from "lucide-react";
import EventCard from "./EventCard";

const EventTabsSection = ({ weekendEvents = [], monthEvents = [] }) => {
  const [activeTab, setActiveTab] = useState("weekend");

  const events = activeTab === "weekend" ? weekendEvents : monthEvents;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        {/* TABS */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("weekend")}
            className={`font-semibold pb-2 border-b-2 transition ${
              activeTab === "weekend"
                ? "border-[#26bc71] text-[#26bc71]"
                : "border-transparent text-gray-500"
            }`}
          >
            Cuối tuần này
          </button>

          <button
            onClick={() => setActiveTab("month")}
            className={`font-semibold pb-2 border-b-2 transition ${
              activeTab === "month"
                ? "border-[#26bc71] text-[#26bc71]"
                : "border-transparent text-gray-500"
            }`}
          >
            Tháng này
          </button>
        </div>

        <a
          href="#"
          className="flex items-center gap-1 font-medium text-[#26bc71] hover:underline"
        >
          Xem thêm <ChevronRight size={18} />
        </a>
      </div>

      {/* EVENTS */}
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

    </section>
  );
};

export default EventTabsSection;