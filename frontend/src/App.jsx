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
import Navbar from './components/Navbar';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import RegisterTestPage from './components/RegisterTest';
import './index.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <MainLayout />
      </Router>
    </RecoilRoot>
  );
}

const MainLayout = () => {
  const location = useLocation();

  // '/detail/:id' 경로에 있을 때 Navbar를 숨기기
  const isDetailPage = location.pathname.startsWith("/detail/");

  return (
    <>
      {!isDetailPage && <Navbar />}
      <div className="mx-auto flex max-w-[450px] justify-center">
        <div className="min-h-dvh w-full">
          <Routes>
            <Route exact path="/" element={<MainPage />} />
            <Route path="/rank" element={<RankPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/raffle" element={<RafflePage />} />
            <Route path="/raffle/:raffleId" element={<RaffleDetailPage />} />
            <Route path="/detail/:id" element={<DetailPage />} /> {/* 여기서 Navbar 숨기기 */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/RegisterTest" element={<RegisterTestPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
