import React, { useEffect, useRef, useState } from 'react';

import { GeolocationControl, Map, Placemark, SearchControl, YMaps } from '@pbe/react-yandex-maps';

const YandexMapPicker = ({ onSelect }) => {
  const [coords, setCoords] = useState([55.751574, 37.573856]);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude];
          setCoords(userCoords);
          onSelect({ coords: { lat: userCoords[0], lon: userCoords[1] } });
        },
        (error) => {
          console.warn('Геолокация недоступна:', error.message);
        },
      );
    }
  }, []);

  const handleMapClick = (e) => {
    const newCoords = e.get('coords');
    setCoords(newCoords);
    onSelect({ coords: { lat: newCoords[0], lon: newCoords[1] } });
  };

  return (
    <div className="map-placeholder">
      <YMaps
        query={{
          lang: 'ru_RU',
          apikey: 'a886f296-c974-43b3-aa06-a94c782939c2',
        }}
      >
        <Map
          state={{ center: coords, zoom: 15 }}
          width="100%"
          height="300px"
          onClick={handleMapClick}
          instanceRef={mapRef}
          onLoad={(ymaps) => {
            window.ymaps = ymaps;
            setMapReady(true);
          }}
        >
          <GeolocationControl options={{ float: 'left' }} />
          <SearchControl options={{ float: 'right' }} />
          {mapReady && (
            <Placemark
              geometry={coords}
              options={{ draggable: true }}
              onDragEnd={(e) => {
                const newCoords = e.get('target').geometry.getCoordinates();
                setCoords(newCoords);
                onSelect({ coords: { lat: newCoords[0], lon: newCoords[1] } });
              }}
            />
          )}
        </Map>
      </YMaps>
    </div>
  );
};

export default YandexMapPicker;
