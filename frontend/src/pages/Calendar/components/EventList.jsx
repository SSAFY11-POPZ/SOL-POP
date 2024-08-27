import React, { useState } from 'react';
import EventDetails from './EventDetails';
import { subDays, addDays, format } from 'date-fns';

// 더미 데이터를 생성하는 함수
const getDummyEvents = (date) => [
  {
    storeId: 1,
    storeName: '더미 슈즈 스토어 1',
    storeStartDate: format(subDays(date, 1), 'yyyy-MM-dd'),
    storeEndDate: format(addDays(date, 1), 'yyyy-MM-dd'),
    storePlace: '서울',
    storeDetail: '더미 이벤트 1 상세 설명입니다.',
    storeKeyword: 'shoes',
    storeRsvPriority: true,
    storeCapacity: 100,
    storeThumbnailUrl: 'src/pages/Calendar/img/1.JPG',
    storePrice: 1000,
    hashtag: '#cool',
  },
  {
    storeId: 2,
    storeName: '더미 의류 스토어 2',
    storeStartDate: format(subDays(date, 2), 'yyyy-MM-dd'),
    storeEndDate: format(addDays(date, 2), 'yyyy-MM-dd'),
    storePlace: '부산',
    storeDetail: '더미 이벤트 2 상세 설명입니다.',
    storeKeyword: 'clothes',
    storeRsvPriority: false,
    storeCapacity: 150,
    storeThumbnailUrl: 'src/pages/Calendar/img/1.JPG',
    storePrice: 1500,
    hashtag: '#trendy',
  },
  {
    storeId: 3,
    storeName: '더미 가방 스토어 3',
    storeStartDate: format(subDays(date, 3), 'yyyy-MM-dd'),
    storeEndDate: format(addDays(date, 3), 'yyyy-MM-dd'),
    storePlace: '대구',
    storeDetail: '더미 이벤트 3 상세 설명입니다.',
    storeKeyword: 'bags',
    storeRsvPriority: true,
    storeCapacity: 200,
    storeThumbnailUrl: 'src/pages/Calendar/img/1.JPG',
    storePrice: 2000,
    hashtag: '#luxury',
  },
];

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

  // 데이터가 없을 때 더미 데이터를 사용합니다.
  const displayedEvents = error || events.length === 0 ? getDummyEvents(selectedDate) : events;

  return (
    <div className="events space-y-4">
      {error && (
        <p className="text-red-500">데이터를 불러올 수 없습니다. 더미 데이터를 표시합니다.</p>
      )}
      {displayedEvents.map((event, index) => (
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
              className="event-image w-24 h-24 object-cover rounded-lg"
            />
            <div className="event-summary">
              <h4 className="text-lg font-semibold text-gray-800">{event.storeName}</h4>
              <p className="text-sm text-gray-600">
                {`${new Date(event.storeStartDate).toLocaleDateString()} ~ ${new Date(event.storeEndDate).toLocaleDateString()}`}
              </p>
              <p className="text-sm text-gray-600">위치: {event.storePlace}</p>
              <p className="text-sm text-gray-600">
                {event.storeDetail.length > 25 
                  ? `${event.storeDetail.slice(0, 25)}...`
                  : event.storeDetail}
              </p>
              <p className="text-sm text-gray-600">입장료: {event.storePrice}원</p>
              <p className="text-sm text-blue-500 mt-2">{event.hashtag}</p>
            </div>
          </div>
          {openEvents.includes(index) && (
            <div className="pl-10">
              <EventDetails event={event} /> {/* 클릭된 이벤트의 세부 정보만 표시 */}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(EventList);
