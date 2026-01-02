import React from 'react';

function EventCard({ event, onClick }) {
  return (
    <div 
      className="event-card"
      onClick={() => onClick(event.id)}
    >
      <div>
        <h2>{event.name}</h2>
        <p>Date: {new Date(event.date).toLocaleString()}</p>
      </div>
      <button className="btn" onClick={(e) => { e.stopPropagation(); onClick(event.id); }}>View Details</button>
    </div>
  );
}

export default EventCard;

