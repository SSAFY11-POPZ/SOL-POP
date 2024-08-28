import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const tokenValid = await api.get('/api/v1/auth/check-token');
        
        if (!tokenValid.data.result) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        const response = await api.get('/api/v1/user/heart');

        if (response.status === 200) {
          const wishlistData = response.data;
          const detailedItems = await Promise.all(
            wishlistData.map(async (item) => {
              const storeId = item.store.storeId;
              const storeDetailResponse = await api.get(`/api/v1/store/${storeId}`);
              return {
                storeId,
                storeName: item.store.storeName,
                storePlace: item.store.storePlace,
                storeThumbnailUrl: storeDetailResponse.data.store.storeThumbnailUrl,
                liked: true,
              };
            })
          );
          setWishlistItems(detailedItems);
        } else {
          throw new Error('Failed to fetch wishlist items');
        }
      } catch (error) {
        console.error('Error fetching wishlist data:', error.response ? error.response.data : error.message);
        setError('Failed to load wishlist. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems(); 
  }, []);

  const toggleHeart = async (storeId) => {
    try {
      await api.post('/api/v1/store/heart', { storeId });
      setWishlistItems((prevItems) =>
        prevItems.map((item) =>
          item.storeId === storeId ? { ...item, liked: !item.liked } : item
        )
      );
    } catch (error) {
      console.error('Error toggling heart:', error.response ? error.response.data : error.message);
      setError('Failed to update wishlist. Please try again later.');
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoggedIn]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div
        className="text-center mt-10 flex flex-col items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/SearchImg/heart.svg')` }}
      >
        <div className="text-black-500 mb-4">로그인이 필요한 기능입니다.</div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={() => navigate('/login')}
        >
          로그인 하러 가기
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div
      className="max-w-7xl mx-auto p-4 pb-20 h-screen overflow-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // For Firefox and IE/Edge
    >
      <style>
        {`
          .max-w-7xl::-webkit-scrollbar {
            display: none; /* For Chrome, Safari, and Opera */
          }
        `}
      </style>
      <h1 className="text-1xl font-bold mb-6">찜한 팝업스토어 정보를 알려드릴게요</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.storeId} className="border p-2 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <img
              src={item.storeThumbnailUrl}
              alt={item.storeName}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-sm font-semibold">{item.storeName}</h2>
              <button onClick={() => toggleHeart(item.storeId)}>
                {item.liked ? '💖' : '🤍'}
              </button>
            </div>
            <p className="text-xs text-gray-500">{item.storePlace}</p>
            <button
            className="mt-auto w-full px-4 py-0.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
            onClick={() => navigate(`/detail/${item.storeId}`)}
          >
            예약하러 가기
          </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
