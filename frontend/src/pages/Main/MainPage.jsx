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
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 space-y-4">
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px', width: '100%' }}>
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            로그아웃
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            로그인
          </button>
        )}
      </div>

      <div className="w-full">
        <Carousel_main 
          spaceBetween={30}
          slidesPerView={1.2}
        />
      </div>
      <div className="w-full flex justify-center" style={{ marginBottom: '-5px' }}>
        <Buttons_main />
      </div>
      <div className="w-full">
        <Carousel_sub />
      </div>
    </div>
  );
}

export default MainPage;
