import React from 'react';
import { useNavigate } from 'react-router-dom';

const QRPayPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white text-gray-800">
      {/* Header */}
      <div className="flex w-full items-center justify-between bg-blue-500 p-4">
        <div className="rounded-full bg-white px-2 py-1 text-lg font-semibold text-blue-500">
          Sol-Pay
        </div>
        <div className="text-2xl text-white">QR-Code</div>
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="ml-4 cursor-pointer border-none bg-transparent text-white focus:outline-none"
          >
            ✖️
          </button>
        </div>
      </div>

      {/* QR Scan Area */}
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="relative h-72 w-72 rounded-lg border-4 border-blue-500 bg-gray-100">
          {/* 이곳에 카메라 기능 또는 QR 코드 스캔 기능 추가 */}
        </div>
        <div className="mt-2 text-xl font-semibold text-gray-800">
          QR코드를 스캔하세요
        </div>
      </div>
    </div>
  );
};

export default QRPayPage;
