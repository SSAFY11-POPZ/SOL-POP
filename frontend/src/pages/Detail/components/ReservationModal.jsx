import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const ReservationDrawer = ({ onClose, storeId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [reserveDate, setReserveDate] = useState(null);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [storeStartDate, setStoreStartDate] = useState(null);
  const [storeEndDate, setStoreEndDate] = useState(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`https://solpop.xyz/api/v1/store/${storeId}`);
        const storeData = response.data.store;

        setStoreStartDate(new Date(storeData.storeStartDate));
        setStoreEndDate(new Date(storeData.storeEndDate));
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const fetchReserveData = async (date) => {
    try {
      const response = await axios.get(`https://solpop.xyz/api/v1/store/${storeId}/reserve?date=${date}`);
      console.log('API Response:', response.data);

      const data = response.data;

      if (data.reserveDate) {
        const reserveDate = new Date(data.reserveDate);
        setReserveDate(reserveDate);

        if (Array.isArray(data.unavailableTime)) {
          setUnavailableTimes(data.unavailableTime.map((time) => time.slice(0, 5)));
        } else {
          console.warn('unavailableTime is not an array or is undefined');
          setUnavailableTimes([]);
        }
      } else {
        console.error('reserveDate is missing in the response');
      }
    } catch (error) {
      console.error('Error fetching reserve date and times:', error);
    }
  };

  const handleDateChange = (date) => {
    if (isDateDisabled(date)) {
      return;
    }
  
    setSelectedDate(date);
    setSelectedTime('');  // 시간 선택 초기화
    const formattedDate = date.toLocaleDateString('en-CA');
    fetchReserveData(formattedDate);
  };
  

  const handleTimeSelect = (time) => {
    if (isTimeUnavailable(time)) {
      return; // 선택 불가 시, 리턴만 하도록 수정
    }

    // Toggle time selection
    if (selectedTime === time) {
      setSelectedTime(''); // 선택 해제 시, 빈 문자열로 설정
    } else {
      setSelectedTime(time); // 새로 선택된 시간으로 설정
    }
  };

  const handleReservationSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 둘 다 선택해주세요.');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('en-CA');
    const datetime = `${formattedDate}T${selectedTime}:00`;

    try {
      const response = await axios.post(
        `https://solpop.xyz/api/v1/store/${storeId}/reserve/request?datetime=${datetime}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

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
  };

  const isTimeUnavailable = (time) => {
    return unavailableTimes.includes(time);
  };

  const morningTimes = ['11:00', '11:30'];
  const afternoonTimes = [
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ];

  const isDateDisabled = (date) => {
    if (!storeStartDate || !storeEndDate) return true;
    return date < storeStartDate || date > storeEndDate;
  };

  return (
    <div className="fixed inset-0 flex items-end justify-center z-50 bg-black bg-opacity-50">
      <div
        ref={drawerRef}
        className={`bg-white p-6 rounded-t-2xl shadow-lg w-full max-w-md h-2/3 transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '80%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>
          {`
            ::-webkit-scrollbar {
              display: none;
            }
            .react-calendar__tile:active,
            .react-calendar__tile:focus {
              background-color: inherit !important;
              box-shadow: none !important;
            }
            .react-calendar__tile--hovered:not(.react-calendar__tile--now):not(.react-calendar__tile--active) {
              background-color: #555555 !important; /* Changed to dark gray */
            }
            .react-calendar__tile--active:enabled:hover {
              background-color: #3b82f6 !important;
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
          <h3 className="text-lg font-extrabold text-gray-900">예약 일정</h3>
        </div>

        <div className="flex justify-center mb-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={({ date }) => isDateDisabled(date)}
            formatDay={(locale, date) => `${date.getDate()}`}
            className="rounded-lg shadow-none border-none w-full max-w-lg"
            tileClassName={({ date, view }) => {
              let classes =
                'p-1.5 text-center text-gray-900 w-8 h-8 flex items-center justify-center';
              if (date.getDay() === 0) classes += ' text-red-500';
              if (date.getDay() === 6) classes += ' text-red-500';
              if (selectedDate && selectedDate.toDateString() === date.toDateString()) {
                classes += ' bg-blue-500 text-white rounded-md';
              } else if (new Date().toDateString() === date.toDateString()) {
                classes += ' bg-gray-200 text-black rounded-md';
              } else if (!isDateDisabled(date)) {
                classes += ' hover:bg-gray-400 rounded-md';
              }
              return classes;
            }}
            prevLabel={<span className="text-orange-500">&lt;</span>}
            nextLabel={<span className="text-orange-500">&gt;</span>}
            navigationLabel={({ date, view }) => (
              <span className="text-lg font-bold">{`${date.toLocaleString('default', {
                month: 'long',
              })} ${date.getFullYear()}`}</span>
            )}
            locale="en-US"
          />
        </div>

        <div className="mb-4">
          <h4 className="text-gray-700 font-semibold mb-3 text-base">시간 선택</h4>
          <div className="mb-2">
            <h5 className="text-gray-600 font-medium mb-2">오전</h5>
            <div className="grid grid-cols-3 gap-2">
              {morningTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  disabled={isTimeUnavailable(time)}
                  className={`py-2 px-4 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isTimeUnavailable(time)
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
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
                  disabled={isTimeUnavailable(time)}
                  className={`py-2 px-4 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg'
                      : isTimeUnavailable(time)
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
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
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-md duration-300"
        >
          예약 신청하기
        </button>
      </div>
    </div>
  );
};

export default ReservationDrawer;
