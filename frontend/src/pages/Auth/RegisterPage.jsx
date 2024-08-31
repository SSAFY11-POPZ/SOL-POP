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

  // 추가된 필드들
  const [ageGroup, setAgeGroup] = useState('20대');
  const [gender, setGender] = useState('남성'); // 기본값을 "남성"으로 설정

  const [isEmailValid, setIsEmailValid] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/');
      return;
    }
  }, []);

  const validateName = (name) => {
    const lengthValidate = name.length > 0 && name.length < 6;
    const nameRegex = /^[가-힣]{1,5}$/;
    return lengthValidate && nameRegex.test(name);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length !== 0 && !validateName(e.target.value)) {
      setNameError('이름은 한글로 1자 이상 5자 이하로 입력해주세요.');
    } else {
      setNameError('');
    }
  };

  const validateEmail = (email) => {
    const lengthValidate = email.length > 0 && email.length < 30;
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    return lengthValidate && emailRegex.test(email);
  };

  const handleEmailCheck = async () => {
    if (!validateEmail(email)) {
      setEmailError('이메일 형식이 유효하지 않습니다.');
      setIsEmailValid(false);
      return;
    }

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
        setEmailError('사용 가능한 이메일입니다.');
        setIsEmailValid(true);
        setIsEmailChecked(true);
      });
  };

  const handleEmailChange = (e) => {
    if (e.target.value.length < 30) {
      setEmail(e.target.value);
      setEmailError('');
    } else {
      setEmailError('이메일은 30자 이하로 입력해야합니다.');
    }
    setIsEmailChecked(false);
  };

  const handlePasswordChange = (e) => {
    if (e.target.value !== '' && e.target.value.length < 5) {
      setPassword(e.target.value);
      setPasswordError('비밀번호는 5자 이상 입력해야합니다.');
    } else if (e.target.value.length > 30) {
      setPasswordError('비밀번호는 30자 이하로 입력해야합니다.');
    } else {
      setPassword(e.target.value);
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== '' && e.target.value !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const showError = (title, message) => {
    Swal.fire(title, message, 'warning');
  };

  const handleSignUp = async () => {
    if (nameError) {
      showError('이름 확인', '이름이 조건에 맞지 않습니다.');
      return;
    }
    if (!validateEmail(email) || !isEmailChecked || !isEmailValid) {
      showError(
        '이메일 확인',
        '이메일 형식이 잘못되었거나 중복 확인이 필요합니다.',
      );
      return;
    }
    if (passwordError || confirmPasswordError) {
      showError(
        '비밀번호 확인',
        '비밀번호 조건이 맞지 않거나 비밀번호가 일치하지 않습니다.',
      );
      return;
    }
    if (!isAgreed) {
      showError('동의 확인', '동의사항에 체크해주세요.');
      return;
    }

    setIsSaving(true);

    try {
      if (!localStorage.getItem('userKey')) {
        const res = await axios.post(
          'https://solpop.xyz/api/v1/auth/createSSAFYUser',
          {
            apiKey: import.meta.env.VITE_ADMIN_SECRET_KEY,
            userId: email,
          },
        );
        localStorage.setItem('userKey', res.data.userKey);
      }

      const { transmissionDate, transmissionTime, transmissionCode } =
        formatDateAndTime();

      if (!localStorage.getItem('accountNo')) {
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
        localStorage.setItem('accountNo', res.data.REC.accountNo);
      }

      // 나이와 성별 변환
      const ageGroupValue = ageGroup.replace('대', '');
      const genderValue = gender === '남성' ? 'male' : 'female';

      if (localStorage.getItem('userKey')) {
        await axios.post('https://solpop.xyz/api/v1/auth/signUp', {
          userId: email,
          password,
          name,
          userKey: localStorage.getItem('userKey'),
          accountNo: localStorage.getItem('accountNo'),
          ageGroup: ageGroupValue, // 나이 값을 20, 30, 40 등으로 전송
          gender: genderValue, // 성별을 male, female로 전송
        });
      }

      if (localStorage.getItem('accountNo')) {
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
          transactionBalance: '10000',
          transactionSummary: '(수시입출금) : 입금',
        });

        Swal.fire({
          icon: 'success',
          title: `환영합니다, ${name} 님!`,
          html: `이벤트로 제공된 10000원으로<br> 다양한 콘텐츠를 즐겨보세요!`,
          confirmButtonText: '로그인하기',
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('userKey');
            localStorage.removeItem('accountNo');
            navigate('/login');
          }
        });
      }
    } catch {
      showError('ERROR', '오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-semibold">회원가입</h2>

        {/* 이름 입력 */}
        <div className="group relative z-0 mb-6 w-full">
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

        {/* 이메일 입력 */}
        <div className="group relative z-0 mb-6 w-full">
          <div className="flex flex-row justify-between">
            <div className="flex w-2/3 flex-row">
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
              className="mt-2 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
            >
              중복확인
            </button>
          </div>
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="group relative z-0 mb-6 w-full">
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

        {/* 비밀번호 확인 */}
        <div className="group relative z-0 mb-6 w-full">
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

        {/* 나이 선택 */}
        <div className="group relative z-0 mb-6 w-full">
          <label
            htmlFor="ageGroup"
            className="block text-sm font-medium text-gray-700"
          >
            나이
          </label>
          <select
            name="ageGroup"
            id="ageGroup"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대">50대</option>
            <option value="60대 이상">60대 이상</option>
          </select>
        </div>

        {/* 성별 선택 */}
        <div className="group relative z-0 mb-6 w-full">
          <span className="block text-sm font-medium text-gray-700">성별</span>
          <div className="mt-2 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                name="gender"
                value="남성"
                checked={gender === '남성'}
                onChange={(e) => setGender(e.target.value)}
              />
              <span className="ml-2 text-gray-700">남성</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                name="gender"
                value="여성"
                checked={gender === '여성'}
                onChange={(e) => setGender(e.target.value)}
              />
              <span className="ml-2 text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="agreement"
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label htmlFor="agreement" className="ml-2 text-sm text-gray-900">
            회원가입시 계좌가 자동으로 생성됩니다.
          </label>
        </div>

        {/* 회원가입 버튼 */}
        <button
          onClick={() => handleSignUp()}
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          회원가입하기
        </button>

        {isSaving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white bg-opacity-80">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-dashed border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
