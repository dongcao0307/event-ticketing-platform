import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ id, title, date, location, price, image, badge }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) navigate(`/event/${id}`);
  };

  return (
    <div onClick={handleClick} className="tb-event-card">
      {/* Image */}
      <div className="tb-event-img-wrapper">
        <img
          src={image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=70'}
          alt={title}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=70';
          }}
        />
        {badge && <span className="tb-event-badge">{badge}</span>}
      </div>

      {/* Body */}
      <div className="tb-event-body">
        <h3 className="tb-event-title">{title}</h3>

        <div className="tb-event-meta">
          {date && (
            <div className="tb-event-meta-item">
              <Calendar size={12} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{date}</span>
            </div>
          )}
          {location && (
            <div className="tb-event-meta-item">
              <MapPin size={12} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
            </div>
          )}
        </div>

        {price && (
          <div className="tb-event-footer">
            <span className="tb-event-price">{price}</span>
            <button
              className="tb-buy-btn"
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
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
