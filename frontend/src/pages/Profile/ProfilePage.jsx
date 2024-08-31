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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem('accessToken')) {
          navigate('/login');
          return;
        }

        const response = await checkTokenValidity();
        if (!response || response.status !== 200) {
          navigate('/login');
          return;
        }

        // 토큰이 유효하다면 반환된 데이터를 user에 할당
        console.log(response.data.data);
        setUser(response.data.data);

        const pointResponse = await api.get('/api/v1/user/point/balance');
        setPoint(pointResponse.data);

        const { transmissionDate, transmissionTime, transmissionCode } =
          formatDateAndTime();
        const balanceResponse = await api.post(
          'api/v1/account/checkAccountNo',
          {
            Header: {
              apiName: 'inquireDemandDepositAccountBalance',
              transmissionDate,
              transmissionTime,
              institutionCode: '00100',
              fintechAppNo: '001',
              apiServiceCode: 'inquireDemandDepositAccountBalance',
              institutionTransactionUniqueNo: transmissionCode,
              apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
              userKey: response.data.data.userKey,
            },
            accountNo: response.data.data.accountNo,
          },
        );

        setBalance(balanceResponse.data.REC.accountBalance);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire(
          'ERROR',
          '오류가 발생했습니다. 다시 로그인해주세요.',
          'warning',
        );
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setWarning('');
  };

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmount = (e) => {
    let value = e.target.value.replace(/,/g, '');

    if (value === '') {
      setAmount('');
      setWarning('');
      return;
    }

    if (isNaN(value) || parseFloat(value) < 0) {
      setWarning('0 이상의 숫자만 입력할 수 있습니다.');
      return;
    }
    if (numericValue < 0) {
      setWarning('0보다 큰 값을 입력해주세요.');
      return;
    }

    value = parseFloat(value);

    if (value > balance) {
      setAmount(formatNumber(balance.toString()));
      setWarning('한도를 초과했습니다.');
    } else {
      setAmount(formatNumber(value.toString()));
      setWarning('');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const chargePoint = async () => {
    try {
      const { transmissionDate, transmissionTime, transmissionCode } =
        formatDateAndTime();

      await axios.post('https://solpop.xyz/api/v1/account/withdrawal', {
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
        transactionBalance: amount.replace(/,/g, ''),
        transactionSummary: '(수시입출금) : 출금',
      });

      await api.put(`/api/v1/point/charge?amount=${amount.replace(/,/g, '')}`);

      closeModal();
      Swal.fire({
        title: '충전완료',
        icon: 'success',
        html: '충전이 완료되었습니다. <br> 다양한 콘텐츠를 즐겨보세요!',
      });
      setPoint((prev) => prev + parseFloat(amount.replace(/,/g, '')));
      setBalance((prev) => prev - parseFloat(amount.replace(/,/g, '')));
    } catch {
      Swal.fire('ERROR', '오류가 발생했습니다.', 'warning');
    }
  };

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

  const showWishlist = () => {
    navigate('/wishlist');
  };

  const goToReservation = () => {
    navigate('/profile/reservation');
  };

  const showTransactionHistory = () => {
    navigate('/profile/trans-history');
  };

  // 7. 통계 페이지로 이동
  const goToStatsPage = () => {
    navigate('/statslistpage');
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
              {user.Name} 님,
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
          <p className={`text-base ${hoverCss} p-1`} onClick={showBalance}>
            내 계좌 잔액
          </p>
          <p
            className={`text-base ${hoverCss} p-1`}
            onClick={showTransactionHistory}
          >
            내 포인트 결제 내역
          </p>
          <p className={`text-base ${hoverCss} p-1`} onClick={showWishlist}>
            내 찜한 목록
          </p>
          <p className={`text-base ${hoverCss} p-1`} onClick={goToReservation}>
            내 예약목록
          </p>
          <p
            className={`text-base ${hoverCss} p-1`}
            onClick={() => goToStatsPage()}
          >
            기업 통계 페이지
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
            className="relative w-4/5 max-w-lg rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-2 top-2 text-gray-500"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="mb-4 text-center text-xl font-semibold">
              포인트 충전
            </h2>
            <p className="mb-4 text-center text-sm text-gray-500">
              잔액 : {balance}원
            </p>

            <div className="mb-4">
              <label htmlFor="amount" className="mb-2 block text-center">
                충전할 금액
              </label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmount}
                className="w-full rounded-lg border px-3 py-2 text-center"
                placeholder="금액을 입력하세요"
                // 스피너 버튼 없애기 위해 type="text" 사용
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
