import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  const accesstoken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accesstoken) {
      Swal.fire({
        icon: 'warning',
        text: '로그인이 필요한 기능입니다.',
      }).then(() => {
        navigate('/login');
      });
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
        console.error(
          'Error fetching store data:',
          error.response ? error.response.data : error.message,
        );
      }
    };

    fetchStoreData();
  }, [storeId]);

  const fetchReserveData = async (date) => {
    try {
      const response = await api.get(
        `/api/v1/store/${storeId}/reserve?date=${date}`,
      );
      console.log('API Response:', response.data);

      const data = response.data;

      if (data.reserveDate) {
        const reserveDate = new Date(data.reserveDate);
        setReserveDate(reserveDate);

        if (Array.isArray(data.unavailableTime)) {
          setUnavailableTimes(
            data.unavailableTime.map((time) => time.slice(0, 5)),
          );
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
      Swal.fire({
        icon: 'warning',
        text: '날짜와 시간을 둘 다 선택해주세요.',
      });
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
        },
      );

      console.log('Response:', response.data);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '예약이 완료되었습니다.',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          onClose();
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: '예약이 실패했습니다.',
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire({
          icon: 'error',
          text: '이미 예약된 팝업입니다.',
        });
      } else {
        console.error('Error during reservation:', error);
        Swal.fire({
          icon: 'error',
          text: '에러가 발생했습니다. 서버 관리자에게 문의하세요.',
        });
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today || date < storeStartDate || date > storeEndDate;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div
        ref={drawerRef}
        className={`h-2/3 w-full max-w-md transform rounded-t-2xl bg-white p-6 shadow-lg transition-transform duration-300 ${
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
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-xl text-gray-500 transition-colors hover:text-gray-700"
        >
          &times;
        </button>

        <div className="mb-4 text-center">
          <h3 className="text-lg font-extrabold text-gray-900">예약 일정</h3>
        </div>

        <div className="mb-4 flex justify-center">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={({ date }) => isDateDisabled(date)}
            formatDay={(locale, date) => `${date.getDate()}`}
            className="w-full max-w-lg rounded-lg border-none shadow-none"
            tileClassName={({ date }) => {
              const baseClass =
                'p-1.5 text-center w-8 h-8 flex items-center justify-center';

              const isToday = new Date().toDateString() === date.toDateString();
              const isSelectedDate =
                selectedDate &&
                selectedDate.toDateString() === date.toDateString();

              const selectedClass = isSelectedDate
                ? 'bg-blue-500 text-white rounded-md'
                : '';

              const currentDayClass =
                isToday && !isSelectedDate
                  ? 'bg-gray-200 text-black rounded-md'
                  : '';

              return `${baseClass} ${selectedClass} ${currentDayClass}`;
            }}
            prevLabel={<span className="text-orange-500">&lt;</span>}
            nextLabel={<span className="text-orange-500">&gt;</span>}
            navigationLabel={({ date }) => (
              <span className="text-lg font-bold">{`${date.toLocaleString(
                'default',
                {
                  month: 'long',
                },
              )} ${date.getFullYear()}`}</span>
            )}
            locale="en-US"
          />
        </div>

        <div className="mb-4">
          <h4 className="mb-3 text-base font-semibold text-gray-700">
            시간 선택
          </h4>
          <div className="mb-2">
            <h5 className="mb-2 font-medium text-gray-600">오전</h5>
            <div className="grid grid-cols-3 gap-2">
              {morningTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  disabled={isTimeUnavailable(time)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                      : isTimeUnavailable(time)
                        ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <h5 className="mb-2 font-medium text-gray-600">오후</h5>
            <div className="grid grid-cols-3 gap-2">
              {afternoonTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  disabled={isTimeUnavailable(time)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                      : isTimeUnavailable(time)
                        ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-500'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-100'
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
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 py-3 text-lg font-semibold text-white shadow-md duration-300"
        >
          예약 신청하기
        </button>
      </div>
    </div>
  );
};

export default ReservationDrawer;
