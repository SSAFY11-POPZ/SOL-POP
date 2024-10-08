import React from 'react';
import { format, addDays, startOfWeek, isSameMonth, isSameDay } from 'date-fns';

const CalendarCarousel = ({ currentDate, selectedDate, onDateClick, onPrevWeek, onNextWeek, middleDay }) => {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handlePrevWeek = () => {
    onPrevWeek();
  };

  const handleNextWeek = () => {
    onNextWeek();
  };

  const displayedMonthYear = format(middleDay, 'MMMM yyyy'); // middleDay를 기준으로 월 표시

  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <button 
          onClick={handlePrevWeek} 
          className="text-xl text-gray-600 hover:text-gray-900"
        >
          {"<"}
        </button>
        <h2 className="text-lg font-bold text-gray-800">
          {displayedMonthYear} {/* 주간 이동 시 middleDay 기준으로 월 표시 */}
        </h2>
        <button 
          onClick={handleNextWeek} 
          className="text-xl text-gray-600 hover:text-gray-900"
        >
          {">"}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 w-full mb-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div
            key={index}
            className={`text-xs font-medium ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 w-full">
        {days.map((day, index) => (
          <button
            key={index}
            className={`py-2 rounded-full ${
              isSameMonth(day, middleDay)
                ? index === 0
                  ? 'text-red-500'
                  : index === 6
                  ? 'text-blue-500'
                  : 'text-black' // 현재 월에 해당하는 일들은 검정
                : 'text-gray-400' // 다른 월에 해당하는 일들은 회색
            } ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => onDateClick(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CalendarCarousel);
