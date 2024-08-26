import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImageGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [connectionError, setConnectionError] = useState(null); // 추가: 연결 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://solpop.xyz/api/v1/store/list');
        const data = Array.isArray(response.data) ? response.data : [];
        setImages(data);
        setFilteredImages(data);
        setConnectionError(null); // 연결 성공 시 에러 상태 초기화
      } catch (error) {
        handleAxiosError(error); // 상세 에러 처리 함수 호출
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (searchTerm.trim() === "") {
        setFilteredImages(images);
        return;
      }

      try {
        const response = await axios.get(`https://solpop.xyz/api/v1/store/search?query=${encodeURIComponent(searchTerm)}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setFilteredImages(data);
        setConnectionError(null); // 연결 성공 시 에러 상태 초기화
      } catch (error) {
        handleAxiosError(error); // 상세 에러 처리 함수 호출
      }
    };

    fetchFilteredData();
  }, [searchTerm, images]);

  const handleImageClick = (id) => {
    navigate(`/detail/${id}`);
  };

  // Axios 에러를 구체적으로 처리하는 함수
  const handleAxiosError = (error) => {
    if (error.response) {
      // 서버가 응답했지만 상태 코드가 범위 밖인 경우 (4xx, 5xx)
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      setConnectionError(`Error: Received ${error.response.status} from server.`);
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      console.error("Request data:", error.request);
      setConnectionError("Error: No response received from server.");
    } else {
      // 요청을 설정하는 중에 오류가 발생한 경우
      console.error("Error message:", error.message);
      setConnectionError(`Error: ${error.message}`);
    }
    console.error("Config:", error.config);
  };

  return (
    <div className="flex flex-col min-h-screen p-2 w-full pb-14 box-border">
      <div className="flex justify-center items-center mb-4">
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-1 border border-gray-300 rounded-md outline-none"
        />
      </div>

      {connectionError && (
        <div className="text-center text-red-500 mb-4">
          {connectionError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 flex-grow content-start">
        {filteredImages.length > 0 ? (
          filteredImages.map((item) => (
            <div
              className="relative text-center h-36 overflow-hidden rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105"
              key={item.storeId}
              onClick={() => handleImageClick(item.storeId)}
            >
              <img
                src={item.storeThumbnailUrl}
                alt={item.storeName}
                className="w-full h-full object-cover rounded-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-sm"></div>
            </div>
          ))
        ) : (
          <div className="text-center whitespace-nowrap">검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ImageGrid;
