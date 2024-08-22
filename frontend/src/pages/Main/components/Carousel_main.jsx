import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import './Caruosel_main.css';

const Carousel_main = ({ spaceBetween, slidesPerView, fetchUrl }) => {
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) { 
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSlides(data.images); // API에서 받은 이미지 데이터 설정
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      }
    };

    fetchSlides();
  }, [fetchUrl]);

  const defaultSlides = [
    'src/pages/Main/img/1.JPG',
    'src/pages/Main/img/2.JPG',
    'src/pages/Main/img/3.JPG',
    'src/pages/Main/img/4.JPG',
  ];

  return (
    <div className="main-carousel-container">
      <Swiper 
        className='main_Swiper'
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: true,
        }}
        speed={500}
        pagination={{ clickable: true }}
        navigation={true}
      >
        {(error ? defaultSlides : slides).map((slide, index) => (
          <SwiperSlide className='main_SwiperSlide' key={index}>
            <img src={error ? slide : slide.url} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_main;
