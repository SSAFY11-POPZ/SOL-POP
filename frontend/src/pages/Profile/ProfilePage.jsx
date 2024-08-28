import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileSeeding from '../../assets/ProfileImg/ProfileSeeding.png'
import ProfileMoney from '../../assets/ProfileImg/ProfileMoney.png'
import Swal from 'sweetalert2'
import api, { checkTokenValidity } from "../../utils/axios"
import axios from 'axios'
import { formatDateAndTime } from '../../utils/utils'

const ProfilePage = () => {
  const navigate = useNavigate()

  // 공통된 css
  const hoverCss = "hover:bg-slate-300 hover:bg-opacity-20"

  const [balance, setBalance] = useState(0) // 계좌 잔액
  const [point, setPoint] = useState(0) // 포인트
  const [user, setUser] = useState({}) // 유저정보
  const [amount, setAmount] = useState("") // 충전하기에서 입력한 금액
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 오픈 여부
  const [warning, setWarning] = useState('');

  // 초기 렌더링시에 실행되는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("accessToken")) {
          navigate("/login")
          return
        }
        // 토큰이 유효한지 검증
        const response = await checkTokenValidity();
        if (!response) {
          navigate("/login");
          return;
        }
  
        // 토큰이 유효하다면 반환된 데이터를 user에 할당
        setUser(response.data.data);
  
        // 포인트 조회
        const pointResponse = await api.get("/api/v1/user/point/balance");
        setPoint(pointResponse.data);
  
        // 계좌 잔액 조회
        const { transmissionDate, transmissionTime, transmissionCode } = formatDateAndTime();
        const balanceResponse = await api.post("api/v1/account/checkAccountNo", {
          "Header": {
            "apiName": "inquireDemandDepositAccountBalance",
            "transmissionDate": transmissionDate,
            "transmissionTime": transmissionTime,
            "institutionCode": "00100",
            "fintechAppNo": "001",
            "apiServiceCode": "inquireDemandDepositAccountBalance",
            "institutionTransactionUniqueNo": transmissionCode,
            "apiKey": import.meta.env.VITE_ADMIN_SECRET_KEY,
            "userKey": response.data.data.userKey // 여기서 response.data.data.userKey를 사용
          },
          "accountNo": response.data.data.accountNo // response.data.data.accountNo를 사용
        });
  
        setBalance(balanceResponse.data.REC.accountBalance);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
      }
    };
  
    fetchData();
  }, []);

  // 포인트 충전하기 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 포인트 충전하기 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setAmount("")
    setWarning('');
  };

  // 금액 변경 처리
  const handleAmount = (e) => {
    const value = e.target.value;
  
    // 입력된 값이 빈 문자열이면 경고를 표시하지 않고 금액을 0으로 설정
    if (value === '') {
      setAmount('');
      setWarning('');
      return;
    }
  
    // 입력한 값이 숫자인지 확인
    const numericValue = parseFloat(value);
  
    // 입력한 금액이 계좌 잔액보다 크면 계좌 잔액으로 설정
    if (numericValue > balance) {
      setAmount(balance);
      setWarning('한도를 초과했습니다.');
    } else {
      setAmount(numericValue);
      setWarning('');
    }
  };

  // 모달 바깥 부분을 클릭했을 때 모달을 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };


  const chargePoint = async () => {
    try {
      // 계좌 출금 신청
      const { transmissionDate, transmissionTime, transmissionCode } = formatDateAndTime();
      await axios.post("https://solpop.xyz/api/v1/account/withdrawal", {
        "Header": {
          "apiName": "updateDemandDepositAccountWithdrawal",
          "transmissionDate": transmissionDate,
          "transmissionTime": transmissionTime,
          "institutionCode": "00100",
          "fintechAppNo": "001",
          "apiServiceCode": "updateDemandDepositAccountWithdrawal",
          "institutionTransactionUniqueNo": transmissionCode,
          "apiKey": import.meta.env.VITE_ADMIN_SECRET_KEY,
          "userKey": user.userKey
        },
        "accountNo": user.accountNo,
        "transactionBalance":`${amount}`,
        "transactionSummary":"(수시입출금) : 출금"
      }).then(() => {
        setBalance((prev) => prev-amount)
      })
      // 포인트 충전
      await api.put(`/api/v1/point/charge?amount=${amount}`).then(() => {
      }).then(() => {
        closeModal()
        Swal.fire({
          title:"충전완료",
          icon:"success",
          html:"충전이 완료되었습니다. <br> 다양한 콘텐츠를 즐겨보세요!"
        })
        setPoint((prev) => prev + amount)
      })
    } catch {
      Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
    }

  }

  return (
    <div className="bg-[#f7f8fc] px-4 py-4 flex flex-col gap-2.5 h-screen">
      <div className="bg-[#4472ea] p-5 rounded-[20px] flex-row w-full gap-2.5">
        <div className="flex gap-3 p-3">
          <div className="w-16 aspect-[1/1]">
            <img src={ProfileSeeding} alt="Profile Seeding" />
          </div>
          <div>
            <span className="text-white text-xl font-bold font-['Noto Sans']">{user.Name}</span>
            <span className="text-white text-base font-bold font-['Noto Sans']">
              님,<br />오늘도 쏠쏠한 혜택을 누리세요!
            </span>
          </div>
        </div>
        <div className="bg-white p-2.5 rounded-[20px] flex flex-col items-center">
          <div className="w-full px-5 py-2.5 flex items-center">
            <div className="text-[#909090]">SOL Point</div>
          </div>
          <div className="w-full flex justify-between items-center px-2.5 font-bold">
            <div className="flex items-center gap-2.5">
              <img className="w-8 aspect-[1/1]" src={ProfileMoney} alt="Profile Money" />
              <div className="text-xl text-black">{point}원</div>
            </div>
            <button className="text-[#4472ea]" onClick={openModal}>충전하기</button>
          </div>
        </div>
      </div>
      <div className="bg-white py-3 px-4 rounded-t-[20px] h-full w-full flex flex-col gap-y-2">
        <div className="flex flex-col gap-y-3">
          <p className="p-1 text-slate-500">조회</p>
          <p className={`text-base ${hoverCss} p-1`} onClick={() => navigate("/profile/reservation")}>내 예약목록</p>
          <p className={`text-base ${hoverCss} p-1`}>내 계좌 잔액</p>
          <p className={`text-base ${hoverCss} p-1`}>내 래플 목록</p>
        </div>
        <div className="flex flex-col gap-y-3">
          <p className="p-1 font-normal text-slate-500">관리</p>
          <p className={`text-base ${hoverCss} p-1`}>개인정보 변경</p>
          <p className={`text-base ${hoverCss} p-1`}>회원탈퇴</p>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>
          <div className="relative w-4/5 max-w-lg p-6 bg-white rounded-lg" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute text-gray-500 top-2 right-2"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="mb-4 text-xl font-semibold text-center">포인트 충전</h2>
            <p className="mb-4 text-sm text-center text-gray-500">
              잔액 : {balance}원
            </p>

            <div className="mb-4">
              <label htmlFor="amount" className="block mb-2 text-center">
                충전할 금액
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={handleAmount}
                className="w-full px-3 py-2 text-center border rounded-lg"
                placeholder="금액을 입력하세요"
              />
            </div>

            {warning && <p className="mb-4 text-center text-red-500">{warning}</p>}

            <button
              className={`w-full py-3 font-semibold text-white rounded-lg ${warning !== '' || amount === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400'}`}
              onClick={() => chargePoint()}
              disabled={warning !== '' || amount === 0}
            >
              충전하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
