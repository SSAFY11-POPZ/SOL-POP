import React from 'react';
import Carousel_main from './components/Carousel_main';
import Buttons_main from './components/Button_main';
import Carousel_sub from './components/Carousel_sub';

function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="w-full">
        <Carousel_main 
          spaceBetween={30}
          slidesPerView={1.2}
        />
      </div>
      <div className="w-full flex justify-center" style={{ marginBottom: '-5px' }}>
        <Buttons_main />
      </div>
      <div className="w-full">
        <Carousel_sub />
      </div>
    </div>
  );
}

export default MainPage;
