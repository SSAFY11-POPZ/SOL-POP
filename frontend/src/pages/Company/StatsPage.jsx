import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SkillsChart from './components/SkillsChart.jsx';
// import DayChartTab from './components/DayChartTab';
import TimeChartTab from './components/TimeChartTab';
import api from '../../utils/axios.jsx';

const StatsPage = () => {
  const { storeId } = useParams();
  const [slideIndex, setSlideIndex] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/v1/company/statistics/${storeId}`);
        const processedData = response.data.map((item) => ({
          reserveTime: item.reserveTime,
          reserveId: item.reserveId,
          memAge: item.member.memAge,
          memSex: item.member.memSex,
        }));
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [storeId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (current) => setSlideIndex(current),
  };

  const sliderRef = React.useRef(null);

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevious = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div
      className="stats-page"
      style={{
        color: '#2E2E2E',
        backgroundColor: '#F5F7FA',
        padding: '80px 20px',
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <header
        style={{
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #ddd',
        }}
      >
        <h1
          style={{
            color: '#444',
            fontSize: '36px',
            fontWeight: '700',
            animation: 'fadeInDown 1s ease-out',
          }}
        >
          방문자 통계
        </h1>
        <p
          style={{
            color: '#666',
            fontSize: '18px',
            fontWeight: '500',
          }}
        >
          주간 및 시간대별 유입인원 통계
        </p>
      </header>

      <div className="relative">
        <Slider ref={sliderRef} {...sliderSettings}>
          {/* 요일별 인원 레이더 차트
          <div key={`day-chart-${slideIndex}`}>
            <DayChartTab data={data} />
          </div> */}

          {/* 시간대별 인원 라인 차트 */}
          <div key={`time-chart-${slideIndex}`}>
            <TimeChartTab data={data} />
          </div>

          {/* 새 슬라이드: 원형 프로그레스 차트 */}
          <div key={`skills-chart-${slideIndex}`}>
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
                성별 유입 인원 비율
              </h2>
              <SkillsChart data={data} />
            </div>
          </div>
        </Slider>
        <div
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 transform cursor-pointer items-center justify-center"
        >
          &lt;
        </div>
        <div
          onClick={handleNext}
          className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 transform cursor-pointer items-center justify-center"
        >
          &gt;
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
