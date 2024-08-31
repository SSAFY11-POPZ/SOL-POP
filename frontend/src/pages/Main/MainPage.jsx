import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel_main from './components/Carousel_main';
import Buttons_main from './components/Button_main';
import Carousel_sub from './components/Carousel_sub';
import Swal from 'sweetalert2';
import { logout } from '../../utils/axios';

function MainPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = async () => {
    await logout();
    Swal.fire({
      icon: 'success',
      title: '로그아웃 되었습니다.',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate('/');
    });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="relative">
      <div
        className="absolute left-0 top-0 z-50 flex w-full justify-center"
        style={{ margin: 0, padding: 0 }}
      >
        <button
          onClick={handleLogoClick}
          style={{ border: 'none', background: 'none', padding: 0, margin: 0 }}
        >
          <img
            src="/logo1.png"
            alt="Logo"
            className="h-16"
            style={{ marginBottom: 0, paddingBottom: 0 }}
          />
        </button>
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center space-y-6 rounded-lg bg-white p-5">
        <div className="w-full" style={{ marginTop: '2rem' }}>
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
    </div>
  );
}

export default MainPage;
