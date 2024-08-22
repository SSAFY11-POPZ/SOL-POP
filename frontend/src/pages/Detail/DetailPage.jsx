import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoTab from './components/InfoTab';
import ReservationTab from './components/ReservationTab';
import LocationTab from './components/LocationTab';

const DetailPage = () => {
  const { id } = useParams();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    console.log(`${id}`)
    const fetchDetailData = async () => {
      try {
        const response = await fetch(`/api/v1/store/${storeId}`);
        const data = await response.json();
        setDetailData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching detail data:", error);
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!detailData) {
    return <div>Item not found</div>;
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

  return (
    <div className="detail-container">
      <img src={detailData.popUpStoreImgUrl} alt={detailData.title} className="detail-image" />
      <div className="detail-content">
        <h2 className="detail-title">{detailData.title}</h2>
        <div className="detail-icons">
          <span className="detail-icons-bookmark">🔖</span>
          <span className="detail-icons-count">{detailData.bookmarkCount || 0}</span>
        </div>
        <div className="detail-tabs">
          <div 
            className={`detail-tab ${activeTab === 'info' ? 'active' : ''}`} 
            onClick={() => setActiveTab('info')}
          >
            정보
          </div>
          <div 
            className={`detail-tab ${activeTab === 'reservation' ? 'active' : ''}`} 
            onClick={() => setActiveTab('reservation')}
          >
            예약
          </div>
          <div 
            className={`detail-tab ${activeTab === 'location' ? 'active' : ''}`} 
            onClick={() => setActiveTab('location')}
          >
            위치
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DetailPage;
