import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import './Caruosel_main.css';

const Carousel_main = ({ spaceBetween, slidesPerView }) => {
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState(false);

  const baseURL = 'https://asdfwrg'; // 기본 URL을 설정합니다.
  // const baseURL = 'http://localhost:5173/'; // 기본 URL을 설정합니다.
  // const baseURL = 'https://solpop.xyz'; // 기본 URL을 설정합니다.

  const fetchUrl = `${baseURL}/api/v1/store/main/carousel`; // 기본 URL에 엔드포인트를 추가합니다.


  
  const defaultSlides = [
    { storeThumbnailUrl: 'src/pages/Main/img/1.JPG', storeName: 'Default Store 1', storeId: 1 },
    { storeThumbnailUrl: 'src/pages/Main/img/2.JPG', storeName: 'Default Store 2', storeId: 2 },
    { storeThumbnailUrl: 'src/pages/Main/img/3.JPG', storeName: 'Default Store 3', storeId: 3 },
    { storeThumbnailUrl: 'src/pages/Main/img/4.JPG', storeName: 'Default Store 4', storeId: 4 },
  ];

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(fetchUrl); // Axios로 GET 요청을 보냅니다.
        let data = response.data;

        // 데이터가 배열이 아닌 경우 배열로 변환합니다.
        if (!Array.isArray(data)) {
          data = [data];
        }

        setSlides(data); // slides 상태에 데이터를 저장합니다.
      } catch (error) {
        console.error('Error fetching data: 실패main_Carousel', error);
        setSlides(defaultSlides); // 에러 발생 시 기본 슬라이드로 설정
        setError(true); // 에러 발생 시 상태를 true로 설정
      }
    };

    fetchSlides();
  }, [fetchUrl]);

  const handleSlideClick = (storeId) => {
    window.location.href = `${baseURL}/detail/${storeId}`; // 클릭 시 해당 Store ID로 이동합니다.
  };

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
          disableOnInteraction: false,
        }}
        speed={500}
        pagination={{ clickable: true }}
        navigation={true}
        onClick={(swiper, event) => {
          // Swiper 클릭 이벤트에서 SwiperSlide의 index를 가져옴
          const clickedSlide = swiper.clickedSlide;
          if (clickedSlide) {
            const storeId = slides[swiper.clickedIndex].storeId;
            handleSlideClick(storeId);
          }
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide 
            className='main_SwiperSlide' 
            key={index}
          >
            <img src={slide.storeThumbnailUrl} alt={`Slide ${index + 1}`} />
            {slide.storeName && <div className="store-name-overlay">{slide.storeName}</div>}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_main;
