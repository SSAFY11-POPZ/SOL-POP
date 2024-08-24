import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import image1 from '@/assets/SearchImg/1.png';
import image2 from '@/assets/SearchImg/2.png';
import image3 from '@/assets/SearchImg/3.jpg';
import image4 from '@/assets/SearchImg/4.jpg';
import image5 from '@/assets/SearchImg/5.jpeg';
import image6 from '@/assets/SearchImg/6.jpg';
import image7 from '@/assets/SearchImg/7.jpg';
import image8 from '@/assets/SearchImg/8.jpg';
import image9 from '@/assets/SearchImg/9.jpg';
import image10 from '@/assets/SearchImg/10.png';
import image11 from '@/assets/SearchImg/11.jpg';
import image12 from '@/assets/SearchImg/12.jpg';
import image13 from '@/assets/SearchImg/13.png';
import image14 from '@/assets/SearchImg/14.png';
import image15 from '@/assets/SearchImg/15.jpg';

const ImageGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const navigate = useNavigate();

  const imageData = [
    { id: 1, imageUrl: image1, title: "Image Title 1", popUpStoreNo: "123" },
    { id: 2, imageUrl: image2, title: "Image Title 2", popUpStoreNo: "124" },
    { id: 3, imageUrl: image3, title: "Image Title 3", popUpStoreNo: "125" },
    { id: 4, imageUrl: image4, title: "Image Title 4", popUpStoreNo: "126" },
    { id: 5, imageUrl: image5, title: "Image Title 5", popUpStoreNo: "127" },
    { id: 6, imageUrl: image6, title: "Image Title 6", popUpStoreNo: "128" },
    { id: 7, imageUrl: image7, title: "Image Title 7", popUpStoreNo: "129" },
    { id: 8, imageUrl: image8, title: "Image Title 8", popUpStoreNo: "130" },
    { id: 9, imageUrl: image9, title: "Image Title 9", popUpStoreNo: "131" },
    { id: 10, imageUrl: image10, title: "Image Title 10", popUpStoreNo: "132" },
    { id: 11, imageUrl: image11, title: "Image Title 11", popUpStoreNo: "133" },
    { id: 12, imageUrl: image12, title: "Image Title 12", popUpStoreNo: "134" },
    { id: 13, imageUrl: image13, title: "Image Title 13", popUpStoreNo: "135" },
    { id: 14, imageUrl: image14, title: "Image Title 14", popUpStoreNo: "136" },
    { id: 15, imageUrl: image15, title: "Image Title 15", popUpStoreNo: "137" },
  ];

  useEffect(() => {
    const filtered = imageData.filter(item =>
      item.popUpStoreNo.includes(searchTerm)
    );
    setFilteredImages(filtered);
  }, [searchTerm]);

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
                src={item.imageUrl}
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
