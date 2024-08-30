import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSeeding from '../../assets/ProfileImg/ProfileSeeding.png';
import ProfileMoney from '../../assets/ProfileImg/ProfileMoney.png';
import Card from '../../assets/ProfileImg/Card.png';
import Swal from 'sweetalert2';
import api, { checkTokenValidity } from '../../utils/axios';
import axios from 'axios';
import { formatDateAndTime } from '../../utils/utils';

const ProfilePage = () => {
  const navigate = useNavigate();

  // 공통된 css
  const hoverCss = 'hover:bg-slate-300 hover:bg-opacity-20';

  const [balance, setBalance] = useState(0); // 계좌 잔액
  const [point, setPoint] = useState(0); // 포인트
  const [user, setUser] = useState({}); // 유저정보
  const [amount, setAmount] = useState(''); // 충전하기에서 입력한 금액
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 오픈 여부
  const [warning, setWarning] = useState('');

  // 1. 초기 렌더링시에 실행되는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem('accessToken')) {
          // navigate("/login")
          return;
        }
        // 토큰이 유효한지 검증
        const response = await checkTokenValidity();
        console.log(response);
        if (!response || response.status !== 200) {
          // navigate("/login");
          console.log(response);
          return;
        }

        // if (!response.result) {
        //   navigate("/login");
        //   return;
        // }

        // 토큰이 유효하다면 반환된 데이터를 user에 할당
        setUser(response.data.data);
        // 포인트 조회
        const pointResponse = await api.get('/api/v1/user/point/balance');
        setPoint(pointResponse.data);

        // 계좌 잔액 조회
        const { transmissionDate, transmissionTime, transmissionCode } =
          formatDateAndTime();
        const balanceResponse = await api.post(
          'api/v1/account/checkAccountNo',
          {
            Header: {
              apiName: 'inquireDemandDepositAccountBalance',
              transmissionDate: transmissionDate,
              transmissionTime: transmissionTime,
              institutionCode: '00100',
              fintechAppNo: '001',
              apiServiceCode: 'inquireDemandDepositAccountBalance',
              institutionTransactionUniqueNo: transmissionCode,
              apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
              userKey: response.data.data.userKey, // 여기서 response.data.data.userKey를 사용
            },
            accountNo: response.data.data.accountNo, // response.data.data.accountNo를 사용
          },
        );

        setBalance(balanceResponse.data.REC.accountBalance);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
        navigate('/login');
      }
    };

    fetchData();
  }, []);

  // 2. 포인트 충전하기
  // 포인트 충전하기 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 포인트 충전하기 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setWarning('');
  };

  // 금액 변경 처리
  const handleAmount = (e) => {
    const value = e.target.value;

    // 입력된 값이 빈 문자열이면 경고를 표시하지 않고 금액을 빈 문자열로 설정
    if (value === '') {
      setAmount('');
      setWarning('');
      return;
    }

    // 입력한 값이 숫자인지 확인
    const numericValue = parseFloat(value);

    // 입력한 값이 숫자가 아니면 경고 메시지 설정
    if (isNaN(numericValue)) {
      setWarning('숫자만 입력할 수 있습니다.');
      return;
    }

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

  // 포인트 충전하기
  const chargePoint = async () => {
    try {
      // 계좌 출금 신청
      const { transmissionDate, transmissionTime, transmissionCode } =
        formatDateAndTime();
      await axios
        .post('https://solpop.xyz/api/v1/account/withdrawal', {
          Header: {
            apiName: 'updateDemandDepositAccountWithdrawal',
            transmissionDate: transmissionDate,
            transmissionTime: transmissionTime,
            institutionCode: '00100',
            fintechAppNo: '001',
            apiServiceCode: 'updateDemandDepositAccountWithdrawal',
            institutionTransactionUniqueNo: transmissionCode,
            apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
            userKey: user.userKey,
          },
          accountNo: user.accountNo,
          transactionBalance: `${amount}`,
          transactionSummary: '(수시입출금) : 출금',
        })
        .then(() => {
          setBalance((prev) => prev - amount);
        });
      // 포인트 충전
      await api
        .put(`/api/v1/point/charge?amount=${amount}`)
        .then(() => {})
        .then(() => {
          closeModal();
          Swal.fire({
            title: '충전완료',
            icon: 'success',
            html: '충전이 완료되었습니다. <br> 다양한 콘텐츠를 즐겨보세요!',
          });
          setPoint((prev) => prev + amount);
        });
    } catch {
      Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
    }
  };

  // 3. 내 계좌 잔액
  const showBalance = () => {
    const formattedAccountNo = user.accountNo.replace(/(\d{4})(?=\d)/g, '$1-');

    Swal.fire({
      imageUrl: Card,
      imageWidth: 260,
      imageHeight: 150,
      imageAlt: 'Custom image',
      html: `<span style="font-size:16px">${formattedAccountNo}</span><br><br>현재 잔액은 <strong>${balance}원</strong>입니다.`,
    });
  };

  // 4. 내 찜한 목록
  const showWishlist = () => {
    navigate('/profile/wishlist');
  };

  // 5. 내 예약 목록
  const goToReservation = () => {
    navigate('/profile/reservation');
  };

  return (
    <div className="flex h-screen flex-col gap-2.5 bg-[#f7f8fc] px-4 py-4">
      <div className="w-full flex-row gap-2.5 rounded-[20px] bg-[#4472ea] p-5">
        <div className="flex gap-3 p-3">
          <div className="aspect-[1/1] w-16">
            <img src={ProfileSeeding} alt="Profile Seeding" />
          </div>
          <div className="flex-row justify-end align-bottom">
            <span className="font-['Noto Sans'] block text-lg font-bold text-white">
              {user.name} 님,
            </span>
            <span className="font-['Noto Sans'] block text-sm font-bold text-white">
              오늘도 쏠쏠한 혜택을 누리세요!
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center rounded-[20px] bg-white p-2.5">
          <div className="flex w-full items-center px-5 py-2.5">
            <div className="text-[#909090]">SOL Point</div>
          </div>
          <div className="flex w-full items-center justify-between px-2.5 font-bold">
            <div className="flex items-center gap-2.5">
              <img
                className="aspect-[1/1] w-8"
                src={ProfileMoney}
                alt="Profile Money"
              />
              <div className="text-xl text-black">{point}원</div>
            </div>
            <button className="text-[#4472ea]" onClick={openModal}>
              충전하기
            </button>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col gap-y-2 rounded-t-[20px] bg-white px-4 py-3">
        <div className="flex flex-col gap-y-3">
          <p className="p-1 text-slate-500">조회</p>
          <p
            className={`text-base ${hoverCss} p-1`}
            onClick={() => showBalance()}
          >
            내 계좌 잔액
          </p>
          <p
            className={`text-base ${hoverCss} p-1`}
            onClick={() => showWishlist()}
          >
            내 찜한 목록
          </p>
          <p
            className={`text-base ${hoverCss} p-1`}
            onClick={() => goToReservation()}
          >
            내 예약목록
          </p>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <div
            className="relative w-4/5 max-w-lg p-6 bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-gray-500 right-2 top-2"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="mb-4 text-xl font-semibold text-center">
              포인트 충전
            </h2>
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

            {warning && (
              <p className="mb-4 text-center text-red-500">{warning}</p>
            )}

            <button
              className={`w-full rounded-lg py-3 font-semibold text-white ${warning !== '' || amount === 0 ? 'cursor-not-allowed bg-gray-400' : 'bg-yellow-400'}`}
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
