import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { RecoilRoot } from "recoil";
import MainPage from "./pages/Main/MainPage";
import RankPage from "./pages/Rank/RankPage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import SearchPage from "./pages/Search/SearchPage";
import DetailPage from "./pages/Detail/DetailPage";
import RafflePage from "./pages/Raffle/RafflePage";
import RaffleDetailPage from './pages/Raffle/RaffleDetailPage';
import ProfilePage from "./pages/Profile/ProfilePage";
import ReservationPage from './pages/Profile/ReservationPage'
// import WishlistPage from "./pages/Profile/WishListPage";
import Navbar from './components/Navbar';
import ReserveDetailPage from "./pages/Profile/ReserveDetailPage";
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
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
            </Routes>
          </div>
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
