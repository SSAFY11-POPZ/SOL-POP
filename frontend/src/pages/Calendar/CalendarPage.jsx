import React, { useState, useEffect } from 'react';
import CalendarCarousel from './components/CalendarCarousel';
import EventList from './components/EventList';
import { addDays, subDays, startOfWeek, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [middleDay, setMiddleDay] = useState(
    addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), 3),
  );
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const baseURL = 'https://solpop.xyz';
  const navbarHeight = 70;

  const fetchEvents = async (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(
        `${baseURL}/api/v1/store/calendar?date=${dateString}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data || []);
      setError(false);
      if (data && data.length > 0) {
        setSelectedEvent(data[0]); // 첫 번째 이벤트를 기본 선택으로 설정
      } else {
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setEvents([]);
      setError(true);
      setSelectedEvent(null);
    }
  };

  const handlePrevWeek = () => {
    const newDate = subDays(currentDate, 7);
    setCurrentDate(newDate);
    setMiddleDay(addDays(startOfWeek(newDate, { weekStartsOn: 0 }), 3));
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    setMiddleDay(addDays(startOfWeek(newDate, { weekStartsOn: 0 }), 3));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setMiddleDay(date);
    fetchEvents(date); // 클릭한 날짜의 이벤트를 로드
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // 클릭된 이벤트를 선택
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate); // 컴포넌트 로드 시 현재 날짜의 이벤트를 로드
  }, []);

  return (
    <div
      className="calendar-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: `${navbarHeight}px`,
        minHeight: `calc(100vh - ${navbarHeight}px)`,
        overflowY: 'auto',
      }}
    >
      <div className="mx-auto max-w-lg p-4">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center rounded-lg text-2xl text-black"
            style={{
              zIndex: 10,
              backgroundColor: 'transparent',
              width: '50px',
              height: '50px',
              marginLeft: '-10px',
            }}
          >
            &lt;
          </button>
        </div>

        <CalendarCarousel
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          middleDay={middleDay}
        />
        <div style={{ marginTop: '20px' }}>
          <EventList
            events={events}
            error={error}
            onEventClick={handleEventClick}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CalendarPage);
