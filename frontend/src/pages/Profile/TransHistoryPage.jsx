import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { checkTokenValidity } from '../../utils/axios';
import UpperBar from '../../components/UpperBar';


const TransHistoryPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // 거래내역 가져오기
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!localStorage.getItem('accessToken')) {
          navigate('/login');
          return;
        }
        // 토큰이 유효한지 검증
        const checkToken = await checkTokenValidity();
        console.log(checkToken);
        if (!checkToken || checkToken.status !== 200) {
          console.log(checkToken);
          return;
        }
        const response = await api.get('/api/v1/user/point/usageHistory');
        // 서버로부터 데이터를 받아와 transactions에 할당
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchTransactions(); // 비동기 함수 호출
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    const formattedTime = `${date.getHours()}시 ${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}분`;
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="mx-4 my-3">
      <UpperBar title={'거래내역 조회'} />
      {transactions.map((transaction) => (
        <div
          key={transaction.pointId}
          className="px-3 py-5 border-b border-gray-200"
        >
          <div>
            <div className="text-sm text-gray-500">
              {formatDate(transaction.pointUsedAt)}
            </div>
            <div className="font-bold">{transaction.pointPlace}</div>
          </div>
          <div className="text-end">잔액 {transaction.afterBalance}</div>
          <div
            className={`font-bold ${
              transaction.pointPlace === '포인트 충전'
                ? 'text-blue-500'
                : 'text-red-500'
            } text-end`}
          >
            {transaction.useAmount.toLocaleString()}원
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransHistoryPage;
