import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';

const Carousel_main = ({ spaceBetween = 10, slidesPerView = 1.2 }) => {
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState(false);
  const baseURL = 'https://asdfwrg';
  // const baseURL = 'https://solpop.xyz';
  const fetchUrl = `${baseURL}/api/v1/store/main/carousel`;

  const defaultSlides = [
    { storeThumbnailUrl: 'src/pages/Main/img/1.JPG', storeName: 'Default Store 1', storeId: 1 },
    { storeThumbnailUrl: 'src/pages/Main/img/2.JPG', storeName: 'Default Store 2', storeId: 2 },
    { storeThumbnailUrl: 'src/pages/Main/img/3.JPG', storeName: 'Default Store 3', storeId: 3 },
    { storeThumbnailUrl: 'src/pages/Main/img/4.JPG', storeName: 'Default Store 4', storeId: 4 },
  ];

  const storeNameStyle = {
    position: 'absolute',
    bottom: '45px',
    right: '20px',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // 흰색 글씨에 그림자 추가
    fontSize: '1.3rem',
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(fetchUrl);
        let data = response.data;

        if (!Array.isArray(data)) {
          data = [data];
        }

        setSlides(data);
      } catch (error) {
        console.error('Error fetching data: 실패main_Carousel', error);
        setSlides(defaultSlides);
        setError(true);
      }
    };

    fetchSlides();
  }, [fetchUrl]);

  const handleSlideClick = (storeId) => {
    window.location.href = `${baseURL}/detail/${storeId}`;
  };

  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        speed={500}
        pagination={{ clickable: true }}
        navigation={true}
        className="relative w-full h-auto"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleSlideClick(slide.storeId)}
            className="relative cursor-pointer main_SwiperSlide"
          >
            <img
              src={slide.storeThumbnailUrl}
              alt={`Slide ${index + 1}`}
              className="w-[350px] h-[400px] object-cover rounded-lg shadow-md"
              style={{ width: '350px', height: '400px' }}
            />
            {slide.storeName && (
              <div style={storeNameStyle}>
                {slide.storeName}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_main;
