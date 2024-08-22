import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import MainPage from "./pages/Main/MainPage";
import RankPage from "./pages/Rank/RankPage";
import SearchPage from "./pages/Search/SearchPage";
import RafflePage from "./pages/Raffle/RafflePage";
import RaffleDetailPage from "./pages/Raffle/RaffleDetailPage";
import DetailPage from "./pages/Detail/DetailPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import CalendarPage from "./pages/Calander/CalendarPage";

function App() {
  return (
    <RecoilRoot>
      <Router>
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
          {/* <NavigationBar /> */}
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
