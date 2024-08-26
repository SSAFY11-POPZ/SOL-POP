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
        const response = await axios.get('https://solpop.xyz/api/v1/store/list');
        const data = Array.isArray(response.data) ? response.data : [];
        setImages(data);
        setFilteredImages(data);
      } catch (error) {
        console.error("Error fetching the data", error);
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
      } catch (error) {
        console.error("Error fetching filtered data", error);
      }
    };

    fetchFilteredData();
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
