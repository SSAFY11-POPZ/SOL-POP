import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const aggregateDataByDay = (data) => {
  const result = {};
  data.forEach(({ 요일, 유입인원, 성별 }) => {
    if (!result[요일]) result[요일] = { 요일, 남: 0, 여: 0 };
    result[요일][성별] += 유입인원;
  });
  return Object.values(result);
};

const DayChartTab = ({ data }) => {
  const dataByDay = aggregateDataByDay(data);
  const maxVisitorDay = dataByDay.reduce(
    (max, curr) => (curr.남 + curr.여 > max.남 + max.여 ? curr : max),
    dataByDay[0],
  );

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '420px',
      }}
    >
      <h2
        style={{
          color: '#444',
          marginBottom: '10px',
          fontSize: '24px',
          fontWeight: '700',
        }}
      >
        요일별 인원
      </h2>
      <div
        style={{
          color: '#888',
          fontSize: '16px',
          fontWeight: '500',
          marginTop: '10px',
          animation: 'fadeIn 0.5s ease',
        }}
      >
        최대 유입 요일: {maxVisitorDay.요일} (
        {maxVisitorDay.남 + maxVisitorDay.여}명)
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dataByDay}>
          <PolarGrid stroke="#E6E6E6" />
          <PolarAngleAxis dataKey="요일" stroke="#555" />
          <PolarRadiusAxis angle={30} domain={[0, 250]} stroke="#AAA" />
          <Radar
            name="남"
            dataKey="남"
            stroke="#6C63FF"
            fill="#6C63FF"
            fillOpacity={0.7}
          />
          <Radar
            name="여"
            dataKey="여"
            stroke="#FF6B6B"
            fill="#FF6B6B"
            fillOpacity={0.7}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DayChartTab;
