import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation } from 'swiper/modules';
import axios from 'axios';
import './Caruosel_sub.css';

const slideData = [
  { label: '전체', imagePath: 'src/pages/Main/img/sub1.JPG' },
  { label: 'SOL' },
  { label: '코스메틱' },
  { label: '더 현대' },
  { label: '성수' },
  { label: '광주' },
  { label: '동명동' }
];

const defaultImages = [
  { storeThumbnailUrl: 'src/pages/Main/img/subc1.jpg', storeName: 'Default Store 1', storeId: 1 },
  { storeThumbnailUrl: 'src/pages/Main/img/subc2.jpg', storeName: 'Default Store 2', storeId: 2 },
  { storeThumbnailUrl: 'src/pages/Main/img/subc3.jpg', storeName: 'Default Store 3', storeId: 3 },
  { storeThumbnailUrl: 'src/pages/Main/img/subc4.jpg', storeName: 'Default Store 4', storeId: 4 },
  { storeThumbnailUrl: 'src/pages/Main/img/subc5.jpg', storeName: 'Default Store 5', storeId: 5 },
];

const Carousel_sub = () => {
  const [images, setImages] = useState(defaultImages);
  const [activeSlide, setActiveSlide] = useState('전체');

  // const baseURL = 'https://asdfwrg'; // 기본 URL을 설정합니다.
  // const baseURL = 'http://localhost:5173/'; // 기본 URL을 설정합니다.
  const baseURL = 'https://solpop.xyz'; // 기본 URL을 설정합니다.



  const fetchImages = async (tag) => {

    
    const fetchUrl = `${baseURL}/api/v1/store/main/slide?keyword=${tag}`; // fetchUrl을 tag에 따라 동적으로 생성
    try {
      const response = await axios.get(fetchUrl); // 동적으로 생성된 fetchUrl을 사용해 GET 요청
      const data = response.data;
      // 데이터를 API의 응답 형식에 맞게 처리합니다.
      setImages(data.length ? data : defaultImages);
    } catch (error) {
      console.error('Error fetching data: 실패 sub_Carousel', error);
      setImages(defaultImages); // 요청 실패 시 기본 이미지를 설정합니다.
    }
  };
  useEffect(() => {
    // 컴포넌트가 마운트될 때 '전체'로 이미지 조회
    fetchImages('전체');
  }, []);

  const handleSlideClick = (tag) => {
    setActiveSlide(tag);
    fetchImages(tag);
  };

  const handleImageClick = (storeId) => {
    window.location.href = `${baseURL}/detail/${storeId}`; // 클릭 시 해당 Store ID로 이동합니다.
  };

  return (
    <div className="sub-carousel-container">
      <Swiper
        className='sub_Swiper1'
        spaceBetween={15}
        slidesPerView={'auto'}
      >
        {slideData.map((slide, index) => (
          <SwiperSlide
            key={index}
            className={`sub_SwiperSlide ${activeSlide === slide.label ? 'active' : ''}`}
            onClick={() => handleSlideClick(slide.label)}
          >
            {slide.imagePath ? (
              <div className="slide-with-image">
                <img src={slide.imagePath} alt={slide.label} className="slide-image" />
                <span className='span1'>{slide.label}</span>
              </div>
            ) : (
              <span>{slide.label}</span>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        spaceBetween={15}
        slidesPerView={1.2}
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
            <div onClick={() => handleImageClick(image.storeId)} style={{ cursor: 'pointer' }}>
              <img src={image.storeThumbnailUrl} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              <div className="store-name-overlay">{image.storeName}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_sub;
