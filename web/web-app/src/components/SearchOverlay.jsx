import React, { useState } from "react";

const trendingSearch = [
  "gai home concert",
  "hoàng dũng",
  "idecaf",
  "super junior"
];

const categories = [
  {
    name: "Nhạc sống",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
  },
  {
    name: "Sân khấu & Nghệ thuật",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35"
  },
  {
    name: "Thể thao",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b"
  },
  {
    name: "Hội thảo & Workshop",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df"
  }
];

const cities = [
  {
    name: "Tp. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1583416750470-965b2707b355"
  },
  {
    name: "Hà Nội",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1"
  },
  {
    name: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1604908177522-402aa29d4c20"
  },
  {
    name: "Vị trí khác",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  }
];

export default function SearchOverlay({ onSelectSuggestion }) {

  const [activeTab, setActiveTab] = useState("category");

  return (

    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-100 rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto z-50">

      {/* Trending */}
      <div className="space-y-3">

        {trendingSearch.map((item) => (
          <button
            key={item}
            onClick={() => onSelectSuggestion(item)}
            className="flex items-center gap-2 text-gray-600 hover:text-black text-sm"
          >
            ↗ {item}
          </button>
        ))}

      </div>


      {/* Tabs */}
      <div className="flex gap-6 border-b mt-6">

        <button
          onClick={() => setActiveTab("category")}
          className={`pb-2 text-sm font-medium
            ${activeTab === "category"
              ? "border-b-2 border-green-500 text-black"
              : "text-gray-500"
            }`}
        >
          Khám phá theo Thể loại
        </button>

        <button
          onClick={() => setActiveTab("city")}
          className={`pb-2 text-sm font-medium
            ${activeTab === "city"
              ? "border-b-2 border-green-500 text-black"
              : "text-gray-500"
            }`}
        >
          Khám phá theo Thành phố
        </button>

      </div>


      {/* Category */}
      {activeTab === "category" && (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

          {categories.map((cat) => (

            <button
              key={cat.name}
              onClick={() => onSelectSuggestion(cat.name)}
              className="relative h-24 rounded-xl overflow-hidden group"
            >

              <img
                src={cat.image}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition"
              />

              <div className="absolute inset-0 bg-black/30" />

              <span className="absolute bottom-2 left-3 text-white text-sm font-medium">
                {cat.name}
              </span>

            </button>

          ))}

        </div>

      )}


      {/* Cities */}
      {activeTab === "city" && (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

          {cities.map((city) => (

            <button
              key={city.name}
              onClick={() => onSelectSuggestion(city.name)}
              className="relative h-24 rounded-xl overflow-hidden group"
            >

              <img
                src={city.image}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition"
              />

              <div className="absolute inset-0 bg-black/30" />

              <span className="absolute bottom-2 left-3 text-white text-sm font-medium">
                {city.name}
              </span>

            </button>

          ))}

        </div>

      )}


      {/* Recommended */}
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white/60 p-5 text-center text-gray-500">
        <h3 className="font-semibold mb-2 text-gray-800">Gợi ý từ database</h3>
        <p className="text-sm">Phần gợi ý này chỉ hiển thị dữ liệu thật từ API khi có sự kiện được publish.</p>
      </div>

    </div>

  );

}