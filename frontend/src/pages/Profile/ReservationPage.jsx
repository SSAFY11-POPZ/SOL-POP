import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UpperBar from '../../components/UpperBar';
import api, { checkTokenValidity } from "../../utils/axios";
import Swal from 'sweetalert2'

const ReservationPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('전체보기'); // 필터 상태: 전체보기, 방문전, 방문완료

  // 예약 데이터를 날짜와 시간 기준으로 내림차순 정렬하는 함수
  const sortReservationsByDateAndTime = (reservations) => {
    return reservations.sort((a, b) => {
      const dateTimeA = new Date(`${a.reserveDate}T${a.reserveTime}`);
      const dateTimeB = new Date(`${b.reserveDate}T${b.reserveTime}`);
      return dateTimeB - dateTimeA; // 내림차순 정렬
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("accessToken")) {
          navigate("/login");
          return;
        }

        // 토큰이 유효한지 검증
        const response = await checkTokenValidity();
        // if (!response.result) {
        //   navigate("/login");
        //   return;
        // }

        // 유저 정보 설정
        setUser(response.data.data);

        // 예약 목록 가져오기
        const reservationRes = await api.get("/api/v1/user/reservation");
        const sortedReservations = sortReservationsByDateAndTime(reservationRes.data);
        setReservations(sortedReservations);
      } catch(err) {
        console.log(err)
      }
    };

    fetchData();
  }, [navigate]);

  // 오전/오후 시간 형식 변환 함수
  const formatTimeWithPeriod = (time) => {
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);

    const period = hourInt < 12 ? '오전' : '오후';
    const adjustedHour = hourInt % 12 || 12; // 12시를 유지하고, 0시를 12시로 변경

    return `${period} ${adjustedHour}:${minute}`;
  };

  // 필터링된 예약 목록 반환
  const getFilteredReservations = () => {
    switch (filter) {
      case '방문 전':
        return reservations.filter(reservation => !reservation.isVisited);
      case '방문 완료':
        return reservations.filter(reservation => reservation.isVisited);
      default:
        return reservations;
    }
  };

  // 예약 취소
  const cancelReservation = (reserveId) => {
    api.delete("/api/v1/user/cancelReservation", {
      data: { reserveId: reserveId } // reserveId를 data 객체로 감싸서 전달
    })
    .then(() => {
      // reservations에서 취소된 예약을 제외한 새로운 배열로 상태 업데이트
      setReservations(prevReservations => 
        prevReservations.filter(reservation => reservation.reserveId !== reserveId)
      );
      Swal.fire({
        icon:"success",
        text:"예약이 취소되었습니다."
      })
    })
    .catch(err => {
      console.log(err);
    });
  };

  // 직원 확인 처리 함수
  const handleConfirmVisit = async (storeId) => {
    try {
      const result = await Swal.fire({
        icon: 'info',
        title: '직원 확인',
        text: '확인을 누르시면 다시 사용하실 수 없습니다.',
      })
    if (result.isConfirmed) {
      const response = await api.post(`/api/v1/reserve/${storeId}/confirm-visit`)
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.store.storeId === storeId ? { ...reservation, isVisited: true } : reservation
        )
      );
    }
  } catch {
    Swal.fire({
      title:"ERROR",
      text:"오류가 발생했습니다.",
      icon:"error"
    })  
  }


  };

  return (
    <div className="min-h-screen p-4">
      <UpperBar/>
      <div className="grid grid-cols-3">
        <button
          className={`px-4 py-2 ${filter === '전체보기' ? 'font-bold text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFilter('전체보기')}
        >
          전체보기
        </button>
        <button
          className={`px-4 py-2 ${filter === '방문전' ? 'font-bold text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFilter('방문전')}
        >
          방문전
        </button>
        <button
          className={`px-4 py-2 ${filter === '방문완료' ? 'font-bold text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setFilter('방문완료')}
        >
          방문완료
        </button>
      </div>
      <div className="h-full p-4">
        <p className="mx-4 my-2 text-sm font-semibold">
          {`${filter} ${getFilteredReservations().length}건`}
        </p>
        {reservations.length > 0 ? (
          getFilteredReservations().map(reservation => (
            <div key={reservation.reserveId} className="px-4 py-4 mb-4 border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-grow">
                  <div className="text-lg font-semibold truncate">{reservation.store.storeName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(reservation.reserveDate).toLocaleDateString()} | {formatTimeWithPeriod(reservation.reserveTime)}
                  </div>
                </div>
              </div>
              <div className="flex justify-around mt-3">
                {!reservation.isVisited && <button
                  className={`text-sm ${reservation.isVisited ? 'text-gray-300 cursor-not-allowed' : ''}`}
                  disabled={reservation.isVisited}
                  onClick={() => cancelReservation(reservation.reserveId)}
                >
                  예약취소
                </button>}
                {!reservation.isVisited &&<span>|</span>}
                <button
                  className={`text-sm ${reservation.isVisited ? 'text-gray-300 cursor-not-allowed' : ''}`}
                  disabled={reservation.isVisited}
                  onClick={() => handleConfirmVisit(reservation.store.storeId)}
                >
                  {reservation.isVisited ? '방문완료' : '직원확인'}
                </button>
                  {reservation.store.raffle && <span>|</span>}
                  {reservation.store.raffle &&
                    <button
                    className="text-sm"
                    onClick={() => navigate(`/raffle/${reservation.store.raffle.raffleId}`)}
                    >
                  래플 응모하기
                </button>
                }
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">예약 내역이 없습니다.</p>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default ReservationPage;
