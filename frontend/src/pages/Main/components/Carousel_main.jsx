import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';

const Carousel_main = ({ spaceBetween = 10, slidesPerView = 1.3 }) => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // 활성 슬라이드의 인덱스를 저장하는 상태
  const baseURL = 'https://solpop.xyz';

  const fetchUrl = `${baseURL}/api/v1/store/main/carousel`;

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
          loopFillGroupWithBlank={true}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          speed={500}
          pagination={{ clickable: true }}
          className="relative w-full h-auto"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // 활성 슬라이드 인덱스를 설정
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              onClick={() => handleSlideClick(slide.storeId)}
              className={`relative cursor-pointer transition-transform duration-300 ease-in-out`}
            >
              <img
                src={slide.storeThumbnailUrl}
                alt={`Slide ${index + 1}`}
                className={`${
                  index == activeIndex ? 'scale-100' : 'scale-90'
                } w-[350px] h-[400px] object-cover rounded-lg shadow-md`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Carousel_main;
