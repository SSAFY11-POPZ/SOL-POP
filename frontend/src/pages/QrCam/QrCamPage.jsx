import React from 'react';
import QrScanner from 'react-qr-scanner';

const QRPayPage = () => {
  const handleScan = (data) => {
    if (data) {
      window.location.href = data; // QR 코드로 리다이렉트
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white text-gray-800">
      {/* 헤더 */}
      <div className="flex w-full items-center justify-between bg-blue-500 p-4">
        <div className="rounded-full bg-white px-2 py-1 text-lg font-semibold text-blue-500">
          Sol-Pay
        </div>
        <div className="text-2xl text-white">QR-Code</div>
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="ml-4 cursor-pointer border-none bg-transparent text-white focus:outline-none"
          >
            ✖️
          </button>
        </div>
      </div>

      {/* QR 스캔 영역 */}
      <div className="flex flex-grow flex-col items-center justify-center">
        <QrScanner
          delay={300}
          style={{ width: '100%', height: 'auto' }}
          onError={handleError}
          onScan={handleScan}
        />
        <div className="mt-2 text-xl font-semibold text-gray-800">
          QR코드를 스캔하세요
        </div>
      </div>
    </div>
  );
};

export default QRPayPage;
