import {useState, useEffect, useRef} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import api, {checkTokenValidity} from '../../utils/axios'
import Swal from 'sweetalert2'

import RaffleCard from './components/RaffleCard';
import UpperBar from '../../components/UpperBar';

const RaffleDetailPage = () => {
  const navigate = useNavigate();
  const mainRef = useRef(null)
  const [user, setUser] = useState({})
  const {raffleId} = useParams();
  const [raffle, setRaffle] = useState({});
  const [ticketNumber, setTicketNumber] = useState("")

  useEffect(() => {
    const ScrollToDiv = () => {
      // 참조된 div가 있으면 그 위치로 스크롤 이동
      if (mainRef.current) {
        mainRef.current.scrollIntoView();
      }
    };
    const fetchData = async () => {
      // 래플 상세정보 가져오기
      await api.get(`/api/v1/raffle/${raffleId}`
      ).then((response) => {
        setRaffle(response.data)
      }).catch(() => {
        Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
        navigate("/login")
      })
    }
    ScrollToDiv();
    fetchData();
  },[])
  
  const handleChange = (e) => {
    setTicketNumber(e.target.value)
  }

  // 래플응모페이지
  const handleRaffle = async () => {
    try {
      if (!localStorage.getItem("accessToken")) {
        navigate("/login")
        return
      }
      // 토큰이 유효한지 검증
      const response = await checkTokenValidity();
      // if (!response.result) {
      //   navigate("/login");
      //   return;
      // }

      // 토큰이 유효하다면 반환된 데이터를 user에 할당
      setUser(response.data.data);
      // 응모 여부 확인
      const result = await Swal.fire({
        icon: "info",
        html: "응모시 포인트가 차감됩니다. <br>응모하시겠습니까?",
        showCancelButton: true, // 응모 여부 선택을 위해 취소 버튼 추가
        confirmButtonText: "응모",
        cancelButtonText: "취소",
      });


      // 포인트에서 차감하기
      if (result.isConfirmed) {
        try {
          const amount = raffle.rafflePrice; // 차감할 포인트 금액, 실제 로직에 맞게 수정 필요
          await api.post("/api/v1/point/request", {
            amount: amount,
            pointPlace: `${raffle.raffleName} - 응모`
          });
            
          // 래플 요청 보내기
          try {
            await api.post("/api/v1/raffle/request", {
              raffleId: raffleId,
              raffleCrtNo: ticketNumber,
            });

            // 응모 완료 알림
            await Swal.fire("응모완료!", "응모가 완료되었습니다.", "success");
            setTicketNumber("")
          } catch (raffleError) {
            const message = raffleError.response.data
            // 래플 응모에 실패한 경우 포인트 복구
            console.error(message);
            if (message == "이미 응모한 래플") {
              Swal.fire("ERROR", "이미 응모한 래플입니다.", "error");
            } else if (message == "잘못된 응모쿠폰"){
              Swal.fire("ERROR", "잘못된 쿠폰 번호입니다. 다시 입력해주세요.", "warning");
            } else if (message == "예약하지 않은 팝업 래플") {
              Swal.fire("ERROR", "예약 후에 이용 가능한 서비스입니다.", "warning");
            } else {
              Swal.fire("ERROR", "래플 요청에 실패하여 포인트가 복구되었습니다. 다시 시도해주세요.", "warning");
            }
            await rechargePoints(amount); // 포인트 복구 함수 호출
          }
          } catch (deductionError) {
            // 포인트 차감에 실패한 경우
            console.error('Failed to deduct points', deductionError);
            Swal.fire("ERROR", "포인트 차감에 실패했습니다. 고객센터로 문의해주세요.", "warning");
          }
        }
      } catch (err) {
      // 에러 핸들링
      if (err.response?.status === 409) {
        Swal.fire("ERROR", "예약 및 래플 응모내역을 확인해주세요.", "warning");
      } else if (err.response?.status === 422) {
        Swal.fire("ERROR", "응모번호가 올바르지 않습니다.", "warning");
      } else {
        Swal.fire("ERROR", "오류가 발생하였습니다.", "warning");
      }
    }
  };
  
  // 포인트 충전 함수
  const rechargePoints = async (amount) => {
    try {
      await api.put(`/api/v1/point/charge?amount=${amount}`)
    } catch (error) {
      console.error('Failed to recharge points', error);
      Swal.fire("ERROR", "포인트 충전에 실패했습니다. 고객센터로 문의해주세요.", "warning");
    }
  };

  return (
    <div ref={mainRef}>
      <UpperBar />
      <RaffleCard
        raffle={raffle}
      />
      <div>
        <div className="flex flex-row w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">래플 응모 마감 기간</p>
          <p className="w-3/5">{new Date(raffle.raffleEndDate).toLocaleDateString()}</p>
        </div>
        <div className="flex w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">당첨자 발표일</p>
          <p className="w-3/5">{new Date(raffle.raffleStartDate).toLocaleDateString()}</p>
        </div>
        <div className="flex w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">팝업 장소</p>
          <p className="w-3/5">{raffle.store?.storePlace}</p>
        </div>
        <div className="flex w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">안내사항</p>
          <div className="w-3/5">
            <p>이벤트 당첨 여부는 마이페이지에서 확인하실 수 있습니다.</p>
          </div>
        </div>
      </div>
      <div className="w-4/5 mx-auto my-3">
        <input placeholder="현장에서 수령한 응모번호를 입력하세요." className="w-full px-3 py-2 text-center border border-black rounded-lg" onChange={(e) => handleChange(e)} value={ticketNumber}/>
      </div>
      <div className="w-1/2 mx-auto text-center bg-blue-700 rounded-full ">
        <div className="px-3 py-2 text-sm font-bold text-white" disabled={user == {}} onClick={() => handleRaffle()}>응모하기</div>
      </div>
      {/* navbar만큼 띄워준것 */}
      <div className="w-full h-24"></div>
    </div>
  );
};

export default RaffleDetailPage;