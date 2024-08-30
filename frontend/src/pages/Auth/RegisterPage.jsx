import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { formatDateAndTime } from '../../utils/utils.js';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // 생성과정에서 사용하는 변수들 => userKey와 accountNo 위치 고민해보기!
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // 저장중일때에 멈추기
  const [isSaving, setIsSaving] = useState(false);

  // 초기 렌더링
  useEffect(() => {
    // accessToken이 존재한다면, 메인페이지로 이동
    if (localStorage.getItem('accessToken')) {
      navigate('/');
      return;
    }
  }, []);

  // 이름 변경 함수 / 한글을 제외한 문자 or 글자 수 제한 위반시
  const validateName = (name) => {
    const lengthValidate = name.length > 0 && name.length < 6;
    const nameRegex = /^[가-힣]{1,5}$/;
    return lengthValidate && nameRegex.test(name);
  };

  // 이름 변경사항 적용 함수
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length != 0 && !validateName(e.target.value)) {
      setNameError('이름은 한글로 1자 이상 5자 이하로 입력해주세요.');
    } else {
      setNameError('');
    }
  };

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const lengthValidate = email.length > 0 && email.length < 30;

    // 수정된 정규 표현식
    // ^[a-zA-Z0-9]+ : 이메일의 사용자명 부분은 영어 대소문자 또는 숫자만 허용
    // @[a-zA-Z0-9]+ : @ 다음에는 영어 대소문자 또는 숫자만 허용
    // \.[a-zA-Z]{2,}$ : 도메인 마지막 부분은 . 이후 2자 이상의 영어만 허용
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

    return lengthValidate && emailRegex.test(email);
  };

  /** - 이메일 중복 여부 체크
   * - 이메일형식이 유효하지 않으면 오류문구 표시 및 관리 */
  const handleEmailCheck = async () => {
    if (!validateEmail(email)) {
      setEmailError('이메일 형식이 유효하지 않습니다.');
      setIsEmailValid(false);
      return;
    }

    // SSAFY 사용자 계정 조회
    await axios
      .post('https://solpop.xyz/api/v1/auth/checkSSAFYUser', {
        apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
        userId: email,
      })
      .then(() => {
        setEmailError('중복된 이메일이 존재합니다.');
        setIsEmailValid(false);
      })
      .catch(() => {
        // error 발생 = email과 동일한 계정 없다.
        setEmailError('사용 가능한 이메일입니다.');
        setIsEmailValid(true);
        setIsEmailChecked(true);
      });
  };

  // 이메일 변경 적용 / 변경시 중복 체크 여부 false
  const handleEmailChange = (e) => {
    if (e.target.value.length < 30) {
      setEmail(e.target.value);
      setEmailError('');
    } else {
      setEmailError('이메일은 30자 이하로 입력해야합니다.');
    }
    setIsEmailChecked(false);
  };

  // Password 변경 로직 / 공백 제외 5자 이상
  const handlePasswordChange = (e) => {
    // 공백을 제외한 password
    if (e.target.value != '' && e.target.value.length < 5) {
      setPassword(e.target.value);
      setPasswordError('비밀번호는 5자 이상 입력해야합니다.');
    } else if (e.target.value.length > 30) {
      setPasswordError('비밀번호는 30자 이하로 입력해야합니다.');
    } else {
      setPassword(e.target.value);
      setPasswordError('');
    }
  };

  // 비밀번호 확인 / confirmPassword와 일치하는지 확인
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value != '' && e.target.value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // 오류 메시지를 보여주는 함수
  const showError = (title, message) => {
    Swal.fire(title, message, 'warning');
  };

  /** 최종적인 회원가입 함수 */
  // 회원가입 처리 함수
  const handleSignUp = async () => {
    if (nameError) {
      // 이름에 오류가 있으면 오류 메시지 표시
      showError('이름 확인', '이름이 조건에 맞지 않습니다.');
      return;
    }
    if (!validateEmail(email) || !isEmailChecked || !isEmailValid) {
      // 이메일이 유효하지 않거나 중복 체크가 안되었으면 오류 메시지 표시
      showError(
        '이메일 확인',
        '이메일 형식이 잘못되었거나 중복 확인이 필요합니다.',
      );
      return;
    }
    if (passwordError || confirmPasswordError) {
      // 비밀번호에 오류가 있으면 오류 메시지 표시
      showError(
        '비밀번호 확인',
        '비밀번호 조건이 맞지 않거나 비밀번호가 일치하지 않습니다.',
      );
      return;
    }
    if (!isAgreed) {
      // 약관에 동의하지 않았으면 오류 메시지 표시
      showError('동의 확인', '동의사항에 체크해주세요.');
      return;
    }

    setIsSaving(true); // 회원가입 요청 중 상태로 설정

    try {
      if (!localStorage.getItem('userKey')) {
        // SSAFY 사용자 계정 생성
        const res = await axios.post(
          'https://solpop.xyz/api/v1/auth/createSSAFYUser',
          {
            apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
            userId: email,
          },
        );
        localStorage.setItem('userKey', res.data.userKey); // userKey를 로컬 저장소에 저장
      }

      const { transmissionDate, transmissionTime, transmissionCode } =
        formatDateAndTime(); // 날짜와 시간 포맷 설정

      if (!localStorage.getItem('accountNo')) {
        // SSAFY 계좌 생성
        const res = await axios.post(
          'https://solpop.xyz/api/v1/auth/createSSAFYAccount',
          {
            Header: {
              apiName: 'createDemandDepositAccount',
              transmissionDate,
              transmissionTime,
              institutionCode: '00100',
              fintechAppNo: '001',
              apiServiceCode: 'createDemandDepositAccount',
              institutionTransactionUniqueNo: transmissionCode,
              apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
              userKey: localStorage.getItem('userKey'),
            },
            accountTypeUniqueNo: '088-1-2fe8b9c9733b41',
          },
        );
        localStorage.setItem('accountNo', res.data.REC.accountNo); // 계좌번호를 로컬 저장소에 저장
      }

      if (localStorage.getItem('userKey')) {
        // BE 사용자 생성
        await axios.post('https://solpop.xyz/api/v1/auth/signUp', {
          userId: email,
          password,
          name,
          userKey: localStorage.getItem('userKey'),
          accountNo: localStorage.getItem('accountNo'),
        });
      }

      if (localStorage.getItem('accountNo')) {
        // 계좌에 10000원 충전
        await axios.post('https://solpop.xyz/api/v1/auth/depositSSAFYAccount', {
          Header: {
            apiName: 'updateDemandDepositAccountDeposit',
            transmissionDate,
            transmissionTime,
            institutionCode: '00100',
            fintechAppNo: '001',
            apiServiceCode: 'updateDemandDepositAccountDeposit',
            institutionTransactionUniqueNo: transmissionCode,
            apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
            userKey: localStorage.getItem('userKey'),
          },
          accountNo: localStorage.getItem('accountNo'),
          transactionBalance: '10000', // 입금할 금액
          transactionSummary: '(수시입출금) : 입금',
        });

        Swal.fire({
          // 회원가입 성공 메시지 표시
          icon: 'success',
          title: `환영합니다, ${name} 님!`,
          html: `이벤트로 제공된 10000원으로<br> 다양한 콘텐츠를 즐겨보세요!`,
          confirmButtonText: '로그인하기',
        }).then((result) => {
          if (result.isConfirmed) {
            // 로그인 페이지로 이동
            localStorage.removeItem('userKey'); // userKey 제거
            localStorage.removeItem('accountNo'); // accountNo 제거
            navigate('/login');
          }
        });
      }
    } catch {
      showError('ERROR', '오류가 발생했습니다.'); // 오류 발생 시 메시지 표시
    } finally {
      setIsSaving(false); // 저장 상태 초기화
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 bg-gray-100">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-center">회원가입</h2>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="name"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            value={name}
            onChange={(e) => handleNameChange(e)}
          />
          <label
            htmlFor="name"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
          >
            이름
          </label>
          {nameError && (
            <p className="mt-2 text-sm text-red-600">{nameError}</p>
          )}
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row w-2/3">
              <input
                type="text"
                name="email"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={email}
                onChange={(e) => handleEmailChange(e)}
              />
              <label
                htmlFor="email"
                className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
              >
                이메일
              </label>
            </div>
            <button
              onClick={() => handleEmailCheck()}
              className="px-4 py-1 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              중복확인
            </button>
          </div>
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="password"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            value={password}
            onChange={(e) => handlePasswordChange(e)}
          />
          <label
            htmlFor="password"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
          >
            비밀번호
          </label>
          {passwordError && (
            <p className="mt-2 text-sm text-red-600">{passwordError}</p>
          )}
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="confirmPassword"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e)}
          />
          <label
            htmlFor="confirmPassword"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600"
          >
            비밀번호 확인
          </label>
          {confirmPasswordError && (
            <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
          )}
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="agreement"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label htmlFor="agreement" className="ml-2 text-sm text-gray-900">
            회원가입시 계좌가 자동으로 생성됩니다.
          </label>
        </div>
        <button
          onClick={() => handleSignUp()}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          회원가입하기
        </button>
        {isSaving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white bg-opacity-80">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
