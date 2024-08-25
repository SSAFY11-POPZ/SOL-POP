import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import RaffleTest from '../../assets/RaffleImg/RaffleTest.png'
import UpperBar from '../../components/UpperBar';


const ReservationDetail = () => {
  const { reserveId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // // reserveId를 통해 예약 정보 가져오기
    // axios.get(`/api/reservations/${reserveId}`)
    //   .then((response) => {
    //     setReservation(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching reservation:', error);
    //   });
    setReservation({
  id: 1,
  name: "LMC x BE@RBRICK 100% & 400%",
  location: "서울특별시 성수동 성수대로 32 팝업스토어",
  time: "2023. 8. 13(일) 오후 2:00",
  thumbnail: RaffleTest
})
  }, []);

  const handleConfirm = () => {
    Swal.fire({
      title: '확인하시겠습니까?',
      text:"확인시 재사용이 불가능합니다.",
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
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-50 rounded-lg shadow-md h-dvh">
      <UpperBar />
      <div className="bg-blue-600 rounded-lg p-4 my-2">
        <div className="bg-white p-3 rounded-lg">
          <img src={reservation.thumbnail} alt={reservation.name} className="w-full h-64 object-cover rounded-lg" />
          <div className="m-2 flex flex-col gap-y-2 gap-x-1 w-full">
            <h1 className="text-base font-bold">{reservation.name}</h1>
            <div className="flex w-full">
              <p className="text-gray-600 text-sm w-1/8">장소 :</p>
              <p className="text-gray-600 text-sm w-5/6 px-1 overflow-hidden">{reservation.location}/{reservation.location}</p>
            </div>
            <div className="flex gap-x-2 w-full">
              <p className="text-gray-600 text-sm w-1/8">일정 :</p>
              <p className="text-gray-600 text-sm w-5/6">{reservation.time}</p>
            </div>
          </div>
          <div className="relative my-5">
            <div className="absolute top-[-25px] left-[-25px] bg-blue-600 w-[25px] h-[50px] rounded-r-full"></div>
            <div className="absolute top-[-25px] right-[-25px] bg-blue-600 w-[25px] h-[50px] rounded-l-full"></div>
            <div className="border-t-2 border-dashed mx-4"></div>
          </div>
          <div className="text-center">
            <button
              onClick={handleConfirm}
              className={`block mx-auto px-3 py-2 w-1/2 rounded-full text-white font-bold transition-colors ${isConfirmed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isConfirmed}
            >
              직원 확인
            </button>
            <p className="text-gray-500 mt-4 text-sm">직원 확인 후에는 취소 및 재입장이 불가능합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetail;