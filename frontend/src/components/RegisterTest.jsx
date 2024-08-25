import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTestPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    console.log('회원가입 클릭함')

    // VITE_MANAGER_API_KEY 환경 변수 가져오기
    const apiKey = import.meta.env.VITE_MANAGER_API_KEY;

    const requestData = {
      apiKey: apiKey,
      userId: userId,
    };

    try {
      const response = await fetch('https://finopenapi.ssafy.io/ssafy/api/v1/member/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // 요청이 성공하면 홈으로 이동
        navigate('/');
      } else {
        // 요청이 실패하면 에러 처리
        console.error('Registration failed');
        console.log(error.meta)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBackClick = () => {
    navigate('/Login/');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <button 
        onClick={handleBackClick} 
        className="absolute top-10 left-4 text-black text-2xl font-bold"
      >
        &lt;
      </button>

      <form className="flex flex-col items-center space-y-4" onSubmit={handleRegisterSubmit}>
        <input
          type="text"
          placeholder="사용자 Id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 w-64"
        />
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded w-64"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterTestPage;
