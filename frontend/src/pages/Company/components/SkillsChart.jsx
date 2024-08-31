import React, { useState } from 'react';

const SkillsChart = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // 성별로 그룹화된 총 유입인원 계산
  const genderData = data.reduce(
    (acc, { 성별, 유입인원 }) => {
      if (성별 === '남') {
        acc.male += 유입인원;
      } else if (성별 === '여') {
        acc.female += 유입인원;
      }
      return acc;
    },
    { male: 0, female: 0 },
  );

  const total = genderData.male + genderData.female;

  // 퍼센트 계산
  const malePercentage = ((genderData.male / total) * 100).toFixed(2);
  const femalePercentage = ((genderData.female / total) * 100).toFixed(2);

  const CircularSkillBar = ({ percentage, text, color, size, rotation }) => {
    const [isHovered, setIsHovered] = useState(false);

    const circleStyle = {
      width: `${size}px`,
      height: `${size}px`,
      background: `conic-gradient(${color} ${percentage}%, transparent ${percentage}%)`,
      borderRadius: '50%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `rotate(${rotation}deg)`, // Rotate to vary start position
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${size}px`,
          height: `${size}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={circleStyle}>
          <div
            style={{
              width: `${size - 20}px`,
              height: `${size - 20}px`,
              margin: '10px auto',
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '12px', color: color }}>{text}</span>
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                }}
              >
                <span style={{ color: color, fontSize: '12px' }}>
                  {percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: '300px', height: '300px', position: 'relative' }}
    >
      <CircularSkillBar
        percentage={femalePercentage}
        text="여자"
        color="#ff6f61"
        size={200} // 가장 큰 원
        rotation={0} // 기본 위치
      />
      <CircularSkillBar
        percentage={malePercentage}
        text="남자"
        color="#007bff"
        size={150} // 중간 원
        rotation={45} // 회전하여 시작 위치 변경
        borderRadius="1"
      />
    </div>
  );
};

export default SkillsChart;
