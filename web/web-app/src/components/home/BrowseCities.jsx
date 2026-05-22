import React from 'react';

const cities = [
  {
    label: 'Tp. Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=70',
  },
  {
    label: 'Hà Nội',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70',
  },
  {
    label: 'Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=70',
  },
  {
    label: 'Nha Trang',
    image: 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?auto=format&fit=crop&w=800&q=70',
  },
];

const BrowseCities = () => {
  return (
    <section className="tb-section">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 className="tb-section-title">📍 Địa điểm nổi bật</h2>
        <p style={{ marginTop: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Khám phá sự kiện theo thành phố
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
        }}
      >
        {cities.map((city) => (
          <div key={city.label} className="tb-city-card">
            <img src={city.image} alt={city.label} />
            <div className="tb-city-overlay" />
            <span className="tb-city-name">{city.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrowseCities;
