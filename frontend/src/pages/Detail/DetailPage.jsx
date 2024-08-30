import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoTab from './components/InfoTab';
import ReservationTab from './components/ReservationTab';
import LocationTab from './components/LocationTab';
import ReservationDrawer from './components/ReservationModal';
import api from '../../utils/axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';
import { logout } from '../../utils/axios'; // Import the logout function

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  const sliderRef = useRef(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await fetchDetailData(accessToken);

        if (response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            await fetchDetailData(newAccessToken);
          } else {
            navigate('/login');
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [id, navigate]);

  const fetchDetailData = async (token) => {
    try {
      const response = await api.get(`/api/v1/store/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDetailData(response.data);
      setIsHearted(response.data.hearted);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return error.response;
      } else {
        console.error('Error fetching detail data', error);
        setLoading(false);
        return { status: 500 };
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/api/v1/auth/refresh-token');
      localStorage.setItem('accessToken', response.data.data.accessToken);
      return response.data.data.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token', error);
      localStorage.removeItem('accessToken');
      return null;
    }
  };

  const handleHeartClick = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      Swal.fire({
        icon: 'warning',
        text: '로그인이 필요한 기능입니다.',
      });
      navigate(`/login?redirectTo=${encodeURIComponent(location.pathname)}`);
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/store/heart`,
        { storeId: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const updatedData = await fetchDetailData(accessToken);
        setIsHearted(updatedData.data.hearted);
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Unable to change heart status.',
        });
      }
    } catch (error) {
      console.error('Error handling heart click', error);
      Swal.fire({
        icon: 'error',
        text: 'An error occurred. Please try again.',
      });
    }
  };

  const handleLogout = async () => {
    await logout(); // Call the logout function
    Swal.fire({
      icon: 'success',
      title: '로그아웃 되었습니다.',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate('/'); // Navigate to the main page
    });
  };

  const handleHeartIconClick = () => {
    if (isLoggedIn) {
      handleHeartClick();
    } else {
      Swal.fire({
        icon: 'warning',
        text: '로그인이 필요한 기능입니다.',
      });
      navigate('/login');
    }
  };

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (!detailData) {
    return <div className="mt-10 text-center">Item not found</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab detailData={detailData} />;
      case 'reservation':
        return (
          <>
            <ReservationTab
              reservationTimes={detailData.store.reservationTimes}
              storeId={detailData.store.storeId}
              storeName={detailData.store.storeName}
              storeThumbnailUrl={detailData.store.storeThumbnailUrl}
            />
          </>
        );
      case 'location':
        return <LocationTab address={detailData.store.storePlace} />;
      default:
        return null;
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-8 items-center justify-start gap-3 rounded-[10px] p-2.5">
          <svg
            onClick={handleGoBack}
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 13L1 7L7 1"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

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

      <div className="relative">
        <div className="relative">
          <Slider ref={sliderRef} {...sliderSettings}>
            <div>
              <img
                src={detailData.store.storeThumbnailUrl}
                alt={`Thumbnail for ${detailData.store.storeName}`}
                className="aspect-square h-full w-full rounded-md object-cover"
              />
            </div>
            {detailData.store.imageList?.map((image) => (
              <div key={image.imageId}>
                <img
                  src={image.imageUrl}
                  alt={`Image ${image.imageId} for ${detailData.store.storeName}`}
                  className="aspect-square h-full w-full rounded-md object-cover"
                />
              </div>
            ))}
          </Slider>
          <div
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 transform cursor-pointer items-center justify-center"
          >
            &lt;
          </div>
          <div
            onClick={handleNext}
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 transform cursor-pointer items-center justify-center"
          >
            &gt;
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mt-8 text-xl font-bold">{detailData.store.storeName}</h2>
        <div className="mt-2 flex items-center">
          <span
            className={`text-2xl ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            onClick={handleHeartIconClick}
          >
            {isHearted ? '💖' : '🤍'}
          </span>
          <span className="ml-2 text-lg">{detailData.heartCount}</span>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            className={`flex-grow border-b-2 py-2 text-center ${activeTab === 'info' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
          <button
            className={`flex-grow border-b-2 py-2 text-center ${activeTab === 'reservation' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('reservation')}
          >
            예약
          </button>
          <button
            className={`flex-grow border-b-2 py-2 text-center ${activeTab === 'location' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('location')}
          >
            위치
          </button>
        </div>
        <div className="mt-4">{renderContent()}</div>
      </div>

      {isDrawerOpen && (
        <ReservationDrawer
          onClose={handleCloseDrawer}
          storeId={detailData.store.storeId}
          storePlace={detailData.store.storePlace}
        />
      )}
    </div>
  );
};

export default DetailPage;
