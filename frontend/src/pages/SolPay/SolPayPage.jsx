import React, { useState } from 'react';
import QRCode from 'qrcode';

const SolPayPage = () => {
  const [amount, setAmount] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');

  const baseUrl = 'https://solpop.xyz'; // baseurl을 실제 값으로 교체하세요

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(value)) {
      setAmount(formatNumber(value));
    }
  };

  const handleGenerateQr = async () => {
    const numericAmount = amount.replace(/,/g, '');
    if (numericAmount) {
      const url = `${baseUrl}/api/v1/solpay?amount=${numericAmount}`;
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        setQrImageUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Error generating QR code', error);
      }
    } else {
      setQrImageUrl('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-700">
          SolPay
        </h1>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-semibold text-gray-600"
            htmlFor="amount"
          >
            결제 금액
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleInputChange}
            className="w-full rounded-lg border px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="금액을 입력하세요"
          />
        </div>
        <button
          onClick={handleGenerateQr}
          className="w-full rounded-lg bg-indigo-500 py-2 text-white transition duration-200 hover:bg-indigo-600"
        >
          Generate QR Code
        </button>
        {qrImageUrl && (
          <div className="mt-6 flex justify-center">
            <img src={qrImageUrl} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SolPayPage;
