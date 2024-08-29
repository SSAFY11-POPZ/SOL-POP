import React from 'react';

// 이미지 import
import likeImg from '../img/bestImg.png';
import calendarImg from '../img/calendarImg.png';
import raffleImg from '../img/raffleImg.png';
import b4Img from '../img/sol.png';

const baseURL = 'https://solpop.xyz';

const buttonsData = [
  {
    imagePath: likeImg,
    linkUrl: `${baseURL}/rank`,
    altText: 'Example Image 1',
    label: '인기',
  },
  {
    imagePath: calendarImg,
    linkUrl: `${baseURL}/calendar`,
    altText: 'Example Image 2',
    label: '일정',
  },
  {
    imagePath: raffleImg,
    linkUrl: `${baseURL}/raffle`,
    altText: 'Example Image 3',
    label: '래플',
  },
  {
    imagePath: b4Img,
    linkUrl: 'shinhanSol://',
    fallbackUrl: 'https://sol.shinhan.com/sup/common/callSupInstallService.jsp?',
    altText: 'Open Shinhan Card SuperSOL',
    fullSize: true,
  },
];

const Buttons_main = () => {
  const handleButtonClick = (linkUrl, fallbackUrl) => {
    if (/iPhone|iPod|iPad|Android|BlackBerry/i.test(navigator.userAgent)) {
      window.location.href = linkUrl;

      if (fallbackUrl) {
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = fallbackUrl;
          }
        }, 1000);
      }
    } else {
      window.location.href = fallbackUrl || linkUrl;
    }
  };

  return (
    <div className="flex justify-even">
      {buttonsData.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.linkUrl, button.fallbackUrl)}
          className="relative flex flex-col items-center justify-start w-20 h-20 mx-1 border border-gray-100 cursor-pointer border-1 rounded-xl hover:bg-gray-200"
        >
          <img
            src={button.imagePath}
            alt={button.altText}
            className={`${button.fullSize ? "w-full h-full rounded-xl": "w-[60px] h-[60px]"} `}
          />
          {button.label && (
            <span className="absolute bottom-1 text-[10px] font-bold">
              {button.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Buttons_main;
