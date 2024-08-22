import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation } from 'swiper/modules';
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
  { url: 'src/pages/Main/img/subc1.jpg' },
  { url: 'src/pages/Main/img/subc2.jpg' },
  { url: 'src/pages/Main/img/subc3.jpg' },
  { url: 'src/pages/Main/img/subc4.jpg' },
  { url: 'src/pages/Main/img/subc5.jpg' },
];

const Carousel_sub = () => {
  const [images, setImages] = useState(defaultImages);
  const [activeSlide, setActiveSlide] = useState('전체');

  const fetchImages = async (tag) => {
    try {
      const response = await fetch(`https://api.example.com/images?tag=${tag}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images.length ? data.images : defaultImages);
      } else {
        setImages(defaultImages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setImages(defaultImages);
    }
  };

  const handleSlideClick = (tag) => {
    setActiveSlide(tag);
    fetchImages(tag);
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
            <img src={image.url} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel_sub;
