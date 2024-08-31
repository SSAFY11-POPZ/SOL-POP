import React, { useState } from 'react';

const SkillsChart = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  const genderData = data.reduce(
    (acc, { memSex }) => {
      if (memSex === 'M') {
        acc.male += 1;
      } else if (memSex === 'F') {
        acc.female += 1;
      }
      return acc;
    },
    { male: 0, female: 0 },
  );

  const total = genderData.male + genderData.female;

  const malePercentage = ((genderData.male / total) * 100).toFixed(2);
  const femalePercentage = ((genderData.female / total) * 100).toFixed(2);

  const maleSize = malePercentage > femalePercentage ? 150 : 100;
  const femaleSize = femalePercentage > malePercentage ? 150 : 100;

  const CircularSkillBar = ({ percentage, text, color, size }) => {
    const [isHovered, setIsHovered] = useState(false);

    const thickness = 20;

    const circleStyle = {
      width: `${size}px`,
      height: `${size}px`,
      background: `conic-gradient(${color} ${percentage}%, #e2e8f0 ${percentage}% 100%)`,
      borderRadius: '50%',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      boxShadow: isHovered
        ? '0px 4px 15px rgba(0, 0, 0, 0.3)'
        : '0px 2px 10px rgba(0, 0, 0, 0.1)',
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          margin: '10px',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={circleStyle}>
          <div
            style={{
              width: `${size - thickness}px`,
              height: `${size - thickness}px`,
              margin: 'auto',
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: `solid ${thickness / 2}px ${color}`,
            }}
          >
            <span
              style={{ fontSize: '14px', fontWeight: 'bold', color: color }}
            >
              {text}
            </span>
            {isHovered && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                }}
              >
                <span
                  style={{ color: color, fontSize: '14px', fontWeight: 'bold' }}
                >
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
    <div style={{ textAlign: 'center', padding: '10px', color: '#888' }}>
      <p>여자 비율: {femalePercentage}%</p>
      <p>남자 비율: {malePercentage}%</p>
      <div
        className="flex items-center justify-center"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <CircularSkillBar
          percentage={malePercentage}
          text="남자"
          color="#007bff"
          size={maleSize}
        />
        <CircularSkillBar
          percentage={femalePercentage}
          text="여자"
          color="#ff6f61"
          size={femaleSize}
        />
      </div>
    </div>
  );
};

export default SkillsChart;
