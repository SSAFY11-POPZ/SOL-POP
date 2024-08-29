import React from 'react';

const EventDetails = ({ event }) => {
  const baseURL = 'https://solpop.xyz';
  
  const handleDetailClick = () => {
    window.location.href = `${baseURL}/detail/${event.storeId}`;
  };

  return (
    <div
      className="relative bg-cover bg-center p-5 rounded-lg mt-5 text-white max-w-lg"
      style={{ backgroundImage: `url(${event.storeThumbnailUrl})` }}
    >
      <div className="bg-black bg-opacity-60 p-5 rounded-lg">
        <h3 className="mt-0 text-2xl font-semibold">{event.storeName}</h3>
        <p className="mt-2 text-base">
          {`${new Date(event.storeStartDate).toLocaleDateString()} ~ ${new Date(event.storeEndDate).toLocaleDateString()}`}
        </p>
        <p className="mt-2 text-base">{event.storeDetail}</p>
        <p className="mt-2 text-base">위치: {event.storePlace}</p>
        <p className="mt-2 text-base">키워드: {event.storeKeyword}</p>
        <p className="mt-2 text-base">입장료: {event.storePrice}원</p>
        <p className="mt-2 text-base">수용인원: {event.storeCapacity}명</p>
        <p className="mt-2 text-base">
          예약 가능 여부: {event.storeRsvPriority ? '가능' : '불가능'}
        </p>
        <p className="mt-4 text-blue-400">{event.hashtag}</p>
        <button 
          onClick={handleDetailClick} 
          className="mt-4 text-blue-400 hover:text-blue-600 underline cursor-pointer"
        >
          상세보기
        </button>
      </div>
    </div>
  );
};

export default React.memo(EventDetails);
