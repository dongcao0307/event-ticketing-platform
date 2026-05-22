import { useState } from "react";
import { ChevronRight } from "lucide-react";
import EventCard from "./EventCard";

const EventTabsSection = ({ weekendEvents = [], monthEvents = [] }) => {
  const [activeTab, setActiveTab] = useState("weekend");

  const events = activeTab === "weekend" ? weekendEvents : monthEvents;

  return (
    <section className="tb-section">
      {/* Header with Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <button
            onClick={() => setActiveTab("weekend")}
            className={`tb-tab-btn ${activeTab === "weekend" ? "active" : ""}`}
          >
            🗓️ Cuối tuần này
          </button>
          <button
            onClick={() => setActiveTab("month")}
            className={`tb-tab-btn ${activeTab === "month" ? "active" : ""}`}
          >
            📅 Tháng này
          </button>
        </div>

        <a href="#" className="tb-see-more">
          Xem thêm <ChevronRight size={15} />
        </a>
      </div>

      {/* Events */}
      <div
        style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}
        className="hide-scrollbar"
      >
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))
        ) : (
          <div className="tb-empty-state">
            <div style={{ fontSize: '36px' }}>📅</div>
            <p className="tb-empty-state-title">Chưa có sự kiện nào</p>
            <p className="tb-empty-state-desc">Hiện chưa có sự kiện trong khoảng thời gian này.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventTabsSection;