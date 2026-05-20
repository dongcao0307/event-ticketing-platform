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

const mockEvents = [
  {
    title: "Trải nghiệm bay dù lượn tại Sapa",
    price: "Từ 2.190.000đ",
    date: "28 tháng 01, 2026",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    title: "SOAP HANDMADE WORKSHOP",
    price: "Từ 279.000đ",
    date: "14 tháng 03, 2026",
    image: "https://images.unsplash.com/photo-1604908177522-402aa29d4c20"
  },
  {
    title: "Nhà Hát Kịch IDECAF",
    price: "Từ 300.000đ",
    date: "14 tháng 03, 2026",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35"
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
      <div className="mt-8">

        <h3 className="font-semibold mb-4 text-gray-800">
          Gợi ý dành cho bạn
        </h3>

        <div className="grid md:grid-cols-3 gap-5">

          {mockEvents.map((event, i) => (

            <div key={i} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">

              <img
                src={event.image}
                className="h-36 w-full object-cover"
              />

              <div className="p-3">

                <h4 className="text-sm font-medium text-gray-800">
                  {event.title}
                </h4>

                <p className="text-green-600 text-sm mt-1">
                  {event.price}
                </p>

                <p className="text-gray-500 text-xs">
                  {event.date}
                </p>

              </div>

            </div>

          ))}

        </div>

        <div className="flex justify-center mt-6">

          <button className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-full transition shadow-lg">
            Xem thêm sự kiện
          </button>

        </div>

      </div>

    </div>

  );

}