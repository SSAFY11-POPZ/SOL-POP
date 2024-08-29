import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';

const Carousel_main = ({ spaceBetween = 10, slidesPerView = 1 }) => {
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState(false);
  const baseURL = 'https://solpop.xyz';

  const fetchUrl = `${baseURL}/api/v1/store/main/carousel`;

  const storeNameStyle = {
    position: 'absolute',
    bottom: '45px',
    right: '20px',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
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

        // 슬라이드 수가 2개 이하일 때 데이터를 복제하여 4개 이상의 슬라이드로 만듭니다.
        if (data.length < 3) {
          const clonedSlides = [...data, ...data];
          setSlides(clonedSlides);
        } else {
          setSlides(data);
        }
      } catch (error) {
        console.error('Error fetching data: 실패main_Carousel', error);
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
      {slides.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          centeredSlides={true}
          loop={true}
          loopFillGroupWithBlank={true} // 빈 슬라이드로 그룹을 채웁니다.
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          speed={500}
          pagination={{ clickable: true }}
          // navigation={true}
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
      )}
    </div>
  );
};

export default Carousel_main;
