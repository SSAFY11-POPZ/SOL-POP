import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoTab from './components/InfoTab';
import ReservationTab from './components/ReservationTab';
import LocationTab from './components/LocationTab';
import ReservationDrawer from './components/ReservationModal';
import axios from 'axios';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const response = await axios.get(`https://solpop.xyz/api/v1/store/${id}`);
        const data = response.data;
        setDetailData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching detail data", error);
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="relative">
        <img
          src={detailData.store.storeThumbnailUrl}
          alt={`Thumbnail for ${detailData.store.storeName}`}
          className="w-full h-[300px] object-cover rounded-md"
        />
        <button 
          onClick={handleGoBack}
          className="absolute top-4 left-4 text-black text-2xl rounded-lg transition-all duration-300 flex items-center justify-center"
          style={{
            zIndex: 10,
            backgroundColor: 'transparent',
            width: '50px',
            height: '50px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            e.currentTarget.style.color = 'lightblue';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'black';
          }}
        >
          &lt;
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">{detailData.store.storeName}</h2>
        <div className="flex items-center mt-2">
          <span className="text-2xl">🔖</span>
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
