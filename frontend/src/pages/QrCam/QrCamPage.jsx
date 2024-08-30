import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const QRPayPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Set constraints to ensure compatibility with mobile devices
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' }, // Prefer rear-facing camera
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera', error);
      }
    };

    startCamera();

    return () => {
      // Stop the camera stream when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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
        <div className="relative h-72 w-72 rounded-lg border-4 border-blue-500 bg-gray-100 sm:h-96 sm:w-96">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="mt-2 text-xl font-semibold text-gray-800">
          QR코드를 스캔하세요
        </div>
      </div>
    </div>
  );
};

export default QRPayPage;
