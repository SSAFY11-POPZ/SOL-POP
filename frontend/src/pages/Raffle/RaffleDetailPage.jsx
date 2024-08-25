import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import RaffleCard from './components/RaffleCard';
import UpperBar from '../../components/UpperBar';
import RaffleTest from '../../assets/RaffleImg/RaffleTest.png'

const RaffleDetailPage = () => {
  const dummyData = {
    "raffleId": 1,
    "raffleName": "Gadget Raffle",
    "raffleStartDate": "2024-01-01T00:00:00",
    "raffleEndDate": "2024-12-31T23:59:59",
    "raffleQual": "Must be a member",
    "raffleDetail": "Win a new gadget!",
    "raffleThumbnailUrl": "http://example.com/raffle1.jpg",
    "rafflePrice": 500,
    "raffleCrtNo": "Raffle001",
    "raffleNumWinners": 5,
    "store": {
        "storeId": 1,
        "storeName": "Shoe Store 1",
        "storeStartDate": "2024-01-01T00:00:00",
        "storeEndDate": "2024-12-31T23:59:59",
        "storePlace": "NYC",
        "storeDetail": "Awesome store 1", // 팝업스토어에 대한 상세정보
        "storeKeyword": "shoes", // 팝업스토어 내의 키워드 
        "storeRsvPriority": true,
        "storeCapacity": 100,
        "storeThumbnailUrl": RaffleTest,
        "storePrice": 1000, // 팝업스토어의 입장료
        "hashtag": "#cool" // 해시태그
    }
}
  const {raffleId} = useParams();
  const [raffle, setRaffle] = useState(dummyData);
  const [ticketNumber, setTicketNumber] = useState("")

  useEffect(() => {
  },[])
  
  const handleChange = (e) => {
    setTicketNumber(e.target.value)
  }

  return (
    <div >
      <UpperBar />
      <RaffleCard
        raffle={raffle}
      />
      <div className="self-stretch justify-start items-start inline-flex">
      <div className="w-2/5 px-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
      <p >래플 응모 마감 기간</p>
      <p >당첨자 발표일</p>
      <p >팝업 장소</p>
      <p >안내사항</p>
      </div>
      <div className="flex-col w-3/5 justify-start items-start gap-2.5 inline-flex">
        <p>{new Date(raffle.raffleEndDate).toLocaleDateString()}</p>
        <p>{new Date(raffle.raffleStartDate).toLocaleDateString()}</p>
        <p>{raffle.store?.storePlace}</p>
        <p>{raffle.raffleDetail}</p>
        <p>이벤트 당첨 여부는 마이페이지에서 확인하실 수 있습니다.</p>
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