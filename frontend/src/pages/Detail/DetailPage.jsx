import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoTab from './components/InfoTab';
import ReservationTab from './components/ReservationTab';
import LocationTab from './components/LocationTab';
import ReservationDrawer from './components/ReservationModal';
import api from '../../utils/axios';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

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
      alert('로그인이 필요한 기능입니다.');
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
        }
      );

      if (response.status === 200) {
        const updatedData = await fetchDetailData(accessToken);
        setIsHearted(updatedData.data.hearted);
      } else {
        alert('Unable to change heart status.');
      }
    } catch (error) {
      console.error('Error handling heart click', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    alert('로그아웃 되었습니다.');
    localStorage.removeItem('accessToken');
    navigate(`/detail/${id}`);
  };

  const handleHeartIconClick = () => {
    if (isLoggedIn) {
      handleHeartClick();
    } else {
      alert('로그인이 필요한 기능입니다.');
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

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!detailData) {
    return <div className="text-center mt-10">Item not found</div>;
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

  return (
    <div className="max-w-lg mx-auto p-4">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={handleGoBack}
          className="text-black text-2xl rounded-lg flex items-center justify-center"
          style={{
            zIndex: 10,
            backgroundColor: 'transparent',
            width: '50px',
            height: '50px',
            marginLeft: '-10px',
          }}
        >
          &lt;
        </button>
        
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0' }}
          >
            로그아웃
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', padding: '2px 0' }}
          >
            로그인
          </button>
        )}
      </div>


      <div className="relative">
        <img
          src={detailData.store.storeThumbnailUrl}
          alt={`Thumbnail for ${detailData.store.storeName}`}
          className="w-full h-full aspect-square object-cover rounded-md"
        />
        {detailData.store.imageList && detailData.store.imageList.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {detailData.store.imageList.map((image) => (
              <img
                key={image.imageId}
                src={image.imageUrl}
                alt={`Additional image ${image.imageId}`}
                className="w-full h-full object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">{detailData.store.storeName}</h2>
        <div className="flex items-center mt-2">
          <span 
            className={`text-2xl ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`} 
            onClick={handleHeartIconClick}
          >
            {isHearted ? '💖' : '🤍'}
          </span>
          <span className="ml-2 text-lg">{detailData.heartCount}</span>
        </div>
        <div className="flex mt-4 space-x-4">
          <button
            className={`flex-grow text-center py-2 border-b-2 ${activeTab === 'info' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('info')}
          >
            정보
          </button>
          <button
            className={`flex-grow text-center py-2 border-b-2 ${activeTab === 'reservation' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('reservation')}
          >
            예약
          </button>
          <button
            className={`flex-grow text-center py-2 border-b-2 ${activeTab === 'location' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('location')}
          >
            위치
          </button>
        </div>
        <div className="mt-4">
          {renderContent()}
        </div>
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
