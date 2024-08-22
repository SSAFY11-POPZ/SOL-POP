import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
// import { useState } from "react";
import './components/Navbar.css';

import MainPage from "./pages/Main/MainPage";
import RankPage from "./pages/Rank/RankPage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import SearchPage from "./pages/Search/SearchPage"; 
import DetailPage from "./pages/Detail/DetailPage";
import RafflePage from "./pages/Raffle/RafflePage";
import RaffleDetailPage from './pages/Raffle/RaffleDetailPage';
import ProfilePage from "./pages/Profile/ProfilePage";
import Navbar from './components/Navbar';

function App() {
  const imageData = [
    { id: 1, imageUrl: "assets/SearchImg/1.png", title: "Image Title 1" },
    { id: 2, imageUrl: "assets/SearchImg/2.png", title: "Image Title 2" },
    { id: 3, imageUrl: "assets/SearchImg/3.jpg", title: "Image Title 3" },
    { id: 4, imageUrl: "assets/SearchImg/4.jpg", title: "Image Title 4" },
    { id: 5, imageUrl: "assets/SearchImg/5.jpeg", title: "Image Title 5" },
    { id: 6, imageUrl: "assets/SearchImg/6.jpg", title: "Image Title 6" },
    { id: 7, imageUrl: "assets/SearchImg/7.jpg", title: "Image Title 7" },
    { id: 8, imageUrl: "assets/SearchImg/8.jpg", title: "Image Title 8" },
    { id: 9, imageUrl: "assets/SearchImg/9.jpg", title: "Image Title 9" },
    { id: 10, imageUrl: "assets/SearchImg/10.png", title: "Image Title 10" },
    { id: 11, imageUrl: "assets/SearchImg/11.jpg", title: "Image Title 11" },
    { id: 12, imageUrl: "assets/SearchImg/12.jpg", title: "Image Title 12" },
    { id: 13, imageUrl: "assets/SearchImg/13.png", title: "Image Title 13" },
    { id: 14, imageUrl: "assets/SearchImg/14.png", title: "Image Title 14" },
    { id: 15, imageUrl: "assets/SearchImg/15.jpg", title: "Image Title 15" },
  ];

  return (
    <RecoilRoot>
      {/* <Router> */}
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
              <Route path="/search" element={<SearchPage imageData={imageData} />} />
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
      {/* </Router> */}
    </RecoilRoot>
  );
}

export default App;
