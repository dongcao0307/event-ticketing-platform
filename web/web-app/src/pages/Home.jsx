import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeHero from '../components/home/HomeHero';
import CategoryTabs from '../components/home/CategoryTabs';
import EventSection from '../components/home/EventSection';
import BrowseCities from '../components/home/BrowseCities';
import ResaleCarousel from "../components/home/ResaleCarousel";
import EventTabsSection from "../components/home/EventTabsSection";
import {
  getFeaturedEvents,
  getTrendingEvents,
  getRecommendedEvents,
  getResaleEvents,
  getWeekendEvents,
  getMonthEvents,
} from '../services/eventService';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('Nhạc sống');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [resaleEvents, setResaleEvents] = useState([]);
  const [weekendEvents, setWeekendEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);

      const [featured, trending, recommended, resale, weekend, month] = await Promise.all([
        getFeaturedEvents(),
        getTrendingEvents(),
        getRecommendedEvents(),
        getResaleEvents(),
        getWeekendEvents(),
        getMonthEvents(),
      ]);

      setFeaturedEvents(featured);
      setTrendingEvents(trending);
      setRecommendedEvents(recommended);
      setResaleEvents(resale);
      setWeekendEvents(weekend);
      setMonthEvents(month);
      setLoading(false);
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-gray-800">
        <p className="text-lg font-semibold">Đang tải dữ liệu sự kiện...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-100">
      <Header />
      <main className="flex-1">
        <HomeHero />
        <div className="bg-slate-100">
          <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />

          <EventSection
            title="Sự kiện đặc biệt"
            events={featuredEvents}
          />

          <EventSection
            title="🔥Sự kiện xu hướng"
            events={trendingEvents}
          />

          <EventSection
            title="Gợi ý dành cho bạn"
            events={recommendedEvents}
          />

          <EventTabsSection
            weekendEvents={weekendEvents}
            monthEvents={monthEvents}
          />

          <ResaleCarousel events={resaleEvents} />

          <EventSection
            title="Nhạc sống"
            events={recommendedEvents}
          />

          <EventSection
            title="Sân khấu & Nghệ thuật"
            events={recommendedEvents}
          />

          <EventSection
            title="Hội thảo & Workshop"
            events={recommendedEvents}
          />

          <EventSection
            title="Tham quan & Trải nghiệm"
            events={recommendedEvents}
          />

          <EventSection
            title="Thể loại khác"
            events={recommendedEvents}
          />

          <BrowseCities />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
