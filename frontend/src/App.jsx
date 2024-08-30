import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import MainPage from './pages/Main/MainPage';
import RankPage from './pages/Rank/RankPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import SearchPage from './pages/Search/SearchPage';
import DetailPage from './pages/Detail/DetailPage';
import RafflePage from './pages/Raffle/RafflePage';
import RaffleDetailPage from './pages/Raffle/RaffleDetailPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ReservationPage from './pages/Profile/ReservationPage';
import WishlistPage from './pages/Profile/WishListPage';
import Navbar from './components/Navbar';
import ReserveDetailPage from './pages/Profile/ReserveDetailPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CompanyPage from './pages/Company/CompanyPage';
import SolpayPage from './pages/SolPay/SolPayPage';
import QRPayPage from './pages/QrCam/QrCamPage';
import './index.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Navbar />
        <div className="mx-auto flex max-w-[450px] justify-center">
          <div className="min-h-dvh w-full">
            <Routes>
              {/* 메인페이지 */}
              <Route exact path="/" element={<MainPage />} />
              {/* 인기페이지 */}
              <Route path="/rank" element={<RankPage />} />
              {/* 캘린더페이지 */}
              <Route path="/calendar" element={<CalendarPage />} />
              {/* 검색페이지 */}
              <Route path="/search" element={<SearchPage />} />
              {/* 래플 전체페이지 */}
              <Route path="/raffle" element={<RafflePage />} />
              {/* 래플 상세페이지 */}
              <Route path="/raffle/:raffleId" element={<RaffleDetailPage />} />
              {/* 상세페이지 */}
              <Route path="/detail/:id" element={<DetailPage />} />
              {/* 마이페이지 */}
              <Route path="/profile" element={<ProfilePage />} />
              {/* 내 찜목록 확인 페이지 */}
              <Route path="/wishlist" element={<WishlistPage />} />
              {/* 내 전체 예약목록 페이지*/}
              <Route
                path="/profile/reservation"
                element={<ReservationPage />}
              />
              {/* 내 예약 상세 페이지*/}
              <Route
                path="/profile/reservation/:reserveId"
                element={<ReserveDetailPage />}
              />
              {/* 로그인 페이지 */}
              <Route path="/login" element={<LoginPage />} />
              {/* 회원가입 페이지 */}
              <Route path="/register" element={<RegisterPage />} />
              {/* 기업 페이지 */}
              <Route path="/company" element={<CompanyPage />} />
              {/* Qr 생성 페이지 */}
              <Route path="/solpay" element={<SolpayPage />} />
              {/* Qr 인식 페이지 */}
              <Route path="/qrcam" element={<QRPayPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
