import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import RaffleCard from './components/RaffleCard';
import UpperBar from './components/UpperBar';

const RaffleDetailPage = () => {
  const {raffleId} = useParams();
  const [raffle, setRaffle] = useState({});
  const [ticketNumber, setTicketNumber] = useState("")

  useEffect(() => {
    setRaffle(      {
        "pk": 1,
        "title": "LMC x BE@RBRICK 100% & 400%",
        "price": 100,
        "participants": 1,
        "thumbnail": "src/assets/raffle_test.png"
      })
  },[])

  const handleChange = (e) => {
    setTicketNumber(e.target.value)
  }

  return (
    <div >
      <UpperBar />
      <RaffleCard raffle={raffle}/>
      <div className="self-stretch justify-start items-start inline-flex">
      <div className="w-2/5 px-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
      <p >래플 응모 마감 기간</p>
      <p >당첨자 발표일</p>
      <p >팝업 장소</p>
      <p >안내사항</p>
      </div>
      <div className="flex-col w-3/5 justify-start items-start gap-2.5 inline-flex">
      <p >8월 26일</p>
      <p >8월 26일</p>
      <p >서울 성동구 성수대로 32 팝업스토어</p>
      <p >응모번호는 현장에서 팝업스토어를 체험한 후 수령하실 수 있습니다.<br/>이벤트 당첨 여부는 마이페이지에서 확인하실 수 있습니다.</p>
      </div>
      </div>
      <div className="w-full mx-auto my-3">
        <input placeholder="현장에서 수령한 응모번호를 입력하세요." className="border border-black rounded-lg py-2 px-3 w-full text-center" onChange={(e) => handleChange(e)} value={ticketNumber}/>
      </div>
      <div className="bg-blue-700 mx-auto w-1/2  text-center rounded-full ">
        <div className="text-white text-sm font-bold py-2 px-3">응모하기</div>
      </div>
    </div>
  );
};

export default RaffleDetailPage;