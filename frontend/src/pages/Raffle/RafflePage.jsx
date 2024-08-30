import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UpperBar from '../../components/UpperBar';
import RaffleBanner from '../../assets/RaffleImg/RaffleBanner.png';
import RaffleCard from './components/RaffleCard';

const RafflePage = () => {
  const [raffles, setRaffles] = useState(null);
  const mainRef = useRef(null);
  useEffect(() => {
    const ScrollToDiv = () => {
      // 참조된 div가 있으면 그 위치로 스크롤 이동
      if (mainRef.current) {
        mainRef.current.scrollIntoView();
      }
    };
    const fetchData = async () => {
      // 래플 전체 리스트 조회 함수
      axios
        .get('https://solpop.xyz/api/v1/raffle', {})
        .then((response) => {
          console.log('성공완료!', response.data);
          setRaffles(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    ScrollToDiv();
    fetchData();
  }, []);

  return (
    <div className="my-3 min-h-lvh" ref={mainRef}>
      <UpperBar />
      <img
        src={RaffleBanner}
        alt="래플페이지 배너"
        className="my-3 aspect-[1/1] w-full"
      />
      <div>
        {raffles && raffles.length != 0 ? (
          raffles.map((raffle) => (
            <RaffleCard key={raffle.raffleId} raffle={raffle} />
          ))
        ) : (
          <div className="flex items-center justify-center text-xl h-72 text-stone-700">
            <p>현재 진행중인 래플이 없습니다.</p>
          </div>
        )}
      </div>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default RafflePage;
