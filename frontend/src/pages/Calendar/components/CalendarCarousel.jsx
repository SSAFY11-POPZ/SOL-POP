import React from 'react';
import { format, addDays, startOfWeek, isSameMonth, isSameDay } from 'date-fns';
import './CalendarCarousel.css';

const CalendarCarousel = ({ currentDate, selectedDate, onDateClick, onPrevWeek, onNextWeek }) => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="calendar-carousel">
      <div className="header">
        <button onClick={onPrevWeek}>{"<"}</button>
        <h2>{format(selectedDate, 'MMMM yyyy')}</h2>
        <button onClick={onNextWeek}>{">"}</button>
      </div>
      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="days">
        {days.map((day, index) => (
          <button
            key={index}
            className={`day ${isSameMonth(day, currentDate) ? '' : 'faded'} ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
            onClick={() => onDateClick(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarCarousel;
