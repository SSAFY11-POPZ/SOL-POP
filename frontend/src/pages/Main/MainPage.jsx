import React from 'react';
import Carousel_main from './components/Carousel_main';
import Buttons_main from './components/Button_main';
import Carousel_sub from './components/Carousel_sub';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main">
      <Carousel_main 
        spaceBetween={30}
        slidesPerView={1.2}
        fetchUrl="https://api.example.com/images"
      />
      <div className="button_main1">
        <Buttons_main />
      </div>
      <div className="carasoul_sub1">
        <Carousel_sub />
      </div>
    </div>
  );
}

export default MainPage;
