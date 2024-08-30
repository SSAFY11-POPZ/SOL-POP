import React, { useState } from 'react';

const StatsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="stats-page mt-4">
      <h1>Stats Page</h1>
      <button onClick={handleOpenModal} className="open-modal-button">
        Open Reservation Modal
      </button>

      <div className="reservation-tab mt-4">날짜와 시간을 선택해주세요.</div>
    </div>
  );
};

export default StatsPage;
