import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const ReservationDrawer = ({ onClose, reservationTimes, storeId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 드로워가 열릴 때 슬라이드 애니메이션 시작
    setIsVisible(true);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleReservationSubmit = async () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const datetime = `${formattedDate}T${selectedTime}`;

      try {
        const response = await axios.post(`/api/v1/store/${storeId}/reserve/request?datetime=${datetime}`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
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

  // 오전/오후 시간대별 옵션 생성
  const morningTimes = ['11:00', '11:30'];
  const afternoonTimes = ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50 bg-black bg-opacity-50">
      <div
        className={`bg-white p-6 rounded-t-2xl shadow-lg w-full max-w-md h-2/3 transform transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '80%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} // 스크롤바 숨기기 (Firefox, IE)
      >
        {/* 스크롤바 숨기기 (Chrome, Safari, Edge) */}
        <style>
          {`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors text-xl"
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <h3 className="text-lg font-extrabold text-gray-900">
            6/14 COMING SOON at SEONGSU
          </h3>
        </div>

        <div className="flex justify-center mb-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="rounded-lg shadow-md border-gray-200 transform scale-90" // 크기를 축소
            tileClassName="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200"
          />
        </div>

        <div className="mb-4">
          <h4 className="text-gray-700 font-semibold mb-3 text-base">시간 선택</h4>
          <div className="mb-2">
            <h5 className="text-gray-600 font-medium mb-2">오전</h5>
            <div className="grid grid-cols-3 gap-2"> {/* 오후와 동일하게 3열 배치 */}
              {morningTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-2 px-4 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <h5 className="text-gray-600 font-medium mb-2">오후</h5>
            <div className="grid grid-cols-3 gap-2">
              {afternoonTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-2 px-4 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleReservationSubmit}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-md  duration-300"
        >
          예약 신청하기
        </button>
      </div>
    </div>
  );
};

export default ReservationDrawer;
