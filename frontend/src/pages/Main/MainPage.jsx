import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel_main from './components/Carousel_main';
import Buttons_main from './components/Button_main';
import Carousel_sub from './components/Carousel_sub';

function MainPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center space-y-6 rounded-lg bg-white p-5">
      <div className="w-full">
        <Carousel_main className="transform rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" />
      </div>

      <div className="mb-6 flex w-full justify-center">
        <Buttons_main className="flex w-full max-w-md justify-around space-x-4" />
      </div>

      <div className="w-full">
        <Carousel_sub className="transform rounded-lg shadow-md transition-transform duration-300 hover:scale-105" />
      </div>

      <div className="z-100 relative bottom-16 left-0 right-0 flex justify-center bg-white px-4 py-2">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-400 transition duration-300 hover:text-red-800"
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-gray-400 transition duration-300 hover:text-blue-800"
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
}

export default MainPage;
