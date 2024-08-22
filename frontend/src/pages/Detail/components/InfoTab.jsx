import React from 'react';

const InfoTab = ({ detailData }) => (
  <div className="detail-description">
    <p>{detailData.content}</p>
    <ul>
      <li>기간 : {detailData.popUpStoreStartDate} ~ {detailData.popUpStoreEndDate}</li>
      <li>시간 : {detailData.time}</li>
      <li>비용 : {detailData.popUpStorePrice}</li>
      <li>{detailData.popUpStoreDetail}</li>
    </ul>
    <p className="detail-hashtags">{detailData.popUpStoreHashtag}</p>
  </div>
);

export default InfoTab;
