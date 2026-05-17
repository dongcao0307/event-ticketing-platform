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
  getEventsByCategory,
  getLatestEvents 
} from '../services/eventService';

// =====================================================================
// ĐÃ ĐỒNG BỘ ĐẦY ĐỦ 100% CÁC THỂ LOẠI THEO ENUM BACKEND JAVA
// =====================================================================
const CATEGORY_MAP = {
  'Nhạc sống': 'MUSIC',
  'Sân khấu & Nghệ thuật': 'THEATER',
  'Thể thao': 'SPORTS',
  'Hội thảo & Workshop': 'WORKSHOP',
  'Tham quan & Trải nghiệm': 'FESTIVAL',
  'Hài kịch': 'COMEDY',       // 🌟 Mới bổ sung
  'Triển lãm': 'EXHIBITION',   // 🌟 Mới bổ sung
  'Khác': 'OTHER'
};

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả'); 
  
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [resaleEvents, setResaleEvents] = useState([]);
  const [weekendEvents, setWeekendEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]); 
  const [categoryFilteredEvents, setCategoryFilteredEvents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const onlyPublished = (events = []) => events.filter((event) => event?.status === 'PUBLISHED');

  useEffect(() => {
    const loadDefaultEvents = async () => {
      setLoading(true);
      const [featured, trending, recommended, resale, weekend, month, latest] = await Promise.all([
        getFeaturedEvents(),
        getTrendingEvents(),
        getRecommendedEvents(),
        getResaleEvents(),
        getWeekendEvents(),
        getMonthEvents(),
        getLatestEvents(), 
      ]);

      setFeaturedEvents(onlyPublished(featured));
      setTrendingEvents(onlyPublished(trending));
      setRecommendedEvents(onlyPublished(recommended));
      setResaleEvents(onlyPublished(resale));
      setWeekendEvents(onlyPublished(weekend));
      setMonthEvents(onlyPublished(month));
      setLatestEvents(onlyPublished(latest)); 
      setLoading(false);
    };

    loadDefaultEvents();
  }, []);

  useEffect(() => {
    if (activeCategory !== 'Tất cả') {
      const fetchCategoryEvents = async () => {
        setLoadingCategory(true);
        const enumValue = CATEGORY_MAP[activeCategory]; 
        if (enumValue) {
          const events = await getEventsByCategory(enumValue);
          setCategoryFilteredEvents(onlyPublished(events));
        } else {
          setCategoryFilteredEvents([]);
        }
        setLoadingCategory(false);
      };
      fetchCategoryEvents();
    }
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-gray-800">
        <p className="text-lg font-semibold">Đang tải dữ liệu sự kiện...</p>
      </div>
    );
  }

  const allEventsPool = Array.from(
    new Map(
      [...latestEvents, ...featuredEvents, ...trendingEvents, ...recommendedEvents, ...weekendEvents, ...monthEvents]
      .map(item => [item.id, item])
    ).values()
  );

  const checkCategory = (event, targetEnum) => {
    if (!event || !event.category) return false;
    if (typeof event.category === 'string') return event.category === targetEnum;
    return event.category.name === targetEnum || event.category.code === targetEnum;
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100">
      <Header />
      <main className="flex-1">
        <HomeHero />
        <div className="bg-slate-100">
          
          <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />

          {activeCategory === 'Tất cả' ? (
            <>
              <EventSection title="Sự kiện đặc biệt" events={featuredEvents} />
              <EventSection title="🔥 Sự kiện xu hướng" events={trendingEvents} />
              <EventSection title="Sự kiện mới nhất" events={latestEvents} /> 
              <EventTabsSection weekendEvents={weekendEvents} monthEvents={monthEvents} />
              <ResaleCarousel events={resaleEvents} />
              
              {/* ===================================================================== */}
              {/* DANH SÁCH KHỐI PHÂN CHIA THEO ĐÚNG CÁC ENUM TRONG DATABASE */}
              {/* ===================================================================== */}
              <EventSection 
                title="Nhạc sống" 
                events={allEventsPool.filter(e => checkCategory(e, 'MUSIC'))} 
              />
              <EventSection 
                title="Sân khấu & Nghệ thuật" 
                events={allEventsPool.filter(e => checkCategory(e, 'THEATER'))} 
              />
              <EventSection 
                title="Hài kịch" 
                events={allEventsPool.filter(e => checkCategory(e, 'COMEDY'))} // 🌟 Mới bổ sung
              />
              <EventSection 
                title="Hội thảo & Workshop" 
                events={allEventsPool.filter(e => checkCategory(e, 'WORKSHOP'))} 
              />
              <EventSection 
                title="Tham quan & Trải nghiệm" 
                events={allEventsPool.filter(e => checkCategory(e, 'FESTIVAL'))} 
              />
              <EventSection 
                title="Triển lãm" 
                events={allEventsPool.filter(e => checkCategory(e, 'EXHIBITION'))} // 🌟 Mới bổ sung
              />
              <EventSection 
                title="Thể thao" 
                events={allEventsPool.filter(e => checkCategory(e, 'SPORTS'))} 
              />
              <EventSection 
                title="Thể loại khác" 
                events={allEventsPool.filter(e => checkCategory(e, 'OTHER'))} // 🌟 Mới bổ sung khối 'Khác'
              />

              <BrowseCities />
            </>
          ) : (
            <div className="py-8 min-h-[400px]">
              {loadingCategory ? (
                <div className="flex justify-center text-gray-800 font-medium">Đang tìm sự kiện {activeCategory}...</div>
              ) : categoryFilteredEvents.length > 0 ? (
                <div className="space-y-4">
                  <EventSection title={`Sự kiện ${activeCategory}`} events={categoryFilteredEvents} />
                </div>
              ) : (
                <div className="flex justify-center text-gray-500 italic mt-10">
                  Hiện chưa có sự kiện nào thuộc thể loại {activeCategory}.
                </div>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;