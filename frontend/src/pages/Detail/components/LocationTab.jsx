import React, { useEffect } from 'react';

const LocationTab = ({ address }) => {

  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_API_KEY;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            const container = document.getElementById('map');
            const options = {
              center: coords,
              level: 3,
              mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
            };

            const map = new window.kakao.maps.Map(container, options);


            const markerImage = new window.kakao.maps.MarkerImage(
              'public/custom-marker.png',
              new window.kakao.maps.Size(64, 69),
              { offset: new window.kakao.maps.Point(27, 69) }
            );

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
              image: markerImage,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`
            });
            infowindow.open(map, marker);
          } else {
            console.error("Geocode was not successful for the following reason: " + status);
          }
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [address]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default LocationTab;
