import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

import UpperBar from "./components/UpperBar";
import raffleBanner from '../../assets/raffleBanner.png'
import RaffleCard from "./components/RaffleCard";

const RafflePage = () => {
  const [raffles, setRaffles] = useState([]);
  const [filteredRaffles, setFilteredRaffles] = useState(raffles);
  const [selected, setSelected] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = () => {
      // axios.get({
      //   method:'get',
      //   url:"url적기!!",
      //   headers: {
      //     'Authorization' : `Bearer token`,
      //   }
      // })
      // .then(response => {
      //   setRaffleList(response.data)
      // })
      // .catch(error => {
      //   console.log(error)
      // })
      
    };
    // fetchData();
    setRaffles([
      {
        "pk": 1,
        "title": "LMC x BE@RBRICK 100% & 400%",
        "price": 100,
        "participants": 1,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 2,
        "title": "Nike Air Jordan 1",
        "price": 200,
        "participants": 2,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 3,
        "title": "Supreme Box Logo Tee",
        "price": 150,
        "participants": 3,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 4,
        "title": "Adidas Yeezy Boost 350 V2",
        "price": 250,
        "participants": 4,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 5,
        "title": "Apple AirPods Pro",
        "price": 300,
        "participants": 5,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 6,
        "title": "Nintendo Switch",
        "price": 400,
        "participants": 6,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 7,
        "title": "Sony PlayStation 5",
        "price": 500,
        "participants": 7,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 8,
        "title": "Samsung Galaxy S21",
        "price": 600,
        "participants": 8,
        "thumbnail": "../src/assets/raffle_test.png"
      },
      {
        "pk": 9,
        "title": "Google Pixel 6",
        "price": 700,
        "participants": 9,
        "thumbnail": "src/assets/raffle_test.png"
      },
      {
        "pk": 10,
        "title": "MacBook Pro 16-inch",
        "price": 800,
        "participants": 10,
        "thumbnail": "src/assets/raffle_test.png"
      }
    ]);
  },[]);

  // axios 함수 작성 필요
  // 선택한 키워드에 맞게 raffles 변경
  const handleRaffles = (selected) => {
    setSelected(selected)
    if (selected == "all" ) {
      setFilteredRaffles(raffles)
      return
    }

    setFilteredRaffles(raffles.filter(raffle => raffle.pk < 2))
  }

  return (
    <div className="my-3">
      <UpperBar />
      <img src={raffleBanner} alt="래플페이지 배너" className="aspect-[1/1] w-full rounded-lg my-3 "/>
      <div className="h-8 px-4 justify-start items-center gap-3 inline-flex text-lg">
          <p onClick={() => handleRaffles("all")} className={`${selected == "all" ? "text-black font-bold" :"text-slate-700" }`}>전체</p>
          <p onClick={() => handleRaffles("available")} className={`${selected == "available" ? "text-black font-bold" :"text-slate-700"}`}>응모 가능한 래플</p>
      </div>
      <div>
        {raffles.length !=0 ? filteredRaffles.map((raffle) => (
          <RaffleCard key={raffle.pk} raffle={raffle} />
        )) : 
        <div className="h-72 text-xl flex items-center justify-center text-stone-700">
          <p>
            현재 진행중인 래플이 없습니다.
          </p>
        </div>}
      </div>
    </div>
  );
};

export default RafflePage;
