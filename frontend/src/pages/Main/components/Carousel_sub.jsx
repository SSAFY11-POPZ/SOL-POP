import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation } from 'swiper/modules';
import axios from 'axios';

const slideData = [
  { label: '전체', imagePath: 'src/pages/Main/img/menu.svg' },
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

const styles = {
  swip1: {
    height: '24px',
  },
  storeNameOverlay: {
    position: 'absolute',
    bottom: '0px',
    left: '10px',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    fontSize: '1.2rem',
  },
  subCarouselContainer: {
    width: '100%',
    height: '250px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  slideWithImage: {
    display: 'flex',
    alignItems: 'center',
  },
  slideImage: {
    marginRight: '8px', // 이미지와 텍스트 사이 간격
  },
  subSwiper1: {
    height: '55px',
  },
  subSwiperSlide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85px',
    height: '40px',
    border: '2px solid #ccc',
    borderRadius: '20px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  subSwiperSlideActive: {
    border: '2px solid #0066ff',
    backgroundColor: '#ffffff',
    color: '#0066ff',
    fontWeight: 'bold',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%', // Maintain aspect ratio
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
};

const Carousel_sub = () => {
  const [images, setImages] = useState(defaultImages);
  const [activeSlide, setActiveSlide] = useState('전체');

  const baseURL = 'https://solpop.xyz'; // 기본 URL을 설정합니다.
  
  const fetchImages = async (tag) => {
    const fetchUrl = `${baseURL}/api/v1/store/main/slide?keyword=${tag}`;
    try {
      const response = await axios.get(fetchUrl);
      const data = response.data;
      setImages(data.length ? data : defaultImages);
    } catch (error) {
      console.error(`Error fetching data: 실패 sub_Carousel ${tag}`, error);
      setImages(defaultImages);
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
    <div style={styles.subCarouselContainer}>
      {/* 첫 번째 Swiper: slidesPerView는 기본값 */}
      <Swiper 
        style={styles.subSwiper1}
        spaceBetween={15}
        slidesPerView={'auto'} // 또는 다른 값으로 설정 가능
      >
        {slideData.map((slide, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleSlideClick(slide.label)}
            style={activeSlide === slide.label ? { ...styles.subSwiperSlide, ...styles.subSwiperSlideActive } : styles.subSwiperSlide}
          >
            {slide.imagePath ? (
              <div style={styles.slideWithImage}>
                <img src={slide.imagePath} alt={slide.label} style={{ ...styles.slideImage, width: '18px', height: '18px' }} />
                <span style={{ color: activeSlide === slide.label ? '#0066ff' : 'inherit' }}>{slide.label}</span>
              </div>
            ) : (
              <span>{slide.label}</span>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 두 번째 Swiper: slidesPerView={2.5} 적용 */}
      <Swiper
        spaceBetween={15}
        slidesPerView={2.5} // 2.5 slides visible
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
              <div style={styles.imageWrapper}>
                <img src={image.storeThumbnailUrl} alt={`Slide ${index + 1}`} style={styles.image} />
              </div>
              <div style={styles.storeNameOverlay}>{image.storeName}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_sub;
