import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { checkTokenValidity } from '../../utils/axios';
import Swal from 'sweetalert2';

import UpperBar from '../../components/UpperBar';

const PaymentPage = () => {
  const { storeId, numericAmount } = useParams();

  const navigate = useNavigate();
  const mainRef = useRef(null);
  const [store, setStore] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const response = await api.get(`/api/v1/store/name/${storeId}`);
        setStore(response.data.store);
      } catch (error) {
        console.error('결제 정보를 불러오는데 실패했습니다.', error);
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
        pointPlace: store.storeName,
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


  const handleConfirm = () => {
    Swal.fire({
      title: '결제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsConfirmed(true);
        Swal.fire(
          '결제 완료',
          '결제가 완료되었습니다.',
          'success'
        );
      }
    });
    navigate(`/profile`);
  };
  return (
    // <div ref={mainRef}>
    //   <UpperBar title={'결제 페이지'} />
    //   <div ref={mainRef} className="flex flex-col items-center justify-center h-screen">
    //   <div className="flex flex-col items-center">
    //     <h2 className="text-3xl font-bold my-4">{storeName}</h2>
    //     <p className="mb-4 text-2xl">결제 금액: {numericAmount}원</p>
    //     <button
    //       className={`px-6 py-3 bg-blue-500 text-white text-xl rounded-lg ${loading ? 'opacity-50' : ''}`}
    //       onClick={handlePayment}
    //       disabled={loading}
    //     >
    //       {loading ? '결제 중...' : '결제하기'}
    //     </button>
    //   </div>
    //   <div className="w-full h-24"></div>
    // </div>
    // </div>
    <div className="max-w-lg p-4 mx-auto rounded-lg shadow-md bg-gray-50 h-dvh">
      <UpperBar />
      <div className="flex items-center justify-center h-full p-4 my-2 bg-blue-600 rounded-lg ">
        <div>
          <div className="p-3 bg-white rounded-lg">
            <img src={storeThumbnailUrl} alt={store.storeName} className="object-cover w-full h-64 rounded-lg" />
            <div className="flex flex-col w-full m-2 gap-y-2 gap-x-1">
              <h1 className="text-base font-bold">{store.storeName}</h1>
              <div className="flex w-full">
                <p className="text-sm text-gray-600 w-1/8">장소 :</p>
                <p className="w-5/6 px-1 overflow-hidden text-sm text-gray-600">{store.storePlace}</p>
              </div>
              <div className="flex w-full gap-x-2">
                <p className="text-sm text-gray-600 w-1/8">결제 금액 :</p>
                <p className="w-5/6 text-sm text-gray-600"> {numericAmount} Sol</p>
              </div>
            </div>
            <div className="relative my-5">
              <div className="absolute top-[-25px] left-[-25px] bg-blue-600 w-[25px] h-[50px] rounded-r-full"></div>
              <div className="absolute top-[-25px] right-[-25px] bg-blue-600 w-[25px] h-[50px] rounded-l-full"></div>
              <div className="mx-4 border-t-2 border-dashed"></div>
            </div>
            <div className="text-center">
              <button
                onClick={handleConfirm}
                className={`block mx-auto px-3 py-2 w-1/2 rounded-full text-white font-bold transition-colors ${isConfirmed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isConfirmed}
              >
                결제하기
              </button>
              <p className="mt-4 text-sm text-gray-500">결제하기를 누르시면 포인트가 차감됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );

};

export default PaymentPage;
