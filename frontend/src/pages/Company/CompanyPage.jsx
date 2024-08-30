import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './CompanyPage.css';

const CompanyPage = () => {
  const [storeName, setStoreName] = useState('');
  const [storeStartDate, setStoreStartDate] = useState('');
  const [storeEndDate, setStoreEndDate] = useState('');
  const [storePlace, setStorePlace] = useState('');
  const [storeDetail, setStoreDetail] = useState('');
  const [storeKeyword, setStoreKeyword] = useState('');
  const [storeRsvPriority, setStoreRsvPriority] = useState(true);
  const [storeCapacity, setStoreCapacity] = useState(50);
  const [storePrice, setStorePrice] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setImageFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  const handleDateChange = (date, type) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (type === 'start') {
      setStoreStartDate(formattedDate);
    } else {
      setStoreEndDate(formattedDate);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName || !storePlace || !storeStartDate || !storeEndDate) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    alert('제출이 완료되었습니다.');
    window.location.reload(); // 화면을 새로고침하여 초기화
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">스토어 정보 등록</h2>

      <div className="form-group">
        <label className="form-label">가게 이름 <span className="required">*</span></label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="form-input"
          placeholder="가게 이름을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">장소 <span className="required">*</span></label>
        <input
          type="text"
          value={storePlace}
          onChange={(e) => setStorePlace(e.target.value)}
          className="form-input"
          placeholder="장소를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">시작 날짜 <span className="required">*</span></label>
        <input
          type="date"
          value={storeStartDate}
          onChange={(e) => handleDateChange(new Date(e.target.value), 'start')}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">종료 날짜 <span className="required">*</span></label>
        <input
          type="date"
          value={storeEndDate}
          onChange={(e) => handleDateChange(new Date(e.target.value), 'end')}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">상세 내용</label>
        <textarea
          value={storeDetail}
          onChange={(e) => setStoreDetail(e.target.value)}
          className="form-textarea"
          placeholder="상세 내용을 입력하세요"
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">키워드</label>
        <input
          type="text"
          value={storeKeyword}
          onChange={(e) => setStoreKeyword(e.target.value)}
          className="form-input"
          placeholder="키워드를 입력하세요"
        />
      </div>

      <div className="form-group">
        <label className="form-label">수용 인원</label>
        <input
          type="number"
          value={storeCapacity}
          onChange={(e) => setStoreCapacity(e.target.value)}
          className="form-input"
          placeholder="수용 인원을 입력하세요"
          min="1"
        />
      </div>

      <div className="form-group">
        <label className="form-label">입장료</label>
        <input
          type="number"
          value={storePrice}
          onChange={(e) => setStorePrice(e.target.value)}
          className="form-input"
          placeholder="입장료를 입력하세요"
          min="0"
        />
      </div>

      <div className="form-group">
        <label className="form-label">이미지 첨부</label>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {!imageFiles.length && (
            <p>이미지를 이곳에 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.</p>
          )}
          <div className="image-preview">
            {imageFiles.map((file) => (
              <img key={file.name} src={file.preview} alt="Preview" className="form-image" />
            ))}
          </div>
        </div>
      </div>

      <div className="form-button-container">
        <button
          type="submit"
          className="form-submit-button"
        >
          제출하기
        </button>
      </div>
    </form>
  );
};

export default CompanyPage;
