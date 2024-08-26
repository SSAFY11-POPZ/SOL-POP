import React from 'react';

const EventDetails = ({ event }) => {
  return (
    <div
      className="relative bg-cover bg-center p-5 rounded-lg mt-5 text-white max-w-lg"
      style={{ backgroundImage: `url(${event.image})` }}
    >
      <div className="bg-black bg-opacity-60 p-5 rounded-lg">
        <h3 className="mt-0 text-2xl font-semibold">{event.title}</h3>
        <p className="mt-2 text-base">{event.date}</p>
        <p className="mt-2 text-base">{event.description}</p>
      </div>
    </div>
  );
};

export default React.memo(EventDetails);
