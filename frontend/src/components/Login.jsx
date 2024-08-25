import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    e.preventDefault();  // 기본 폼 제출 동작을 방지
    navigate('/register');  // Register 페이지로 이동
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="flex flex-col items-center space-y-4" onSubmit={handleLoginClick}>
        {/* 로고 이미지 추가 */}
        <img src="/logo308.png" alt="Logo" className="w-20 h-auto mb-3" />
        
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
        <button
          type="submit"
          className="bg-[#0046FF]  text-white py-2 px-4 rounded w-64"
        >
          로그인
        </button>
        <div className="flex space-x-4">
          <a href="#" className="text-sm text-gray-600" onClick={() => navigate('/register')}>회원가입</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
