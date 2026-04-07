import React from 'react';

const cities = [
  { label: 'Tp. Hồ Chí Minh', image: 'https://images.unsplash.com/photo-1579547929518-9f236f6f66d0?auto=format&fit=crop&w=800&q=60' },
  { label: 'Hà Nội', image: 'https://images.unsplash.com/photo-1556847414-9a5d1bffb88a?auto=format&fit=crop&w=800&q=60' },
  { label: 'Đà Lạt', image: 'https://images.unsplash.com/photo-1506501978629-8aad7fb30b63?auto=format&fit=crop&w=800&q=60' },
  { label: 'Vị trí khác', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60' },
];

const BrowseCities = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Địa điểm thú vị</h2>
          <p className="mt-1 text-gray-600">Khám phá sự kiện theo thành phố</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cities.map((city) => (
          <div key={city.label} className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition">
            <img
              src={city.image}
              alt={city.label}
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute left-4 bottom-4">
              <h3 className="text-white text-lg font-semibold">{city.label}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrowseCities;
