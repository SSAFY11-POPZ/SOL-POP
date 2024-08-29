import React from 'react';

const InfoTab = ({ detailData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\./g, '-').replace(/-$/g, '');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).replace('오전 ', '').replace('오후 ', '');
  };

  return (
    <div className="detail-description">
      <p>{detailData.store.storeDetail}</p>
      <ul>
        <li>기간 : {formatDate(detailData.store.storeStartDate)} ~ {formatDate(detailData.store.storeEndDate)}</li>
        <li>시간 : {formatTime(detailData.store.storeStartDate)} ~ {formatTime(detailData.store.storeEndDate)}</li>
        <li>위치 : {detailData.store.storePlace}</li>
        <li>스토어 키워드 : {detailData.store.storeKeyword}</li>
      </ul>
      <br></br>
      <p className="detail-hashtags" style={{ color: '#4472EA' }}>
        {detailData.store.hashtag}
      </p>
    </div>
  );
};

export default InfoTab;
