import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginClick = async () => {
    if (email.length === 0 || password.length === 0) {
      Swal.fire({
        icon: 'warning',
        text: '아이디 또는 비밀번호를 입력해주세요.',
      });
      return;
    }
    try {
      const res = await axios.post('https://solpop.xyz/api/v1/auth/login', {
        userId: email,
        password: password,
      });

      localStorage.setItem('accessToken', res.data.data.accessToken);
      Swal.fire({
        icon: 'success',
        title: '로그인 성공!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: 'warning',
        text: '아이디 또는 비밀번호를 확인해주세요.',
      });
    }
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-8 items-center justify-start gap-3 rounded-[10px] p-2.5">
          <svg
            onClick={handleGoBack}
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 13L1 7L7 1"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5">
        <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="flex h-40 items-center justify-center">
            <img src="/logo308.png" alt="Logo" className="mb-3 h-auto w-20" />
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <div>
              <input
                type="text"
                name="email"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={email}
                onChange={(e) => handleEmailChange(e)}
              />
              <label
                htmlFor="email"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
              >
                이메일
              </label>
            </div>
          </div>
          <div className="group relative z-0 mb-6 w-full">
            <input
              type="password"
              name="password"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              value={password}
              onChange={(e) => handlePasswordChange(e)}
            />
            <label
              htmlFor="password"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
            >
              비밀번호
            </label>
          </div>
          <button
            onClick={handleLoginClick}
            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            로그인하기
          </button>
          <button
            className="mx-auto my-3 block w-28"
            onClick={() => navigate('/register')}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
