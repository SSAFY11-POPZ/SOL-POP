import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation } from 'swiper/modules';
import axios from 'axios';

// 이미지 import (경로를 컴포넌트 위치에 맞춰 수정)
import menuImage from '../img/menu.png'; // 상대 경로로 이미지 import

const slideData = [
  { label: '전체', imagePath: menuImage },
  { label: 'SOL' },
  { label: '코스메틱' },
  { label: '더현대' },
  { label: '성수' },
  { label: '광주' },
  { label: '동명동' }
];

const Carousel_sub = () => {
  const [images, setImages] = useState([]);
  const [activeSlide, setActiveSlide] = useState('전체');

  const baseURL = 'https://solpop.xyz'; // 기본 URL을 설정합니다.

  const fetchImages = async (tag) => {
    const fetchUrl = `${baseURL}/api/v1/store/main/slide?keyword=${tag}`;
    try {
      const response = await axios.get(fetchUrl);
      const data = response.data;
      setImages(data.length ? data : []);
    } catch (error) {
      console.error(`Error fetching data: 실패 sub_Carousel ${tag}`, error);
      setImages([]); // 에러 발생 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    fetchImages('전체');
  }, []);

  const handleSlideClick = (tag) => {
    setActiveSlide(tag);
    fetchImages(tag);
  };

  const handleImageClick = (storeId) => {
    window.location.href = `${baseURL}/detail/${storeId}`;
  };

  return (
    <div className="w-full h-[250px] mb-5 overflow-hidden">
      {/* 첫 번째 Swiper: slidesPerView는 기본값 */}
      <Swiper 
        className="h-[55px]"
        spaceBetween={15}
        slidesPerView={'auto'}
      >
        {slideData.map((slide, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleSlideClick(slide.label)}
            className={`flex justify-center items-center w-[70px] h-[35px] border rounded-full cursor-pointer transition-all duration-300 ${
              activeSlide === slide.label ? 'border-blue-600 bg-white text-blue-600 font-bold' : ""
            }`}
          >
            {slide.imagePath ? (
              <div className="flex items-center text-sm">
                <img src={slide.imagePath} alt={slide.label} className="mr-1 w-[18px] h-[18px]" />
                <span className={`${activeSlide === slide.label ? 'text-blue-600' : ''} hover:bg-gray-200 `}>{slide.label}</span>
              </div>
            ) : (
              <span className="text-sm">{slide.label}</span>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 두 번째 Swiper: slidesPerView={2.5} 적용 */}
      <Swiper
        spaceBetween={15}
        slidesPerView={2.5}
        modules={[Navigation, Autoplay]}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: true,
        }}
        speed={500}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div onClick={() => handleImageClick(image.storeId)} className="cursor-pointer">
            <div className="relative w-full pt-[100%]">
              <img
                src={image.storeThumbnailUrl}
                alt={`Slide ${index + 1}`}
                className="absolute top-0 left-0 object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-800 to-transparent"></div>
            </div>
              <div className="absolute w-full text-xs font-medium text-white truncate bottom-2 left-2">{image.storeName}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_sub;
