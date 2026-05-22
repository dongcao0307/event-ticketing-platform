import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeHero from '../components/home/HomeHero';
import CategoryTabs from '../components/home/CategoryTabs';
import EventSection from '../components/home/EventSection';
import BrowseCities from '../components/home/BrowseCities';
import ResaleCarousel from "../components/home/ResaleCarousel";
import EventTabsSection from "../components/home/EventTabsSection";
import AdBanner from "../components/home/AdBanner";
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
  'Hài kịch': 'COMEDY',
  'Triển lãm': 'EXHIBITION',
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
      <div className="tb-loading">
        <div className="tb-loading-spinner"></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Đang tải dữ liệu sự kiện...</p>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <HomeHero />

        <div className="tb-category-section">
          <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        <div className="tb-main-content">
          {activeCategory === 'Tất cả' ? (
            <>
              <EventSection title="Sự kiện đặc biệt" events={featuredEvents} />

              <AdBanner
                variant="green"
                title="Mua vé sự kiện — Nhận ưu đãi đặc biệt!"
                subtitle="Đặt vé ngay hôm nay — Giảm ngay 50K cho đơn đầu tiên"
                badge="HOT "
              />

              <EventSection title="Sự kiện xu hướng" events={trendingEvents} />
              <EventSection title="Sự kiện mới nhất" events={latestEvents} />

              <EventTabsSection weekendEvents={weekendEvents} monthEvents={monthEvents} />

              <AdBanner
                variant="orange"
                title="Vé đến tay, bạn đến — Trải nghiệm không giới hạn!"
                subtitle="Giảm ngay 40.000đ — Săn vé nhanh ngay bây giờ"
                badge="ƯU ĐÃI"
              />

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
                events={allEventsPool.filter(e => checkCategory(e, 'COMEDY'))}
              />
              <EventSection
                title="Hội thảo & Workshop"
                events={allEventsPool.filter(e => checkCategory(e, 'WORKSHOP'))}
              />
              <EventSection
                title="Tham quan & Trải nghiệm"
                events={allEventsPool.filter(e => checkCategory(e, 'FESTIVAL'))}
              />

              <AdBanner
                variant="purple"
                title="Khám phá thế giới nghệ thuật — Triển lãm & Thể thao"
                subtitle="Sự kiện độc đáo, trải nghiệm khó quên"
                badge="MỚI"
              />

              <EventSection
                title="Triển lãm"
                events={allEventsPool.filter(e => checkCategory(e, 'EXHIBITION'))}
              />
              <EventSection
                title="Thể thao"
                events={allEventsPool.filter(e => checkCategory(e, 'SPORTS'))}
              />
              <EventSection
                title="Thể loại khác"
                events={allEventsPool.filter(e => checkCategory(e, 'OTHER'))}
              />

              <BrowseCities />
            </>
          ) : (
            <div style={{ padding: '32px 0', minHeight: '400px' }}>
              {loadingCategory ? (
                <div className="tb-loading" style={{ minHeight: '300px' }}>
                  <div className="tb-loading-spinner"></div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Đang tìm sự kiện {activeCategory}...
                  </p>
                </div>
              ) : categoryFilteredEvents.length > 0 ? (
                <EventSection title={`Sự kiện ${activeCategory}`} events={categoryFilteredEvents} />
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  minHeight: '300px',
                  color: 'var(--text-muted)',
                  fontSize: '14px'
                }}>
                  <div style={{ fontSize: '48px' }}>🎫</div>
                  <p>Hiện chưa có sự kiện nào thuộc thể loại <strong style={{ color: 'var(--brand-green)' }}>{activeCategory}</strong>.</p>
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