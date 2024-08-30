import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: 'https://solpop.xyz', // 백엔드 URL
  withCredentials: true, // 쿠키 전송 설정
});
const api2 = axios.create({
  baseURL: 'https://solpop.xyz', // 백엔드 URL
  withCredentials: true, // 쿠키 전송 설정
});

// API 요청 전에 토큰의 유효성을 확인하는 인터셉터
api.interceptors.request.use(
  async (config) => {

    let token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode(token);

      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
      const exp = decodedToken.exp;
      if (exp <= currentTime) {
        // 토큰이 만료되었으면 갱신 요청
        token = await refreshAccessToken();
        // 안정적으로 토큰 확보를 위한 딜레이 설정
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          throw new Error('Token refresh failed');
        }
      } else {
        // 토큰이 유효하면 기존 토큰 사용
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터에서 401 처리 및 토큰 재발급 시도
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  try {
    const response = await api2.post('/api/v1/auth/refresh-token');
    const newAccessToken = response.data.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {

    // 리프레시 토큰이 만료되었거나 유효하지 않다면 로그아웃 처리 및 로그인 페이지로 리다이렉트
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';  // 로그인 페이지로 리다이렉트
    }

    return null;
  }
}

export async function checkTokenValidity() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  try {
    const response = await api.get('/api/v1/auth/check-token', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response;
  } catch (error) {
    console.error('Token validation error', error);
    return false;
  }
}

export async function logout() {
  try {
    await api.post('/api/v1/auth/logout');
    localStorage.removeItem("accessToken");
  } catch (error) {
    console.error('Failed to logout', error);
  }
}

export default api;
