import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTokenValidity } from '../../utils/axios';
import Swal from 'sweetalert2';


import QRCode from 'qrcode';

const SolPayPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // 유저정보
  const [amount, setAmount] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem('accessToken')) {
          navigate('/login');
          return;
        }
        // 토큰이 유효한지 검증
        const response = await checkTokenValidity();
        console.log(response);
        if (!response || response.status !== 200) {
          navigate('/login');
          console.log(response);
          return;
        }

        // if (!response.result) {
        //   navigate("/login");
        //   return;
        // }

        // 토큰이 유효하다면 반환된 데이터를 user에 할당
        console.log(response.data.data);
        setUser(response.data.data);
      
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire(
          'ERROR',
          '오류가 발생했습니다. 다시 로그인해주세요.',
          'warning',
        );
        navigate('/login');
      }
    }
    fetchData();
  }, []);


  const baseUrl = 'https://solpop.xyz';

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
      const url = `${baseUrl}/solpay/?amount=${numericAmount}`;
      try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'userId': user.userId,  // userId를 헤더에 추가
            },
        });

        if (!response.ok) {
            throw new Error('네트워크 응답이 실패했습니다');
        }

        const qrCodeDataUrl = await QRCode.toDataURL(await response.text());
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
