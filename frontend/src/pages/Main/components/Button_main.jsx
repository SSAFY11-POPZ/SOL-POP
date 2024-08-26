import React from 'react';

const baseURL = 'https://solpop.xyz'; // 기본 URL을 설정합니다.

const buttonsData = [
  {
    imagePath: 'src/pages/Main/img/b1.JPG',
    linkUrl: `${baseURL}/rank`,
    altText: 'Example Image 1',
    label: '추천',
    width: '50px',
    height: '50px',
  },
  {
    imagePath: 'src/pages/Main/img/b2.JPG', 
    linkUrl: `${baseURL}/calendar`,
    altText: 'Example Image 2',
    label: '일정',
    width: '50px',
    height: '50px',
  },
  {
    imagePath: 'src/pages/Main/img/b3.JPG',
    linkUrl: `${baseURL}/raffle`,
    altText: 'Example Image 3',
    label: '알림',
    width: '50px',
    height: '50px',
  },
  {
    imagePath: 'src/pages/Main/img/b4.JPG',
    linkUrl: 'shinhanSol://',
    fallbackUrl: 'https://sol.shinhan.com/sup/common/callSupInstallService.jsp?',
    altText: 'Open Shinhan Card SuperSOL',
    label: '결제',
    width: '50px',
    height: '50px',
  },
];

const Buttons_main = () => {
  const handleButtonClick = (linkUrl, fallbackUrl) => {
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
      window.location.href = linkUrl;

      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = fallbackUrl;
        }
      }, 1000);
    } else {
      window.location.href = fallbackUrl;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
      {buttonsData.map((button, index) => (
        <button 
          key={index}
          onClick={() => handleButtonClick(button.linkUrl, button.fallbackUrl)}
          style={{ 
            border: '2px solid #ccc',
            borderRadius: '10px',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
          }}
        >
          <img 
            src={button.imagePath} 
            alt={button.altText} 
            style={{ 
              width: button.width, 
              height: button.height, 
            }} 
          />
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Buttons_main;
