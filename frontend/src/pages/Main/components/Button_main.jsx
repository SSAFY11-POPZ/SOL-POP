import React from 'react';

// const baseURL= 'https://solpop.xyz'; // 기본 URL을 설정합니다.
const baseURL = 'http://localhost:5173'; // 슬래시 제거

const buttonsData = [
  {
    imagePath: 'src/pages/Main/img/like.png',
    linkUrl: `${baseURL}/rank`, // 템플릿 문자열로 설정
    altText: 'Example Image 1',
    label: '인기',
    width: '40px',
    height: '40px',
  },
  {
    imagePath: 'src/pages/Main/img/calendar.png',
    linkUrl: `${baseURL}/calendar`, // 2번 버튼 URL 확인
    altText: 'Example Image 2',
    label: '일정',
    width: '40px',
    height: '40px',
  },
  {
    imagePath: 'src/pages/Main/img/raffle.png',
    linkUrl: `${baseURL}/raffle`, // 3번 버튼 URL 확인
    altText: 'Example Image 3',
    label: '래플',
    width: '40px',
    height: '40px',
  },
  {
    imagePath: 'src/pages/Main/img/b4.JPG',
    linkUrl: 'shinhanSol://',
    fallbackUrl: 'https://sol.shinhan.com/sup/common/callSupInstallService.jsp?',
    altText: 'Open Shinhan Card SuperSOL',
    fullSize: true, // 이미지가 버튼을 가득 채우도록 설정
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
      window.location.href = fallbackUrl || linkUrl; // fallbackUrl이 없으면 linkUrl로 이동
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '450px', margin: '15px' }}>
      {buttonsData.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.linkUrl, button.fallbackUrl)}
          style={{
            width: '80px', // 버튼 크기
            height: '80px', // 버튼 크기
            border: '2px solid #ccc',
            borderRadius: '10px',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0, // Padding 제거
            margin: '5px', // 각 버튼의 margin을 5px로 설정
            overflow: 'hidden', // 버튼 영역을 넘는 이미지 부분 숨기기
          }}
        >
          <img
            src={button.imagePath}
            alt={button.altText}
            style={{
              width: button.fullSize ? '100%' : button.width, // 4번 버튼일 때 전체 버튼 크기
              height: button.fullSize ? '100%' : button.height, // 4번 버튼일 때 전체 버튼 크기
              objectFit: button.fullSize ? 'cover' : 'initial', // 4번 버튼일 때 'cover'로 설정
              borderRadius: '10px', // 버튼과 동일한 borderRadius 적용
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
