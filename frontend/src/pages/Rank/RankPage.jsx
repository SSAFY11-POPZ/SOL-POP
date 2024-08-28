import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../utils/axios';

const RankPage = () => {
  const [stores, setStores] = useState([]);
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

    fetchStores();
  }, []);

  return (
    <div className="stores space-y-4 pb-20 pt-10">
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      <div
        className="store-item relative flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-200 via-red-200 to-pink-200 shadow-lg rounded-lg cursor-pointer hover:bg-gradient-to-l hover:from-yellow-300 hover:via-red-300 hover:to-pink-300 transition"
      >
        <div className="absolute top-2 left-2 bg-white border border-gray-300 text-gray-500 text-xs px-2 py-1 rounded-full">
          AD
        </div>
        <img
          src="/SearchImg/파묘.jpg"
          alt="파묘"
          className="store-image w-60 h-24 object-cover rounded-lg"
        />
        <div className="store-summary">
          <h4 className="text-sm font-semibold text-gray-800 truncate max-w-xs">
            파묘 팝업스토어
          </h4>
        </div>
      </div>

      {stores.map((store, index) => (
        <div
          key={store.storeId}
          className={`store-item flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 transition ${
            index < 3 ? 'border border-blue-500' : ''
          }`}
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
