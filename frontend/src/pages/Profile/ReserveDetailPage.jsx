import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios';
import Swal from 'sweetalert2';
import UpperBar from '../../components/UpperBar';

const ReservationDetail = () => {
  const { reserveId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // reserveId를 통해 예약 정보 가져오기
    api.get(`/api/v1/store/${reserveId}`)
      .then((response) => {
        console.log(response);
        setReservation(response.data);
      })
      .catch((error) => {
        console.error('Error fetching reservation:', error);
      });
  }, [reserveId]);

  const handleConfirm = () => {
    Swal.fire({
      title: '확인하시겠습니까?',
      text: "확인시 재사용이 불가능합니다.",
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
          '확인되었습니다!',
          '직원 확인이 완료되었습니다.',
          'success'
        );
      }
    });
  };

  if (!reservation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 mt-4 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  // 예약 데이터에서 필요한 정보 추출
  const { store } = reservation;
  const { storeName, storePlace, storeStartDate, storeEndDate, storeThumbnailUrl } = store;

  return (
    <div className="max-w-lg p-4 mx-auto rounded-lg shadow-md bg-gray-50 h-dvh">
      <UpperBar />
      <div className="flex items-center justify-center h-full p-4 my-2 bg-blue-600 rounded-lg ">
        <div>
          <div className="p-3 bg-white rounded-lg">
            <img src={storeThumbnailUrl} alt={storeName} className="object-cover w-full h-64 rounded-lg" />
            <div className="flex flex-col w-full m-2 gap-y-2 gap-x-1">
              <h1 className="text-base font-bold">{storeName}</h1>
              <div className="flex w-full">
                <p className="text-sm text-gray-600 w-1/8">장소 :</p>
                <p className="w-5/6 px-1 overflow-hidden text-sm text-gray-600">{storePlace}</p>
              </div>
              <div className="flex w-full gap-x-2">
                <p className="text-sm text-gray-600 w-1/8">일정 :</p>
                <p className="w-5/6 text-sm text-gray-600">
                  {new Date(storeStartDate).toLocaleDateString()} - {new Date(storeEndDate).toLocaleDateString()}
                </p>
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
                직원 확인
              </button>
              <p className="mt-4 text-sm text-gray-500">직원 확인 후에는 취소 및 재입장이 불가능합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;
