import React from 'react';
import './EventList.css';
import { subDays, addDays, format } from 'date-fns';

// 더미 데이터를 생성하는 함수
const getDummyEvent = (date) => {
  const startDate = subDays(date, 1);
  const endDate = addDays(date, 1);
  return {
    date: `${format(startDate, 'yyyy년 MM월 dd일')} ~ ${format(endDate, 'yyyy년 MM월 dd일')}`,
    title: '삼성강남x허쉬',
    image: 'src/pages/Calendar/img/1.JPG',
    description: '허쉬 페비닐로 액세서리로 만들어 보는 리사이클링 체험을 할 수 있다. 경품 증정 SNS 이벤트...',
  };
};

const EventList = ({ events, error, onEventClick, selectedDate }) => {
  // 데이터가 없을 때 더미 데이터를 사용합니다.
  const displayedEvents = error || events.length === 0 ? [getDummyEvent(selectedDate)] : events;

  return (
    <div className="events">
      {error ? (
        <p>데이터를 불러올 수 없습니다. 더미 데이터를 표시합니다.</p>
      ) : null}
      {displayedEvents.map((event, index) => (
        <div 
          key={index} 
          className="event-item" 
          onClick={() => onEventClick(event)} // 클릭 이벤트 처리
        >
          <img src={event.image} alt={event.title} className="event-image" />
          <div className="event-details">
            <h4>{event.title}</h4>
            <p>{event.date}</p>
            <p>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
