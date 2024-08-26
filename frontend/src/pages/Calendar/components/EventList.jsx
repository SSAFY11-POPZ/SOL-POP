import React, { useState } from 'react';
import EventDetails from './EventDetails';
import { subDays, addDays, format } from 'date-fns';

// 더미 데이터를 생성하는 함수
const getDummyEvents = (date) => [
  {
    date: `${format(subDays(date, 1), 'yyyy년 MM월 dd일')} ~ ${format(addDays(date, 1), 'yyyy년 MM월 dd일')}`,
    title: '삼성강남x허쉬 이벤트 1',
    image: 'src/pages/Calendar/img/1.JPG',
    description: '허쉬 페비닐로 액세서리로 만들어 보는 리사이클링 체험을 할 수 있다. 경품 증정 SNS 이벤트 1...',
  },
  {
    date: `${format(subDays(date, 2), 'yyyy년 MM월 dd일')} ~ ${format(addDays(date, 2), 'yyyy년 MM월 dd일')}`,
    title: '삼성강남x허쉬 이벤트 2',
    image: 'src/pages/Calendar/img/1.JPG',
    description: '허쉬 페비닐로 액세서리로 만들어 보는 리사이클링 체험을 할 수 있다. 경품 증정 SNS 이벤트 2...',
  },
  {
    date: `${format(subDays(date, 3), 'yyyy년 MM월 dd일')} ~ ${format(addDays(date, 3), 'yyyy년 MM월 dd일')}`,
    title: '삼성강남x허쉬 이벤트 3',
    image: 'src/pages/Calendar/img/1.JPG',
    description: '허쉬 페비닐로 액세서리로 만들어 보는 리사이클링 체험을 할 수 있다. 경품 증정 SNS 이벤트 3...',
  },
];

const EventList = ({ events, error, onEventClick, selectedDate, selectedEventIndex }) => {
  const [openEvents, setOpenEvents] = useState([]);

  // 데이터가 없을 때 더미 데이터를 사용합니다.
  const displayedEvents = error || events.length === 0 ? getDummyEvents(selectedDate) : events;

  const handleEventClick = (index) => {
    if (openEvents.includes(index)) {
      setOpenEvents(openEvents.filter((i) => i !== index)); // 이미 열린 이벤트를 클릭하면 닫기
    } else {
      setOpenEvents([...openEvents, index]); // 새로운 이벤트를 클릭하면 열기
    }
    onEventClick(index); // 부모 컴포넌트에도 클릭 이벤트 전파
  };

  return (
    <div className="events space-y-4">
      {error && (
        <p className="text-red-500">데이터를 불러올 수 없습니다. 더미 데이터를 표시합니다.</p>
      )}
      {displayedEvents.map((event, index) => (
        <React.Fragment key={index}>
          <div
            className={`event-item flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 transition ${
              openEvents.includes(index) ? 'border border-blue-500' : ''
            }`}
            onClick={() => handleEventClick(index)} // 클릭 이벤트 처리
          >
            <img
              src={event.image}
              alt={event.title}
              className="event-image w-24 h-24 object-cover rounded-lg"
            />
            <div className="event-summary">
              <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.date}</p>
            </div>
          </div>
          {openEvents.includes(index) && (
            <EventDetails event={event} /> // 클릭된 이벤트의 세부 정보만 표시
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EventList;
