import React, { useState, useEffect } from 'react';
import './CalendarPage.css';
import CalendarCarousel from './components/CalendarCarousel';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import { format, addDays, subDays } from 'date-fns';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async (date) => {
    const dateString = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`https://your-api-server.com/events?date=${dateString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events);
      setError(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setEvents([]);
      setError(true);
    }
  };

  const handlePrevWeek = () => {
    const newDate = subDays(currentDate, 7);
    setCurrentDate(newDate);
    if (isSameWeek(selectedDate, newDate)) {
      setSelectedDate(newDate);  // 현재 선택된 날짜가 같은 주에 있으면 업데이트
    }
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    if (isSameWeek(selectedDate, newDate)) {
      setSelectedDate(newDate);  // 현재 선택된 날짜가 같은 주에 있으면 업데이트
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchEvents(date);
    setSelectedEvent(null); // 날짜 클릭 시 이벤트 선택 해제
  };

  const handleEventClick = (event) => {
    if (selectedEvent && selectedEvent.title === event.title) {
      setSelectedEvent(null); // 같은 이벤트를 클릭하면 해제
    } else {
      setSelectedEvent(event); // 새로운 이벤트를 클릭하면 선택
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  return (
    <div className="calendar">
      <CalendarCarousel
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />
      <EventList 
        events={events} 
        error={error} 
        onEventClick={handleEventClick} 
        selectedDate={selectedDate}
      />
      {selectedEvent && <EventDetails event={selectedEvent} />} {/* 이벤트가 선택된 경우에만 표시 */}
    </div>
  );
};

// Helper function to check if two dates are in the same week
const isSameWeek = (date1, date2) => {
  const startOfWeekDate1 = startOfWeek(date1);
  const startOfWeekDate2 = startOfWeek(date2);
  return startOfWeekDate1.getTime() === startOfWeekDate2.getTime();
};

export default CalendarPage;
