import React from 'react';

const buttonsData = [
  {
    imagePath: 'src/pages/Main/img/b1.JPG',
    linkUrl: 'https://www.naver.com',
    altText: 'Example Image 1',
    label: '캘린더',
    width: '50px',
    height: '50px',
  },
  {
    imagePath: 'src/pages/Main/img/b2.JPG', 
    linkUrl: 'https://www.youtube.com',
    altText: 'Example Image 2',
    label: '일정',
    width: '50px',
    height: '50px',
  },
  {
    imagePath: 'src/pages/Main/img/b3.JPG',
    linkUrl: 'https://www.google.com',
    altText: 'Example Image 3',
    label: '알림',
    width: '50px',
    height: '50px',
  },
  {
    imagePath: 'src/pages/Main/img/b4.JPG',
    linkUrl: 'https://project.shinhan-hackathon.com/',
    altText: 'Example Image 4',
    width: '50px',
    height: '50px',
  },
];

const Buttons_main = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
      {buttonsData.map((button, index) => (
        <button 
          key={index}
          onClick={() => window.location.href = button.linkUrl}
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
