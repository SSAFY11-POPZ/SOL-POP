import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const aggregateDataByTime = (data) => {
  const result = {};
  data.forEach(({ 시간대, 유입인원, 성별 }) => {
    if (!result[시간대]) result[시간대] = { 시간대, 남: 0, 여: 0 };
    result[시간대][성별] += 유입인원;
  });
  return Object.values(result);
};

const TimeChartTab = ({ data }) => {
  const dataByTime = aggregateDataByTime(data);
  const maxVisitorTime = dataByTime.reduce(
    (max, curr) => (curr.남 + curr.여 > max.남 + max.여 ? curr : max),
    dataByTime[0],
  );

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
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
        시간대별 인원
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
        최대 유입 시간대: {maxVisitorTime.시간대} (
        {maxVisitorTime.남 + maxVisitorTime.여}명)
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart
          data={dataByTime}
          margin={{ top: 10, right: 40, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
          <XAxis dataKey="시간대" stroke="#555" />
          <YAxis stroke="#555" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="남"
            stroke="#6C63FF"
            strokeWidth={2}
            activeDot={{ r: 8, fill: '#6C63FF' }}
            dot={{ stroke: '#6C63FF', strokeWidth: 2, fill: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="여"
            stroke="#FF6B6B"
            strokeWidth={2}
            activeDot={{ r: 8, fill: '#FF6B6B' }}
            dot={{ stroke: '#FF6B6B', strokeWidth: 2, fill: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="남"
            fill="#6C63FF"
            fillOpacity={0.1}
            stroke={false}
          />
          <Area
            type="monotone"
            dataKey="여"
            fill="#FF6B6B"
            fillOpacity={0.1}
            stroke={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeChartTab;
