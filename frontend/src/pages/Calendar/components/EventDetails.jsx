// EventDetails.jsx
import React from 'react';
import './EventDetails.css';

const EventDetails = ({ event }) => {
  return (
    <div className="event-details-container" style={{ backgroundImage: `url(${event.image})` }}>
      <div className="event-details-content">
        <h3>{event.title}</h3>
        <p>{event.date}</p>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

export default EventDetails;
