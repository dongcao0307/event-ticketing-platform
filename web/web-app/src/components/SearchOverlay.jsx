import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const trendingSearch = [
  "gai home concert",
  "hoàng dũng",
  "idecaf",
  "super junior"
];

const categories = [
  {
    name: "Nhạc sống",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    queryPath: "category=nhac_song"
  },
  {
    name: "Sân khấu & Nghệ thuật",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35",
    queryPath: "category=san_khau"
  },
  {
    name: "Thể thao",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    queryPath: "category=the_thao"
  },
  {
    name: "Hội thảo & Workshop",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    queryPath: "category=hoi_thao"
  }
];

const cities = [
  {
    name: "Tp. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1583416750470-965b2707b355",
    queryPath: "city=ho_chi_minh"
  },
  {
    name: "Hà Nội",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1",
    queryPath: "city=ha_noi"
  },
  {
    name: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1604908177522-402aa29d4c20",
    queryPath: "city=da_lat"
  },
  {
    name: "Vị trí khác",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  }
];

export default function SearchOverlay({ onSelectSuggestion, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("category");

  return (
    <div
      className="tb-search-overlay"
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        padding: '20px',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 200,
      }}
    >
      {/* Trending searches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
          Xu hướng tìm kiếm
        </p>
        {trendingSearch.map((item) => (
          <button
            key={item}
            onClick={() => onSelectSuggestion(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'left',
              padding: '2px 0',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-green)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ↗ {item}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
        {['category', 'city'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              paddingBottom: '8px',
              fontSize: '13px',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--brand-green)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--brand-green)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'category' ? 'Khám phá theo Thể loại' : 'Khám phá theo Thành phố'}
          </button>
        ))}
      </div>

      {/* Category grid */}
      {activeTab === 'category' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => { onClose(); navigate(`/search?${cat.queryPath}`); }}
              style={{
                position: 'relative',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <img src={cat.image} alt={cat.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
              <span style={{ position: 'absolute', bottom: '8px', left: '10px', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* City grid */}
      {activeTab === 'city' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => { onClose(); navigate(`/search?${city.queryPath}`); }}
              style={{
                position: 'relative',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <img src={city.image} alt={city.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
              <span style={{ position: 'absolute', bottom: '8px', left: '10px', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                {city.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Info note */}
      <div style={{
        marginTop: '16px',
        borderRadius: '10px',
        border: '1px dashed var(--border-medium)',
        background: 'var(--bg-elevated)',
        padding: '14px 18px',
        textAlign: 'center',
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)', fontSize: '13px' }}>Gợi ý từ database</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Phần gợi ý này chỉ hiển thị dữ liệu thật từ API khi có sự kiện được publish.
        </p>
      </div>

    </div>

  );

}