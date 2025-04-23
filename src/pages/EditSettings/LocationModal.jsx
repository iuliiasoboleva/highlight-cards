import React, { useEffect, useRef, useState } from 'react';

import { useDebounce } from 'use-debounce';

import YandexMapPicker from '../../components/YandexMapPicker';

import './styles.css';

const LocationModal = ({ onClose, onSave }) => {
  const mapRef = useRef(null);
  const [name, setName] = useState('');
  const [pushText, setPushText] = useState('');
  const [visible, setVisible] = useState(true);
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

  const handleSubmit = () => {
    if (!selectedLocation) return;

    const newLocation = {
      name,
      address: selectedLocation.address || searchQuery,
      pushText,
      visible,
      coords: selectedLocation.coords,
    };

    onSave(newLocation);
    onClose();
  };

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-header">
          <h3 className="location-modal-title">Добавить локацию</h3>
          <button className="location-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <input
          type="text"
          className="location-modal-input"
          placeholder="Название локации"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <div className="location-modal-map">
          <YandexMapPicker
            ref={mapRef}
            onSelect={handleMapSelect}
            initialCoords={selectedLocation?.coords}
          />
        </div>

        <textarea
          className="location-modal-textarea"
          placeholder="Текст push-уведомления"
          value={pushText}
          onChange={(e) => setPushText(e.target.value)}
        />

        <div className="location-modal-actions">
          <button
            className="location-modal-button location-modal-button-primary"
            onClick={handleSubmit}
            disabled={!selectedLocation}
          >
            Добавить
          </button>
          <button
            className="location-modal-button location-modal-button-secondary"
            onClick={onClose}
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
