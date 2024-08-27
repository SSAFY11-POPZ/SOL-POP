import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileSeeding from '../../assets/ProfileImg/ProfileSeeding.png'
import ProfileMoney from '../../assets/ProfileImg/ProfileMoney.png'
// import { getDataWithAuth, postDataWithApiKey } from './utils/axios';
import axios from 'axios'
const ProfilePage = () => {
  const navigate = useNavigate()

  // 공통된 css
  const hoverCss = "hover:bg-slate-300 hover:bg-opacity-20"

  const [point, setPoint] = useState(0)
  const [user, setUser] = useState({})

  useEffect(() => {
    
    const adminSecretKey = import.meta.env.VITE_ADMIN_SECRET_KEY;
    console.log("Admin Secret Key:", adminSecretKey);

    // axios.post("https://finopenapi.ssafy.io/ssafy/api/v1/member", {
    // 1. 관리자 계정 생성 (프록시 설정을 통해 요청)
    axios({
      method: "post",
      url: "https://finopenapi.ssafy.io/ssafy/api/v1/member", // 프록시를 사용하는 경우
      data: {
        apiKey: import.meta.env.VITE_KAKAO_API_KEY,
        userId: "testtestttest@naver.com",
      }
    })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
  }, [])

  // 필요한 함수들
  // 포인트 충전하기
  const chargeAccount = () => {

  }

  // 찜한 팝업 조회
  const getWishlist = () => {

  }
  // 내 예약목록 조회
  const getMyReservations = () => {

  }
  // 내 결제내역 조회
  const getMyPayments = () => {

  }
  // 내 계좌잔액 조회
  const getAccountBalance = () => {

  }
  return (
    <div className="bg-[#f7f8fc] px-4 py-4 flex flex-col gap-2.5 h-screen">
      <div className="bg-[#4472ea] p-5 rounded-[20px] flex-row w-full gap-2.5">
        <div className="flex gap-3 p-3">
          <div className="w-16 aspect-[1/1]">
            <img src={ProfileSeeding} alt="Profile Seeding"/>
          </div>
          <div>
            <span className="text-white text-xl font-bold font-['Noto Sans']">민채</span>
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
              <img className="w-8 aspect-[1/1]" src={ProfileMoney} />
              <div className="text-black text-xl">4,500원</div>
            </div>
            <button className="text-[#4472ea]">충전하기</button>
          </div>
        </div>
      </div>
    <div className="bg-white py-3 px-4 rounded-t-[20px] h-full w-full flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-3">
        <p className="text-slate-500 p-1">조회</p>
        {/* <p className={`text-base ${hoverCss} p-1`} onClick={() => navigate("/profile/wishlist")}>찜한 팝업</p> */}
        <p className={`text-base ${hoverCss} p-1`} onClick={() => navigate("/profile/reservation")}>내 예약목록</p>
        {/* <p className="text-base" onClick={() => navigate("/profile/wishlist")}>내 결제내역</p> */}
        <p className={`text-base ${hoverCss} p-1`}>내 계좌 잔액</p>
      </div>
      <div className="flex flex-col gap-y-3">
        <p className="text-slate-500 font-normal p-1">관리</p>
        <p className={`text-base ${hoverCss} p-1`}>개인정보 변경</p>
        <p className={`text-base ${hoverCss} p-1`}>회원탈퇴</p>
      </div>
    </div> 
  </div>
  );
};

export default ProfilePage;