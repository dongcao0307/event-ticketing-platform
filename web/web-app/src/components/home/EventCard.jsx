import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ id, title, date, location, price, image, badge }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) navigate(`/event/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-[260px] min-w-[260px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="relative h-40 bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {badge && (
          <div className="absolute left-3 top-3 rounded-full bg-[#26bc71] px-3 py-1 text-xs font-semibold text-white shadow">
            {badge}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        <div className="mt-3 space-y-2 text-sm text-gray-600">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="truncate">{date}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {price && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-[#26bc71]">{price}</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              className="rounded-full bg-[#26bc71] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1fa86a] transition"
            >
              Mua vé
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
