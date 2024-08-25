import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import RaffleTest from '../../assets/RaffleImg/RaffleTest.png';
import UpperBar from '../../components/UpperBar';

const ReservationPage = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState({})
  const [totalReservation, setTotalReservation] = useState(0)
  const [reservations, setReservations] = useState([])
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'

  useEffect(() => {
    setReservations([
    {
      reserveId: 11,
      isEnter: false,
      store: {
        storeName: "Jewelry Store 5 Jewelry Store 5 Jewelry Store 5",
        storePlace: "London",
        storeId: 5,
      },
      reserveDate: "2024-05-19",
      reserveTime: "12:00:00",
    },
    {
      reserveId: 10,
      isEnter: false,
      store: {
        storeName: "Gadget Store 4",
        storePlace: "Tokyo",
        storeId: 4,
      },
      reserveDate: "2024-04-19",
      reserveTime: "11:30:00",
    },
    // 더미 데이터 추가 가능
  ])
  }, [])

  // 시간에 따라 오전/오후를 붙여주는 함수
  const formatTimeWithPeriod = (time) => {
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    
    const period = hourInt < 12 ? '오전' : '오후';
    const adjustedHour = hourInt % 12 || 12; // 12시를 유지하고, 0시를 12시로 변경

    return `${period} ${adjustedHour}:${minute}`;
  };

  // 필터링된 예약 목록을 반환
  const getFilteredReservations = () => {
    switch (filter) {
      case 'upcoming':
        return reservations.filter(reservation => !reservation.isEnter);
      case 'completed':
        return reservations.filter(reservation => reservation.isEnter);
      default:
        return reservations;
    }
  };

  return (
    <div className="p-4 bg-[#f7f8fc] h-dvh">
      <UpperBar />
      <div className="flex justify-evenly bg-white rounded-lg my-2 shadow-md border p-1">
        <button
          className={`mr-4 px-4 py-2 ${filter === 'all' ? 'font-bold' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체보기
        </button>
        <button
          className={`mr-4 px-4 py-2 ${filter === 'upcoming' ? 'font-bold' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          방문전
        </button>
        <button
          className={`px-4 py-2 ${filter === 'completed' ? 'font-bold' : ''}`}
          onClick={() => setFilter('completed')}
        >
          방문완료
        </button>
      </div>
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-4 text-center">민채 님, 총 {getFilteredReservations().length}개의 예약이 있어요.</h2>
        {getFilteredReservations().map(reservation => (
          <div key={reservation.reserveId} className="my-2 py-2 border-b-2 border-dashed">
            <div className="flex items-center mx-2 my-2">
              <div className="flex-grow w-full mx-1">
                <div className="text-lg font-semibold truncate">{reservation.store.storeName}</div>
                <div className="text-base text-gray-500">
                  {new Date(reservation.reserveDate).toLocaleDateString()} | {formatTimeWithPeriod(reservation.reserveTime)}
                </div>
              </div>
            </div>
              <div className="flex justify-around mx-5 mt-3">
                <button
                  className="text-sm"
                  onClick={() => navigate(`/profile/reservation/${reservation.reserveId}`)}
                >
                  상세보기
                </button>
                <span>|</span>
                <button className=" text-sm">예약취소</button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationPage;