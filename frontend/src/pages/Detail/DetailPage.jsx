import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoTab from './components/InfoTab';
import ReservationTab from './components/ReservationTab';
import LocationTab from './components/LocationTab';
import image1 from '../../../public/SearchImg/1.png';
import image2 from '../../../public/SearchImg/2.png';
import image3 from '../../../public/SearchImg/3.jpg';
import image4 from '../../../public/SearchImg/4.jpg';
import image5 from '../../../public/SearchImg/5.jpeg';
import image6 from '../../../public/SearchImg/6.jpg';

const images = {
  1: image1,
  2: image2,
  3: image3,
  4: image4,
  5: image5,
  6: image6,
};

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchDetailData = async () => {
      const data = {
        id,
        title: `Image Title ${id}`,
        popUpStoreImgUrl: images[id],
        bookmarkCount: 1218,
        reservationTimes: ['11:00', '14:00', '17:00'],
        location: '서울시 성동구 성수이로 18길 20 세원정밀 창고',
      };

      setDetailData(data);
      setLoading(false);
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
        return <ReservationTab reservationTimes={detailData.reservationTimes} />;
      case 'location':
        return <LocationTab address={detailData.location} />;
      default:
        return null;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="relative">
        <img
          src={detailData.popUpStoreImgUrl}
          alt={detailData.title}
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
        <h2 className="text-xl font-bold">{detailData.title}</h2>
        <div className="flex items-center mt-2">
          <span className="text-2xl">🔖</span>
          <span className="ml-2 text-lg">{detailData.bookmarkCount}</span>
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
    </div>
  );
};

export default DetailPage;
