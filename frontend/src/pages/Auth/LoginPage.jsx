import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Swal from 'sweetalert2'

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  // accessToken 존재 유무 및 유효 여부 판단 필요!
  // useEffect(() => {
  //   localStorage.getItem("accessToken") && navigate("/")
  // },[])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleLoginClick = async () => {
    if (email.length == 0 && password.length == 0) {
      Swal.fire({
        icon:"warning",
        text:"아이디 또는 비밀번호를 입력해주세요."
      })
      return
    } 
    await axios.post("https://solpop.xyz/api/v1/auth/login",{
      userId : email,
      password: password
  }).then((res) => {
    localStorage.setItem("accessToken",res.data.data.accessToken)
    navigate("/")
    }).catch((err) => {
      console.log(err)
      Swal.fire({
        icon:"warning",
        text:"아이디 또는 비밀번호를 확인해주세요."
      })
    })
  };

  {/* 로고 이미지 추가 */}
  return (
    <div className="flex items-center justify-center min-h-screen px-5 bg-gray-100">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-40">
          <img src="/logo308.png" alt="Logo" className="w-20 h-auto mb-3" />
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <div>
            <input
              type="text"
              name="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={email}
              onChange={(e) => handleEmailChange(e)}
              />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
              이메일
            </label>
          </div>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={password}
            onChange={(e) => handlePasswordChange(e)}
          />
          <label
            htmlFor="password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            비밀번호
          </label>
        </div>
        <button
          onClick={() => handleLoginClick()}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          로그인하기
        </button>
        <button className="block mx-auto my-3 w-28" onClick={() => navigate("/register")}>회원가입</button>
      </div>
    </div>
  );
};

export default LoginPage;
