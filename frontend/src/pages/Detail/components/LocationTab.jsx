import React, { useEffect, useState, useRef } from 'react';

function KakaoMap({ address }) {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);
  const customOverlayRef = useRef(null);

  useEffect(() => {
    const initializeMap = (coords) => {
      const container = mapContainerRef.current;
      const options = {
        center: coords,
        level: 3,
      };

      const newMap = new window.kakao.maps.Map(container, options);
      setMap(newMap);

      const marker = new window.kakao.maps.Marker({
        map: newMap,
        position: coords,
      });
      markerRef.current = marker;

      const content = `
        <div style="
          padding: 10px;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
          text-align: center;
          font-size: 14px;
          color: #333;
          font-weight: bold;
          ">
          <p>${address}</p>
        </div>`;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        map: newMap,
        position: coords,
        content: content,
        yAnchor: 2.2,
        clickable: true,
      });
      customOverlayRef.current = customOverlay;

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (customOverlay.getMap()) {
          customOverlay.setMap(null);
        } else {
          customOverlay.setMap(newMap);
        }
      });
    };

    const loadKakaoMapScript = () => {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_KAKAO_API_KEY;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
              initializeMap(coords);
            } else {
              console.error('주소 검색 결과를 가져오지 못했습니다.');
            }
          });
        });
      };

      script.onerror = () => {
        console.error('Failed to load Kakao maps SDK.');
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    if (!window.kakao || !window.kakao.maps) {
      loadKakaoMapScript();
    } else if (!map) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          initializeMap(coords);
        } else {
          console.error('주소 검색 결과를 가져오지 못했습니다.');
        }
      });
    }
  }, [address, map]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '320px' }}></div>
  );
}

export default KakaoMap;
