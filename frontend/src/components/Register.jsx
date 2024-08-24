import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    navigate('/');
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
          placeholder="이름"
          className="border p-2 w-64"
        />
        <input
          type="text"
          placeholder="아이디"
          className="border p-2 w-64"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="border p-2 w-64"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="border p-2 w-64"
        />
        <input
          type="email"
          placeholder="이메일"
          className="border p-2 w-64"
        />
        <input
          type="tel"
          placeholder="휴대폰 번호"
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

export default RegisterPage;
