import React from 'react';

const categories = [
  { label: 'Tất cả', color: 'from-[#00b14f] to-[#007d36]', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=60' },
  { label: 'Nhạc sống', color: 'from-[#7f45ff] to-[#3c55ff]', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=60' },
  { label: 'Sân khấu & Nghệ thuật', color: 'from-[#ff4d5a] to-[#ffb347]', image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=60' },
  { label: 'Hài kịch', color: 'from-[#ec4899] to-[#f43f5e]', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=800&q=60' },
  { label: 'Thể thao', color: 'from-[#26bc71] to-[#1b9b4a]', image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=60' },
  { label: 'Hội thảo & Workshop', color: 'from-[#2093ff] to-[#1d65ff]', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60' },
  { label: 'Tham quan & Trải nghiệm', color: 'from-[#ff7a00] to-[#ff2d2d]', image: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=60' },
  { label: 'Triển lãm', color: 'from-[#06b6d4] to-[#3b82f6]', image: 'https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&w=800&q=60' },
  { label: 'Khác', color: 'from-[#6b7280] to-[#4b5563]', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=60' },
];

const CategoryTabs = ({ activeCategory, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto py-4 hide-scrollbar">
      <div className="flex items-center gap-3 px-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => onSelect(cat.label)}
              className={`relative min-w-[170px] flex items-center gap-3 rounded-2xl p-3 shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none ${
                isActive ? 'ring-2 ring-[#26bc71] shadow-lg' : 'bg-white'
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-inner`}
              >
                <img src={cat.image} alt={cat.label} className="h-10 w-10 rounded-lg object-cover" />
              </div>
              <span className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                {cat.label}
              </span>
              {isActive && (
                <span className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#26bc71] text-[10px] text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;