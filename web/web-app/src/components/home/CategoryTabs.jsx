import React from 'react';

const categories = [
  {
    label: 'Tất cả',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=120&q=60',
  },
  {
    label: 'Nhạc sống',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=60',
  },
  {
    label: 'Sân khấu & Nghệ thuật',
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=120&q=60',
  },
  {
    label: 'Hài kịch',
    image: 'https://media.istockphoto.com/vectors/drama-icon-on-transparent-background-vector-id1283590527?k=20&m=1283590527&s=612x612&w=0&h=tdk7BIy5kaVAhxITO2N8Dmiz9E5NHDSb-lb1KNTLdio=',
  },
  {
    label: 'Thể thao',
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=120&q=60',
  },
  {
    label: 'Hội thảo & Workshop',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=120&q=60',
  },
  {
    label: 'Tham quan & Trải nghiệm',
    image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=120&q=60',
  },
  {
    label: 'Triển lãm',
    image: 'https://th.bing.com/th/id/R.804f93319f0692d7413d314e304cc453?rik=ZZ2%2bP0qBGXX69A&riu=http%3a%2f%2foshshow.vn%2fupload%2ffiles%2fchung%2f5fb7409b4575f22bab64_7852_458.jpg&ehk=VMt0IR%2f6BAbmdN1Qd1DsNAQasEN5NT8tRvz90wu0enU%3d&risl=&pid=ImgRaw&r=0',
  },
  {
    label: 'Khác',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=120&q=60',
  },
];

const CategoryTabs = ({ activeCategory, onSelect }) => {
  return (
    <div
      className="hide-scrollbar"
      style={{ overflowX: 'auto', padding: '12px 0' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',    /* circles all line up at top */
          justifyContent: 'space-evenly', /* spread perfectly across bar */
          padding: '0 16px',
          minWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => onSelect(cat.label)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '6px 6px 10px',
                borderRadius: '12px',
                transition: 'background 0.2s',
                /* flex:1 so each item takes equal width */
                flex: '1 1 0',
                minWidth: 0,
                maxWidth: '120px',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Circle image — same size for every item */}
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: isActive ? '3px solid #26bc71' : '2px solid rgba(255,255,255,0.12)',
                boxShadow: isActive ? '0 0 18px rgba(38,188,113,0.55)' : 'none',
                transition: 'all 0.25s ease',
              }}>
                <img
                  src={cat.image}
                  alt={cat.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Label — fixed 30px height box so circles never shift up/down */}
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: isActive ? '#26bc71' : '#9ca3af',
                textAlign: 'center',
                lineHeight: '1.4',
                height: '34px',         /* fixed height = 2 lines exactly */
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                width: '100%',
                wordBreak: 'break-word',
                transition: 'color 0.2s',
              }}>
                {cat.emoji} {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;