import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import {
  FullscreenControl,
  GeolocationControl,
  Map,
  Placemark,
  YMaps,
} from '@pbe/react-yandex-maps';

const YandexMapPicker = forwardRef(({ onSelect, initialCoords }, ref) => {
  const [coords, setCoords] = useState(initialCoords || [55.751574, 37.573856]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [foundOrganizations, setFoundOrganizations] = useState([]);

  const mapRef = useRef(null);
  const ymapsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    search: handleSearch,
    searchMultiple,
    searchOrganizations: async (query) => {
      if (!ymapsRef.current || !query?.trim()) return [];

      try {
        const results = await ymapsRef.current.search(query, {
          provider: 'yandex#search',
          results: 20,
        });

        const found = [];

        results.geoObjects.each((obj) => {
          const coords = obj.geometry.getCoordinates();
          const name =
            obj.properties.get('name') ||
            obj.getAddressLine() ||
            obj.properties.get('description') ||
            'Неизвестная точка';

          found.push({ name, coords });
        });

        setFoundOrganizations(found);

        // Центрируем карту по первой найденной
        if (found.length && mapRef.current) {
          mapRef.current.setCenter(found[0].coords, 14);
        }

        return found;
      } catch (err) {
        console.error('Ошибка поиска организаций:', err);
        return [];
      }
    },
    setCenter: (newCoords) => updateCoords(newCoords),
  }));

  const resolveAddressFromCoords = async (newCoords) => {
    try {
      if (!ymapsRef.current) return '';
      const res = await ymapsRef.current.geocode(newCoords);
      const firstGeoObject = res.geoObjects.get(0);
      if (!firstGeoObject) return '';
      const line = firstGeoObject.getAddressLine?.();
      return line || '';
    } catch (e) {
      return '';
    }
  };

  const updateCoords = async (newCoords) => {
    setCoords(newCoords);
    if (mapRef.current) {
      mapRef.current.setCenter(newCoords, 15);
    }
    const address = await resolveAddressFromCoords(newCoords);
    onSelect?.({ coords: { lat: newCoords[0], lon: newCoords[1] }, address });
  };

  const searchMultiple = async (query) => {
    const results = await ymapsRef.current.geocode(query, { results: 20 });
    const found = [];
    results.geoObjects.each((obj) => {
      const coords = obj.geometry.getCoordinates();
      const name = obj.getAddressLine();
      found.push({ name, coords });
    });
    return found;
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
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: '#333',
            }}
          >
            Загрузка карты...
          </div>
        )}

        <Map
          instanceRef={mapRef}
          state={{ center: coords, zoom: 15 }}
          width="100%"
          height="100%"
          modules={['geocode', 'SuggestView', 'vow', 'search']}
          onLoad={(ymaps) => {
            ymapsRef.current = ymaps;
            setIsLoaded(true);
          }}
          onClick={(e) => updateCoords(e.get('coords'))}
        >
          <GeolocationControl options={{ float: 'left' }} />
          <FullscreenControl />

          {/* Основной выбранный Placemark */}
          {Array.isArray(coords) && coords.length === 2 && (
            <Placemark
              geometry={coords}
              options={{ draggable: true, preset: 'islands#blueDotIcon' }}
              onDragEnd={(e) => updateCoords(e.get('target').geometry.getCoordinates())}
            />
          )}

          {/* Отображение найденных организаций */}
          {foundOrganizations.map((org, idx) => (
            <Placemark
              key={idx}
              geometry={org.coords}
              properties={{ balloonContent: org.name }}
              options={{ preset: 'islands#redDotIcon' }}
            />
          ))}
        </Map>
      </div>
    </YMaps>
  );
});

export default YandexMapPicker;
