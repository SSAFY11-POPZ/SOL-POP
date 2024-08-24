import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImageGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/store/list');
        console.log(response.data)
        const data = Array.isArray(response.data) ? response.data : []; // 배열인지 확인 후 설정
        setImages(data);
        setFilteredImages(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = images.filter(item =>
      item.popUpStoreNo.includes(searchTerm)
    );
    setFilteredImages(filtered);
  }, [searchTerm, images]);

  const handleImageClick = (id) => {
    navigate(`/detail/${id}`);
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
      <div className="grid grid-cols-3 gap-1 flex-grow content-start">
        {filteredImages.length > 0 ? (
          filteredImages.map((item) => (
            <div
              className="relative text-center h-36 overflow-hidden rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105"
              key={item.id}
              onClick={() => handleImageClick(item.id)}
            >
              <img
                src={item.storeThumbnailUrl}
                alt={item.title}
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
