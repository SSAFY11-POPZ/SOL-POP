import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import cameraIcon from './img/1.png'; // 이미지 임포트

const QRPayPage = () => {
  const [facingMode, setFacingMode] = useState('environment'); // 후방 카메라로 초기화

  const handleScan = (data) => {
    if (data) {
      window.location.href = data; // QR 코드로 리다이렉트
    }
  };

  const handleError = (err) => {
    console.error('QR 스캐너 오류:', err);
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === 'environment' ? 'user' : 'environment',
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white text-gray-800">
      {/* 왼쪽 상단의 버튼형 이미지 */}
      <div className="absolute left-4 top-4 z-10">
        <button onClick={toggleCamera} className="focus:outline-none">
          <img src={cameraIcon} alt="Camera Icon" className="h-8 w-8" />
        </button>
      </div>

      {/* 중앙의 Sol-Pay */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-center bg-blue-500 p-4">
        <div className="rounded-full bg-white px-4 py-2 text-lg font-semibold text-blue-500">
          Sol-Pay
        </div>
      </div>

      {/* QR 스캔 영역 */}
      <div className="flex flex-grow flex-col items-center justify-center">
        <QrScanner
          delay={300}
          style={{ width: '100%', height: 'auto' }}
          onError={handleError}
          onScan={handleScan}
          constraints={{
            video: { facingMode: facingMode }, // 'user'는 전방 카메라, 'environment'는 후방 카메라를 의미
          }}
        />
        <div className="mt-2 text-xl font-semibold text-gray-800">
          QR코드를 스캔하세요
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="absolute right-0 top-0 p-4">
        <button
          onClick={() => window.history.back()}
          className="ml-4 cursor-pointer border-none bg-transparent text-white focus:outline-none"
        >
          ✖️
        </button>
      </div>
    </div>
  );
};

export default QRPayPage;
