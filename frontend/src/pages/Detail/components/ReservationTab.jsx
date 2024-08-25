import React, { useState } from 'react';
import ReservationModal from './ReservationModal';

const ReservationTab = ({ reservationTimes, storeId, storeName, storeThumbnailUrl }) => {
  const [showModal, setShowModal] = useState(false);

  const handleReservationClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="reservation-tab mt-4">
      날짜와 시간을 선택해주세요.
      <div
        onClick={handleReservationClick}
        className="flex items-center p-4 bg-white shadow-md rounded-lg cursor-pointer border border-gray-300"
      >
        <div className="flex-grow text-left">
          <h3 className="text-lg font-bold">{storeName}</h3>
        </div>
        <div className="ml-4">
          <img
            src={storeThumbnailUrl}
            alt={storeName}
            className="w-24 h-20 rounded-md object-cover"
          />
        </div>
      </div>

      {showModal && (
        <ReservationModal
          onClose={handleCloseModal}
          reservationTimes={reservationTimes}
          storeId={storeId}
          storeName = {storeName}
        />
      )}
    </div>
  );
};

export default ReservationTab;
