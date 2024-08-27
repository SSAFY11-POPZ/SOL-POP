import React, { useState, useEffect } from 'react';
import CalendarCarousel from './components/CalendarCarousel';
import EventList from './components/EventList';
import { addDays, subDays, startOfWeek, format } from 'date-fns';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  
  const baseURL = 'https://solpop.xyz'
  //const baseURL = 'http://localhost:5173'; // baseURL을 별도의 변수로 관리
  const navbarHeight = 70; // 네브바의 높이를 픽셀 단위로 설정

  // 서버에서 이벤트를 가져오는 함수
  const fetchEvents = async (date) => {
    const dateString = format(date, 'yyyy-MM-dd'); // 날짜를 'YYYY-MM-DD' 형식으로 변환
    try {
      const response = await fetch(`${baseURL}/api/v1/store/calendar?date=${dateString}`); // API 요청
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
    if (isSameWeek(selectedDate, newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    if (isSameWeek(selectedDate, newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchEvents(date); // 요일 클릭 시 서버에 GET 요청
    setSelectedEventIndex(null);
  };

  const handleEventClick = (index) => {
    setSelectedEventIndex(prevIndex => (prevIndex === index ? null : index));
  };

  // 페이지 입장 시 오늘 날짜로 서버에 GET 요청
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
          onDateClick={handleDateClick} // 요일 클릭 시 서버에 GET 요청
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
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

const isSameWeek = (date1, date2) => {
  const startOfWeekDate1 = startOfWeek(date1);
  const startOfWeekDate2 = startOfWeek(date2);
  return startOfWeekDate1.getTime() === startOfWeekDate2.getTime();
};

export default React.memo(CalendarPage);
