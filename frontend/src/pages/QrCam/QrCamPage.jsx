import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRPayPage = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        videoRef.current.play();
      })
      .catch((err) => {
        console.error('Error accessing camera: ', err);
      });

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        selectedDeviceId = videoInputDevices[0].deviceId;
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setScanResult(result.getText());
              window.location.href = result.getText();
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          },
        );
      })
      .catch((err) => {
        console.error('Error listing video devices: ', err);
      });

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-white text-gray-800">
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

      <div className="flex flex-grow flex-col items-center justify-center">
        <video
          ref={videoRef}
          className="h-72 w-72 border-4 border-blue-500 bg-gray-100"
        ></video>
        <div className="mt-2 text-xl font-semibold text-gray-800">
          QR코드를 스캔하세요
        </div>
        {scanResult && (
          <div className="mt-4 text-sm text-gray-600">
            스캔된 URL: {scanResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRPayPage;
