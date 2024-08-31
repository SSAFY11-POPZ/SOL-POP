import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { checkTokenValidity } from '../../utils/axios';
import Swal from 'sweetalert2';

import UpperBar from '../../components/UpperBar';

const PaymentPage = () => {
  const { storeId, numericAmount } = useParams();

  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const response = await api.get(`/api/v1/store/name/${storeId}`);
        setStoreName(response.data);
      } catch (error) {
        console.error('가게 이름을 불러오는데 실패했습니다.', error);
      }
    };

    fetchStoreName();
  }, [storeId]);

  const handlePayment = async () => {
    try {
      // if (!localStorage.getItem('accessToken')) {
      //   navigate('/login');
      //   return;
      // }

      // setLoading(true); // 로딩 상태 시작

      // // 토큰이 유효한지 검증
      // const response = await checkTokenValidity();
      // if (!response.result) {
      //   navigate('/login');
      //   return;
      // }

      // 포인트 차감 요청
      const pointUseData = {
        amount: numericAmount,
        pointPlace: storeName,
      };

      try {
        await api.post('/api/v1/point/request', pointUseData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        Swal.fire('결제 완료', '결제가 성공적으로 완료되었습니다.', 'success');
      } catch (error) {
        console.error('포인트 차감 실패', error);
        Swal.fire('ERROR', '결제에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('결제 처리 중 오류 발생', error);
      Swal.fire('ERROR', '결제 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div ref={mainRef}>
      <UpperBar title={'결제 페이지'} />
      <div ref={mainRef} className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold my-4">{storeName}</h2>
        <p className="mb-4 text-2xl">결제 금액: {numericAmount}원</p>
        <button
          className={`px-6 py-3 bg-blue-500 text-white text-xl rounded-lg ${loading ? 'opacity-50' : ''}`}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? '결제 중...' : '결제하기'}
        </button>
      </div>
      <div className="w-full h-24"></div>
    </div>
    </div>
  );
};

export default PaymentPage;
