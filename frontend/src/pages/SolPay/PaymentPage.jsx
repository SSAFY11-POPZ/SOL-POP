import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
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
        // const response = await api.get(`/api/v1/store/name/${storeId}`);
        setStoreName("팝팝팝 with POPZ");
      } catch (error) {
        console.error('가게 이름을 불러오는데 실패했습니다.', error);
      }
    };

    fetchStoreName();
  }, [storeId]);

  const handlePayment = async () => {
    try {
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

        Swal.fire('결제 완료', '결제가 성공적으로 완료되었습니다.', 'success').then(() => {
          navigate('/');
        });
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
    <div
      ref={mainRef}
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/c104-10f5a.appspot.com/o/etc%2F%EA%B0%9C%EC%9A%B8%2Fth.jpg?alt=media&token=fbb70e56-e06f-4a95-8cfc-d67e0b8059cd)',
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"></div>
      <UpperBar title={'결제 페이지'} />
      <div className="flex flex-col items-center justify-center flex-grow p-8 rounded-lg shadow-lg z-10">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">{storeName}</h2>
        <p className="mb-6 text-2xl text-gray-600">
          결제 금액: <span className="text-gray-900 font-semibold">{numericAmount}원</span>
        </p>
        <button
          className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium rounded-lg transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? '결제 중...' : '결제하기'}
        </button>
      </div>
      <div className="w-full h-24"></div>
    </div>
  );
};

export default PaymentPage;
