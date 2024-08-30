import React, { useState } from 'react';
import EventDetails from './EventDetails';

const EventList = ({ events, error, selectedDate, onEventClick }) => {
  const [openEvents, setOpenEvents] = useState([]);

  const handleEventClick = (event, index) => {
    if (openEvents.includes(index)) {
      setOpenEvents(openEvents.filter((i) => i !== index)); // 이미 열린 이벤트를 클릭하면 닫기
    } else {
      setOpenEvents([...openEvents, index]); // 새로운 이벤트를 클릭하면 열기
    }
    onEventClick(event); // 클릭된 이벤트를 부모 컴포넌트로 전달
  };

  return (
    <div className="space-y-4 events">
      {error && (
        <p className="text-red-500">데이터를 불러올 수 없습니다.</p>
      )}
      {events.map((event, index) => (
        <React.Fragment key={event.storeId}>
          <div
            className={`event-item flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 transition ${
              openEvents.includes(index) ? 'border border-blue-500' : ''
            }`}
            onClick={() => handleEventClick(event, index)} // 클릭 이벤트 처리
          >
            <img
              src={event.storeThumbnailUrl}
              alt={event.storeName}
              className="object-cover w-24 h-24 rounded-lg event-image"
            />
            <div className="event-summary">
              <h4 className="text-lg font-semibold text-gray-800">{event.storeName}</h4>
              <p className="text-sm text-gray-600">
                {`${new Date(event.storeStartDate).toLocaleDateString()} ~ ${new Date(event.storeEndDate).toLocaleDateString()}`}
              </p>
              <p className="text-sm text-gray-600">위치: {event.storePlace}</p>
              <p className="mt-2 text-sm text-blue-500">{event.hashtag}</p>
            </div>
          </div>
          {openEvents.includes(index) && (
            <div className="">
              <EventDetails event={event} /> {/* 클릭된 이벤트의 세부 정보만 표시 */}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(EventList);
