import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDebounce } from 'use-debounce';

import CardInfo from '../../components/CardInfo';
import YandexMapPicker from '../../components/YandexMapPicker';

import './styles.css';

const MAX_LOCATIONS = 10;

const Locations = () => {
  const mapRef = useRef(null);
  const { id } = useParams();

  const [locations, setLocations] = useState([]);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 2000);

  useEffect(() => {
    const searchAddress = async () => {
      if (!debouncedSearchQuery || !mapRef.current) return;

      try {
        setIsSearching(true);
        const coords = await mapRef.current.search(debouncedSearchQuery.trim());

        if (coords && Array.isArray(coords) && coords.length === 2) {
          setSelectedLocation({
            address: debouncedSearchQuery,
            coords: {
              lat: coords[0],
              lon: coords[1],
            },
          });
        }
      } catch (error) {
        console.error('Ошибка поиска:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchAddress();
  }, [debouncedSearchQuery]);

  const handleMapSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleAddLocation = () => {
    if (!currentCoords || !currentAddress || locations.length >= MAX_LOCATIONS) return;

    const newLocation = {
      name: currentAddress,
      coords: currentCoords,
      active: true,
    };

    setLocations((prev) => [...prev, newLocation]);
    setCurrentCoords(null);
    setCurrentAddress('');
  };

  const toggleLocation = (index) => {
    const updated = [...locations];
    updated[index].active = !updated[index].active;
    setLocations(updated);
  };

  return (
    <div className="edit-type-main-container">
      <div className="edit-type-page">
        <h2 className="locations-title">
          Локации <span className="geo-badge">Geo-push в радиусе 100 метров</span>
        </h2>

        <p className="locations-subtext">
          На вашем тарифе <strong>доступно {MAX_LOCATIONS - locations.length} локаций</strong>.
        </p>

        {limitReached && (
          <div className="limit-alert">Вы достигли лимита в {MAX_LOCATIONS} локаций</div>
        )}

        <div className="search-container">
          <input
            type="text"
            className="location-modal-input"
            placeholder="Введите адрес локации"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
          />
          {isSearching && <div className="search-loading">Идет поиск...</div>}
        </div>

        {selectedLocation && (
          <div className="location-info">
            <p>Выбрано: {selectedLocation.address}</p>
            <p>
              Координаты: {selectedLocation.coords.lat.toFixed(6)},{' '}
              {selectedLocation.coords.lon.toFixed(6)}
            </p>
          </div>
        )}

        <YandexMapPicker
          ref={mapRef}
          onSelect={handleMapSelect}
          initialCoords={selectedLocation?.coords}
        />

        {currentAddress && (
          <div className="location-preview">
            <p>
              <strong>Выбранный адрес:</strong> {currentAddress}
            </p>
            <button
              className="btn-dark"
              onClick={handleAddLocation}
              disabled={locations.length >= MAX_LOCATIONS}
            >
              Добавить локацию
            </button>
          </div>
        )}

        <div className="location-list">
          {locations.map((loc, index) => (
            <div key={index} className="location-card">
              <div className="location-info">
                <strong>{loc.name}</strong>
                <div className="location-coords">
                  {loc.coords[0].toFixed(5)}, {loc.coords[1].toFixed(5)}
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={loc.active}
                  onChange={() => toggleLocation(index)}
                />
                <span className="slider round" />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="type-card-image-container">
        <img className="card-image-add" src="/phone.svg" alt="preview" />
        <CardInfo card={{ id, title: 'Карта', name: 'Накопительная карта' }} />
      </div>
    </div>
  );
};

export default Locations;
