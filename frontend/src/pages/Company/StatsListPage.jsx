import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const StatsListPage = () => {
  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get('/api/v1/company/myStore');

        if (response.data && response.data.length > 0) {
          const storeId = response.data[0].store.storeId;
          const storeDetailResponse = await api.get(`/api/v1/store/${storeId}`);
          setStore(storeDetailResponse.data);
        } else {
          setError('등록된 가게가 없습니다.');
        }
      } catch (error) {
        console.error('Error fetching store stats:', error);
        setError('가게 통계 데이터를 불러올 수 없습니다.');
      }
    };

    fetchStore();
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleCardClick = (storeId) => {
    navigate(`/stats/${storeId}`);
  };

  const truncateStoreName = (name) => {
    if (name.length > 15) {
      return name.slice(0, 10) + '...';
    }
    return name;
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
      </div>

      <div className="store space-y-4 pb-20">
        {error && <p className="text-red-500">{error}</p>}

        {store && (
          <div
            className="store-item relative flex cursor-pointer items-center space-x-4 rounded-lg border border-blue-500 bg-white p-4 shadow-md transition hover:bg-gray-100"
            onClick={() => handleCardClick(store.storeId)}
          >
            <img
              src={store.storeThumbnailUrl || '/path/to/default-image.jpg'}
              alt={store.storeName}
              className="store-image rounded-lg object-cover"
              style={{ width: '220px', height: '112px' }}
            />
            <div className="store-summary">
              <h4 className="truncate text-xs font-semibold text-gray-800">
                {truncateStoreName(store.storeName)}
              </h4>
              <p className="text-gray-600">{store.storeDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(StatsListPage);
