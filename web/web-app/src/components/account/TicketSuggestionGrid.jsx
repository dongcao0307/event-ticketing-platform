import React from "react";
import EventCard from "../home/EventCard";

const TicketSuggestionGrid = ({events}) => {
  return (
    <div className="mt-10">

      <h3 className="text-lg font-semibold mb-4">
        Có thể bạn cũng thích
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}

      </div>

    </div>
  );
};

export default TicketSuggestionGrid;