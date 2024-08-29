import React from 'react';

const EventDetails = ({ event }) => {
  const baseURL = 'https://solpop.xyz';
  
  const handleDetailClick = () => {
    window.location.href = `${baseURL}/detail/${event.storeId}`;
  };
  const renderStoreDetail = (detail) => {
    return detail.split('<br>').map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };

  return (
    <div
      className="max-w-lg mt-5 text-white bg-center bg-cover rounded-lg"
      style={{ backgroundImage: `url(${event.storeThumbnailUrl})` }}
    >
      <div className="p-5 bg-black rounded-lg bg-opacity-60">
        <h3 className="mt-0 text-2xl font-semibold">{event.storeName}</h3>
        <p className="mt-2 text-base">
          {`${new Date(event.storeStartDate).toLocaleDateString()} ~ ${new Date(event.storeEndDate).toLocaleDateString()}`}
        </p>
        <p className="mt-2 text-base">{renderStoreDetail(event.storeDetail)}</p>
        <p className="mt-2 text-base">위치: {event.storePlace}</p>
        <p className="mt-2 text-base">
          예약 가능 여부: {event.storeRsvPriority ? '가능' : '불가능'}
        </p>
        <p className="mt-4 text-blue-400">{event.hashtag}</p>
        <button 
          onClick={handleDetailClick} 
          className="mt-4 text-blue-400 underline cursor-pointer hover:text-blue-600"
        >
          상세보기
        </button>
      </div>
    </div>
  );
};



export default React.memo(EventDetails);
