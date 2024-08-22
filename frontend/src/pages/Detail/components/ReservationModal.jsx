import React, { useState } from 'react';

const ReservationModal = ({ onClose, reservationTimes, storeId }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleReservationSubmit = async () => {
    if (selectedDate && selectedTime) {
      const datetime = `${selectedDate}T${selectedTime}`;
      const reservationData = {
        date: selectedDate,
        time: selectedTime,
      };

      try {
        const response = await fetch(`/api/v1/store/${storeId}/reserve/request?datetime=${datetime}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });

        if (response.ok) {
          alert('예약이 완료되었습니다.');
          onClose();
        } else {
          alert('예약이 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('에러가 발생했습니다.');
      }
    } else {
      alert('날짜와 시간을 둘 다 선택해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        <h3>예약하기</h3>

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="calendar-input"
        />

        <div className="time-selection">
          {reservationTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`time-button ${selectedTime === time ? 'selected' : ''}`}
            >
              {time}
            </button>
          ))}
        </div>

        <button onClick={handleReservationSubmit} className="submit-button">
          예약 신청하기
        </button>
      </div>
    </div>
  );
};

export default ReservationModal;
