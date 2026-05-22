import React from 'react';

const AdBanner = ({ variant = 'green', title, subtitle, badge }) => {
  const variantClass = {
    green: 'tb-ad-green',
    orange: 'tb-ad-orange',
    purple: 'tb-ad-purple',
  }[variant] || 'tb-ad-green';

  const bgDecoration = {
    green: (
      <svg className="ad-decoration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="160" cy="40" r="80" fill="rgba(255,255,255,0.07)" />
        <circle cx="30" cy="140" r="50" fill="rgba(255,255,255,0.05)" />
      </svg>
    ),
    orange: (
      <svg className="ad-decoration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="170" cy="30" r="90" fill="rgba(255,255,255,0.06)" />
        <circle cx="20" cy="150" r="60" fill="rgba(255,255,255,0.04)" />
      </svg>
    ),
    purple: (
      <svg className="ad-decoration" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="150" cy="50" r="100" fill="rgba(255,255,255,0.06)" />
        <circle cx="10" cy="130" r="60" fill="rgba(255,255,255,0.04)" />
      </svg>
    ),
  }[variant];

  return (
    <div className="tb-ad-banner">
      <div className={`tb-ad-inner ${variantClass}`} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {bgDecoration}
        </div>

        {/* Left text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="tb-ad-title">{title}</div>
          {subtitle && <div className="tb-ad-subtitle">{subtitle}</div>}
        </div>

        {/* Right badge */}
        {badge && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="tb-ad-badge">{badge}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
