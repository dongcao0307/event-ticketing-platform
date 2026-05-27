import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/home/EventCard';
import {
  getFeaturedEvents,
  getTrendingEvents,
  getRecommendedEvents,
  getLatestEvents,
  getEventsByCategory
} from '../services/eventService';

const CATEGORY_MAP = {
  'Nhạc sống': 'MUSIC',
  'Sân khấu & Nghệ thuật': 'THEATER',
  'Thể thao': 'SPORTS',
  'Hội thảo & Workshop': 'WORKSHOP',
  'Tham quan & Trải nghiệm': 'FESTIVAL',
  'Hài kịch': 'COMEDY',
  'Triển lãm': 'EXHIBITION',
  'Khác': 'OTHER',
  'Thể loại khác': 'OTHER',
  
  // English mapping fallback
  'music': 'MUSIC',
  'theater': 'THEATER',
  'sports': 'SPORTS',
  'workshop': 'WORKSHOP',
  'festival': 'FESTIVAL',
  'comedy': 'COMEDY',
  'exhibition': 'EXHIBITION',
  'other': 'OTHER'
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';

  useEffect(() => {
    // 1. Scroll window to top when category changes
    window.scrollTo(0, 0);
    
    // 2. Fetch category events dynamically
    const fetchCategoryEvents = async () => {
      setLoading(true);
      try {
        let fetchedEvents = [];
        const onlyPublished = (list) => (list || []).filter((e) => e?.status === 'PUBLISHED');

        if (decodedCategory === 'Sự kiện đặc biệt') {
          const res = await getFeaturedEvents();
          fetchedEvents = onlyPublished(res);
        } else if (decodedCategory === 'Sự kiện xu hướng') {
          const res = await getTrendingEvents();
          fetchedEvents = onlyPublished(res);
        } else if (decodedCategory === 'Sự kiện mới nhất') {
          const res = await getLatestEvents();
          fetchedEvents = onlyPublished(res);
        } else {
          // Check standard category mappings
          const normalizedKey = decodedCategory.trim().toLowerCase();
          let enumValue = null;
          
          for (const [key, val] of Object.entries(CATEGORY_MAP)) {
            if (key.toLowerCase() === normalizedKey) {
              enumValue = val;
              break;
            }
          }

          if (enumValue) {
            const res = await getEventsByCategory(enumValue);
            fetchedEvents = onlyPublished(res);
          } else {
            fetchedEvents = [];
          }
        }
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Lỗi khi tải sự kiện theo danh mục:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEvents();
  }, [categoryName, decodedCategory]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '32px 16px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '13px', 
          color: 'var(--text-secondary)', 
          marginBottom: '24px',
          fontWeight: 500
        }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-green)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            Trang chủ
          </Link>
          <span>/</span>
          <span>Danh mục</span>
          <span>/</span>
          <span style={{ color: 'var(--brand-green)', fontWeight: 600 }}>{decodedCategory}</span>
        </div>

        {/* Content Box */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          borderRadius: '16px', 
          border: '1px solid var(--border-subtle)', 
          padding: '24px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)' 
        }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Sự kiện: {decodedCategory}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
              {loading ? 'Đang tải...' : `${events.length} sự kiện hoạt động`}
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <div className="tb-loading-spinner" />
            </div>
          ) : events.length === 0 ? (
            <div className="tb-empty-state">
              <div style={{ fontSize: '48px' }}>🎫</div>
              <p className="tb-empty-state-title">Không tìm thấy sự kiện nào</p>
              <p className="tb-empty-state-desc">
                Hiện chưa có sự kiện nào hoạt động thuộc danh mục <strong>{decodedCategory}</strong>. Vui lòng quay lại sau!
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '20px',
              justifyItems: 'center' 
            }}>
              {events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
