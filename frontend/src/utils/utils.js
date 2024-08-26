export const formatDateAndTime = () => {
    // 현재 날짜와 시간을 얻기 위해 Date 객체 생성
    const now = new Date();

    // 날짜 형식을 YYYYMMDD로 만들기 위해 연도, 월, 일 값을 추출 및 포맷팅
    const year = now.getFullYear(); // 연도 (예: 2024)
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1 필요, 예: 08)
    const day = String(now.getDate()).padStart(2, '0'); // 일 (예: 26)

    // 최종적으로 YYYYMMDD 형식의 날짜 문자열 생성
    const transmissionDate = `${year}${month}${day}`;

    // 시간 형식을 HHMMSS로 만들기 위해 시, 분, 초 값을 추출 및 포맷팅
    const hours = String(now.getHours()).padStart(2, '0'); 
    const minutes = String(now.getMinutes()).padStart(2, '0'); 
    const seconds = String(now.getSeconds()).padStart(2, '0'); 

    // 최종적으로 HHMMSS 형식의 시간 문자열 생성
    const transmissionTime = `${hours}${minutes}${seconds}`;
    
    // 고유한 전송 코드를 생성 (YYYYMMDDHHMMSS + 6자리 난수)
    // 난수는 100000부터 999999 사이의 숫자를 생성
    const transmissionCode = `${transmissionDate}${transmissionTime}${Math.floor(100000 + Math.random() * 900000)}`;
    
    // 생성된 날짜, 시간, 코드 값을 객체로 반환
    return { transmissionDate, transmissionTime, transmissionCode };
}
