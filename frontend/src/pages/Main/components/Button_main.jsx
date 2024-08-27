import React from 'react';

// 이미지 import

import likeImg from '../img/like.png';
import calendarImg from '../img/calendar.png';
import raffleImg from '../img/raffle.png';
import b4Img from '../img/b4.jpg';

const baseURL= 'https://solpop.xyz';

const buttonsData = [
  {
    imagePath: likeImg,
    linkUrl: `${baseURL}/rank`, // 템플릿 문자열로 설정
    altText: 'Example Image 1',
    label: '인기',
    width: '40px',
    height: '40px',
  },
  {
    imagePath: calendarImg,
    linkUrl: `${baseURL}/calendar`,
    altText: 'Example Image 2',
    label: '일정',
    width: '40px',
    height: '40px',
  },
  {
    imagePath: raffleImg,
    linkUrl: `${baseURL}/raffle`,
    altText: 'Example Image 3',
    label: '래플',
    width: '40px',
    height: '40px',
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
    <div style={{ display: 'flex', justifyContent: 'center', width: '450px', margin: '15px' }}>
      {buttonsData.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.linkUrl, button.fallbackUrl)}
          style={{
            width: '80px',
            height: '80px',
            border: '2px solid #ccc',
            borderRadius: '10px',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            margin: '5px',
            overflow: 'hidden',
          }}
        >
          <img
            src={button.imagePath}
            alt={button.altText}
            style={{
              width: button.fullSize ? '100%' : button.width,
              height: button.fullSize ? '100%' : button.height,
              objectFit: button.fullSize ? 'cover' : 'initial',
              borderRadius: '10px',
            }}
          />
          {button.label && (
            <span style={{ marginTop: '0px', fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
              {button.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Buttons_main;
