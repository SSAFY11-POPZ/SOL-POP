import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';

const ReservationDrawer = ({ onClose, storeId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [reserveDate, setReserveDate] = useState(null);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [storeStartDate, setStoreStartDate] = useState(null);
  const [storeEndDate, setStoreEndDate] = useState(null);
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  const accesstoken = localStorage.getItem('accessToken'); // Access token 가져오기

  useEffect(() => {
    if (!accesstoken) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
      return;
    }
    
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
  }, [onClose, accesstoken, navigate]);
  

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await api.get(`/api/v1/store/${storeId}`);
        const storeData = response.data.store;
        setStoreStartDate(new Date(storeData.storeStartDate));
        setStoreEndDate(new Date(storeData.storeEndDate));
      } catch (error) {
        console.error('Error fetching store data:', error.response ? error.response.data : error.message);
      }
    };
    
    fetchStoreData();
  }, [storeId]);

  const fetchReserveData = async (date) => {
    try {
      const response = await api.get(`/api/v1/store/${storeId}/reserve?date=${date}`);
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
    setSelectedTime('');
    const formattedDate = date.toLocaleDateString('en-CA');
    fetchReserveData(formattedDate);
  };

  const handleTimeSelect = (time) => {
    if (isTimeUnavailable(time)) {
      return;
    }

    setSelectedTime(selectedTime === time ? '' : time);
  };

  const handleReservationSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 둘 다 선택해주세요.');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('en-CA');
    const datetime = `${formattedDate}T${selectedTime}`;

    try {
      console.log('Submitting reservation with datetime:', datetime);

      const response = await api.post(
        `/api/v1/store/${storeId}/reserve/request?datetime=${datetime}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accesstoken}`,
          },
        }
      );

      console.log('Response:', response.data);

      if (response.status === 200) {
        alert('예약이 완료되었습니다.');
        onClose();
      } else {
        alert('예약이 실패했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('이미 예약된 팝업입니다.');
      } else {
        console.error('Error during reservation:', error);
        alert('에러가 발생했습니다. 서버 관리자에게 문의하세요.');
      }
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
        style={{
          maxHeight: '80%',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            /* For Chrome, Safari, and Opera */
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
          <h3 className="text-lg font-extrabold text-gray-900">예약 일정</h3>
        </div>

        <div className="flex justify-center mb-4">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={({ date }) => isDateDisabled(date)}
            formatDay={(locale, date) => `${date.getDate()}`}
            className="rounded-lg shadow-none border-none w-full max-w-lg"
            tileClassName={({ date }) => {
              const baseClass = 'p-1.5 text-center w-8 h-8 flex items-center justify-center';
              const selectedClass = selectedDate && selectedDate.toDateString() === date.toDateString()
                ? 'bg-blue-500 text-white rounded-md'
                : '';
              const currentDayClass = new Date().toDateString() === date.toDateString()
                ? 'bg-gray-200 text-black rounded-md'
                : '';

              return `${baseClass} ${selectedClass} ${currentDayClass}`;
            }}
            prevLabel={<span className="text-orange-500">&lt;</span>}
            nextLabel={<span className="text-orange-500">&gt;</span>}
            navigationLabel={({ date }) => (
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
                  className={`py-2 px-4 text-sm font-semibold rounded-full transition-all duration-200 border ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                      : isTimeUnavailable(time)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
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
                  className={`py-2 px-4 text-sm font-semibold rounded-full transition-all duration-200 border ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                      : isTimeUnavailable(time)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
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
