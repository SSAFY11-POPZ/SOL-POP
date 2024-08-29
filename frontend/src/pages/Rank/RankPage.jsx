import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../utils/axios';

const RankPage = () => {
  const [stores, setStores] = useState([]);
  const [adStore, setAdStore] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/api/v1/store/top10');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('데이터를 불러올 수 없습니다.');
      }
    };

    const fetchAdStore = async () => {
      try {
        const response = await api.get('/api/v1/store/ad');
        setAdStore(response.data);
      } catch (error) {
        console.error('Error fetching ad data:', error);
        setError('광고 데이터를 불러올 수 없습니다.');
      }
    };

    fetchStores();
    fetchAdStore();
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="stores space-y-4 pb-20 pt-2">
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingBottom: '10px' }}>
        <button 
          onClick={handleGoBack}
          className="text-black text-2xl rounded-lg flex items-center justify-center"
          style={{
            zIndex: 10,
            backgroundColor: 'transparent',
            width: '40px',
            height: '40px',
          }}
        >
          &lt;
        </button>
      </div>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {adStore && (
        <div
          className="store-item flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 transition border border-blue-500 relative"
          onClick={() => navigate(`/detail/${adStore.storeId}`)}
        >
          <div className="absolute top-2 left-2 bg-white border border-gray-300 text-gray-500 text-xs px-2 py-1 rounded-full">
            AD
          </div>
          <img
            src={adStore.storeThumbnailUrl}
            alt={adStore.storeName}
            className="store-image w-60 h-24 object-cover rounded-lg"
          />
          <div className="store-summary">
            <h4 className="text-sm font-semibold text-gray-800 truncate max-w-xs">
              {adStore.storeName}
            </h4>
          </div>
        </div>
      )}

      {stores.map((store, index) => (
        <div
          key={store.storeId}
          className={`store-item relative flex items-center space-x-4 p-4 ${
            index < 3
              ? 'bg-gradient-to-r from-yellow-200 via-red-200 to-pink-200 shadow-lg hover:bg-gradient-to-l hover:from-yellow-300 hover:via-red-300 hover:to-pink-300'
              : 'bg-white shadow-md hover:bg-gray-100'
          } rounded-lg cursor-pointer transition`}
          onClick={() => navigate(`/detail/${store.storeId}`)}
        >
          <div className="store-rank text-xs font-bold text-gray-800">
            #{index + 1}
          </div>
          <img
            src={store.storeThumbnailUrl}
            alt={store.storeName}
            className="store-image w-60 h-24 object-cover rounded-lg"
          />
          <div className="store-summary flex-1">
            <h4 className="text-xs font-semibold text-gray-800 truncate">
              {store.storeName}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(RankPage);
