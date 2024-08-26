import React from 'react';

const InfoTab = ({ detailData }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace('오전 ', '').replace('오후 ', '');
  };

  return (
    <div className="detail-description">
      <p>{detailData.store.storeDetail}</p>
      <ul>
        <li>기간 : {formatDateTime(detailData.store.storeStartDate)} ~ {formatDateTime(detailData.store.storeEndDate)}</li>
        <li>위치 : {detailData.store.storePlace}</li>
        <li>비용 : {detailData.store.storePrice}</li>
        <li>스토어 키워드 : {detailData.store.storeKeyword}</li>
      </ul>
      <br></br>
      <p className="detail-hashtags" style={{ color: 'blue' }}>
        {detailData.store.hashtag}
      </p>
    </div>
  );
};

export default InfoTab;
