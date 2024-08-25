import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

import UpperBar from "../../components/UpperBar";
import RaffleBanner from '../../assets/RaffleImg/RaffleBanner.png';
import RaffleTest from '../../assets/RaffleImg/RaffleTest.png';
import RaffleCard from "./components/RaffleCard";


const RafflePage = () => {
  const [raffles, setRaffles] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios({
        method:'get',
        url:"https://popz.life/api/v1/raffle",
      })
      .then(response => {
        console.log("성공완료!", response.data)
        setRaffles(response.data)
      })
      .catch(error => {
        console.log(error)
      })
    };
    fetchData();
  },[]);

  // axios 함수 작성 필요
  return (
    <div className="my-3 min-h-lvh">
      <UpperBar />
      <img src={RaffleBanner} alt="래플페이지 배너" className="aspect-[1/1] w-full my-3 "/>
      <div>
        { raffles && raffles.length !=0 ? raffles.map((raffle) => (
          <RaffleCard key={raffle.raffleId} raffle={raffle} />
        )) : 
        <div className="h-72 text-xl flex items-center justify-center text-stone-700">
          <p>현재 진행중인 래플이 없습니다.</p>
        </div>}
      </div>
      {/* navbar에 의해 가려지는 부분 처리하기! */}
      <div className="h-[100px]"></div>
    </div>
  );
};

export default RafflePage;
