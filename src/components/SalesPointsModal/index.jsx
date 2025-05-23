import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { nanoid } from '@reduxjs/toolkit';
import { useDebounce } from 'use-debounce';

import { assignManagerToSalesPoint } from '../../store/managersSlice';
import CustomSelect from '../CustomSelect';
import YandexMapPicker from '../YandexMapPicker';

const SalesPointsModalWithMap = ({ isOpen, onClose, onSave }) => {
  const dispatch = useDispatch();
  const allManagers = useSelector((state) => state.managers);

  const mapRef = useRef(null);

  const [selectedManager, setSelectedManager] = useState(null);
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 1500);

  useEffect(() => {
    if (allManagers.length > 0 && !selectedManager) {
      setSelectedManager(allManagers[0].id);
    }
  }, [allManagers, selectedManager]);

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
        console.error('Ошибка поиска адреса:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchAddress();
  }, [debouncedSearchQuery]);

  const handleMapSelect = (location) => {
    setSelectedLocation(location);
  };

  const resetForm = () => {
    setSelectedManager(null);
    setName('');
    setSearchQuery('');
    setSelectedLocation(null);
    setIsSearching(false);
  };

  const handleSave = () => {
    if (!name.trim() || !selectedLocation) {
      alert('Введите название и выберите адрес на карте');
      return;
    }

    const generatedId = nanoid();
    const newSalesPoint = {
      id: generatedId,
      name,
      address: selectedLocation.address,
      coords: selectedLocation.coords,
      employees: selectedManager ? [selectedManager] : [],
    };

    onSave(newSalesPoint);

    if (selectedManager) {
      dispatch(assignManagerToSalesPoint({ managerId: selectedManager, salesPointName: name }));
    }

    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Добавить точку продаж с картой</h3>

        <input
          type="text"
          placeholder="Название точки"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="modal-input"
        />

        <input
          type="text"
          placeholder="Введите адрес"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="modal-input"
        />
        {isSearching && <div className="search-loading">Поиск адреса...</div>}

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

        <div className="modal-section">
          <h4>Ответственный сотрудник:</h4>
          <CustomSelect
            value={selectedManager}
            onChange={setSelectedManager}
            options={allManagers.map((manager) => ({
              value: manager.id,
              label: `${manager.name} ${manager.surname}`,
            }))}
          />
        </div>

        <div className="modal-buttons">
          <button className="btn btn-dark" onClick={handleSave}>
            Сохранить
          </button>
          <button
            className="btn-light"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPointsModalWithMap;
