import React from 'react';
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
    <div className="flex flex-col items-center justify-center w-full max-w-4xl p-5 mx-auto space-y-6 bg-white rounded-lg">
      <div className="flex justify-end w-full px-4 py-1 text-xs">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            className="font-semibold transition duration-300 hover:text-red-800"
          >
            로그아웃
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="font-semibold transition duration-300 hover:text-blue-800"
          >
            로그인
          </button>
        )}
      </div>

      <div className="w-full">
        <Carousel_main 
          className="transition-transform duration-300 transform rounded-lg shadow-lg hover:scale-105"
        />
      </div>

      <div className="flex justify-center w-full mb-6">
        <Buttons_main className="flex justify-around w-full max-w-md space-x-4" />
      </div>

      <div className="w-full">
        <Carousel_sub 
          className="transition-transform duration-300 transform rounded-lg shadow-md hover:scale-105"
        />
      </div>
    </div>
  );
}

export default MainPage;
