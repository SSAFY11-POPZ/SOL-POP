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
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-lg">
      <div className="flex justify-end w-full p-4">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            className="text-red-600 font-semibold hover:text-red-800 transition duration-300"
          >
            로그아웃
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold hover:text-blue-800 transition duration-300"
          >
            로그인
          </button>
        )}
      </div>

      <div className="w-full">
        <Carousel_main 
          spaceBetween={30}
          slidesPerView={1.2}
          className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
        />
      </div>

      <div className="w-full flex justify-center mb-6">
        <Buttons_main className="flex justify-around w-full max-w-md space-x-4" />
      </div>

      <div className="w-full">
        <Carousel_sub 
          className="rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300"
        />
      </div>
    </div>
  );
}

export default MainPage;
