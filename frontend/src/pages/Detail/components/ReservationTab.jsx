import React, { useState } from 'react';
import ReservationModal from './ReservationModal';

const ReservationTab = ({ reservationTimes, storeId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleReservationClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="reservation-tab">
      <button onClick={handleReservationClick} className="reservation-button">
        예약하기
      </button>

      {showModal && (
        <ReservationModal 
          onClose={handleCloseModal} 
          reservationTimes={reservationTimes} 
          storeId={storeId} 
        />
      )}
    </div>
  );
};

export default ReservationTab;
