import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { checkTokenValidity } from '../../utils/axios';
import Swal from 'sweetalert2';

import RaffleCard from './components/RaffleCard';
import UpperBar from '../../components/UpperBar';

const RaffleDetailPage = () => {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [user, setUser] = useState({});
  const { raffleId } = useParams();
  const [raffle, setRaffle] = useState({});
  const [ticketNumber, setTicketNumber] = useState('');

  useEffect(() => {
    const ScrollToDiv = () => {
      // 참조된 div가 있으면 그 위치로 스크롤 이동
      if (mainRef.current) {
        mainRef.current.scrollIntoView();
      }
    };
    const fetchData = async () => {
      // 래플 상세정보 가져오기
      await api
        .get(`/api/v1/raffle/${raffleId}`)
        .then((response) => {
          setRaffle(response.data);
        })
        .catch(() => {
          Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
          navigate('/login');
        });
    };
    ScrollToDiv();
    fetchData();
  }, []);

  const handleChange = (e) => {
    setTicketNumber(e.target.value);
  };

  // 래플응모페이지
  const handleRaffle = async () => {
    try {
      if (!localStorage.getItem('accessToken')) {
        Swal.fire({
          icon: 'error',
          text: '로그인이 필요한 서비스입니다.',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
        setTicketNumber('');
        return;
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
        icon: 'info',
        html: '응모시 포인트가 차감됩니다. <br>응모하시겠습니까?',
        showCancelButton: true, // 응모 여부 선택을 위해 취소 버튼 추가
        confirmButtonText: '응모',
        cancelButtonText: '취소',
      });
      // 백에서 포인트 차감 + 래플응모까지
      if (result.isConfirmed) {
        const amount = raffle.rafflePrice; // 차감할 포인트 금액, 실제 로직에 맞게 수정 필요
        await api.post('/api/v1/raffle/request', {
          "raffleId": raffleId,
          "raffleCrtNo": ticketNumber
      });
        // 응모 완료 알림
        await Swal.fire('응모완료!', '응모가 완료되었습니다.', 'success');
        setTicketNumber('');
      }
    } catch (error) {
      console.error('Failed to deduct points', error);
      Swal.fire('ERROR', error.data, 'error');
    }
  };
  return (
    <div ref={mainRef}>
      <UpperBar title={'래플 목록'} />
      <RaffleCard raffle={raffle} />
      <div>
        <div className="flex flex-row w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">래플 응모 마감 기간</p>
          <p className="w-3/5">
            {new Date(raffle.raffleEndDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">당첨자 발표일</p>
          <p className="w-3/5">
            {new Date(raffle.raffleStartDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">팝업 장소</p>
          <p className="w-3/5">{raffle.store?.storePlace}</p>
        </div>
        <div className="flex w-full px-3 my-1 gap-x-2">
          <p className="w-2/5">안내사항</p>
          <div className="w-3/5">
            <p>
              - 본 이벤트는 응모 금액이 필요한 서비스입니다. 포인트 충전 후에
              이용해주시길 바랍니다.
            </p>
            <p>- 이벤트 당첨 여부는 이메일을 통해 확인하실 수 있습니다.</p>
          </div>
        </div>
      </div>
      <div className="w-4/5 mx-auto my-3">
        <input
          placeholder="현장에서 수령한 응모번호를 입력하세요."
          className="w-full px-3 py-2 text-center border border-black rounded-lg"
          onChange={(e) => handleChange(e)}
          value={ticketNumber}
        />
      </div>
      <div className="w-1/2 mx-auto text-center bg-blue-700 rounded-full">
        <div
          className="px-3 py-2 text-sm font-bold text-white"
          disabled={user == {}}
          onClick={() => handleRaffle()}
        >
          응모하기
        </div>
      </div>
      {/* navbar만큼 띄워준것 */}
      <div className="w-full h-24"></div>
    </div>
  );
};

export default RaffleDetailPage;
