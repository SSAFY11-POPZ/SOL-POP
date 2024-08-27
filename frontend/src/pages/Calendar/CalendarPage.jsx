import React, { useState, useEffect } from 'react';
import CalendarCarousel from './components/CalendarCarousel';
import EventList from './components/EventList';
import { addDays, subDays, startOfWeek, format } from 'date-fns';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [middleDay, setMiddleDay] = useState(addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), 3)); // 현재 주간의 수요일
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  
  const baseURL = 'https://solpop.xyz';
  const navbarHeight = 70;

  const fetchEvents = async (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`${baseURL}/api/v1/store/calendar?date=${dateString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events || []);
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
    setMiddleDay(addDays(startOfWeek(newDate, { weekStartsOn: 0 }), 3)); // 주간 이동 시 middleDay 업데이트
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    setMiddleDay(addDays(startOfWeek(newDate, { weekStartsOn: 0 }), 3)); // 주간 이동 시 middleDay 업데이트
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setMiddleDay(date); // 클릭한 날짜로 middleDay 설정
    fetchEvents(date); // 요일 클릭 시 서버에 GET 요청
    setSelectedEventIndex(null);
  };

  const handleEventClick = (index) => {
    setSelectedEventIndex(prevIndex => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  return (
    <div 
      className="calendar-container"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: `${navbarHeight}px`, // 네브바 높이만큼 아래 패딩 추가
        minHeight: `calc(100vh - ${navbarHeight}px)`, // 네브바를 뺀 전체 높이
        overflowY: 'auto' // 스크롤 가능하게 설정
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px', padding: '0 10px' }}>
        <CalendarCarousel
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          middleDay={middleDay} // middleDay 전달
        />
        <div style={{ marginTop: '20px' }}>
          <EventList 
            events={events} 
            error={error} 
            onEventClick={handleEventClick} 
            selectedDate={selectedDate}
            selectedEventIndex={selectedEventIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(CalendarPage);
