import React, { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { YMaps, Map, Placemark, GeolocationControl, FullscreenControl } from '@pbe/react-yandex-maps';

const YandexMapPicker = forwardRef(({ onSelect, initialCoords }, ref) => {
  const [coords, setCoords] = useState(initialCoords || [55.751574, 37.573856]);
  const mapRef = useRef(null);
  const ymapsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    search: handleSearch,
    setCenter: (newCoords) => updateCoords(newCoords)
  }));

  const updateCoords = (newCoords) => {
    setCoords(newCoords);
    if (mapRef.current) {
      mapRef.current.setCenter(newCoords, 15);
    }
    onSelect?.({ coords: { lat: newCoords[0], lon: newCoords[1] } });
  };

  const handleSearch = async (query) => {
    if (!ymapsRef.current || !query?.trim()) return null;

    try {
      const results = await ymapsRef.current.geocode(query);
      const firstGeoObject = results.geoObjects.get(0);

      if (firstGeoObject) {
        const newCoords = firstGeoObject.geometry.getCoordinates();
        updateCoords(newCoords);
        return newCoords;
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
      throw error;
    }
    return null;
  };

  return (
    <YMaps
      query={{
        lang: 'ru_RU',
        apikey: 'a886f296-c974-43b3-aa06-a94c782939c2',
        load: 'package.full',
      }}
    >
      <Map
        instanceRef={mapRef}
        state={{ center: coords, zoom: 15 }}
        width="100%"
        height="400px"
        modules={['geocode']}
        onLoad={(ymaps) => { ymapsRef.current = ymaps; }}
        onClick={(e) => updateCoords(e.get('coords'))}
      >
        <GeolocationControl options={{ float: 'left' }} />
        <FullscreenControl />
        <Placemark
          geometry={coords}
          options={{ draggable: true, preset: 'islands#blueDotIcon' }}
          onDragEnd={(e) => updateCoords(e.get('target').geometry.getCoordinates())}
        />
      </Map>
    </YMaps>
  );
});

export default YandexMapPicker;