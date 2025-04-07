import React, { useState } from 'react';

import YandexMapPicker from '../../components/YandexMapPicker';

import './styles.css';

const LocationModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pushText, setPushText] = useState('');
  const [visible, setVisible] = useState(true);

  const handleSubmit = () => {
    const newLocation = { name, address, pushText, visible };
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

        <input
          type="text"
          className="location-modal-input"
          placeholder="Введите адрес локации"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="location-modal-map">
          <YandexMapPicker
            onSelect={({ coords }) => {
              console.log('Выбранные координаты:', coords);
            }}
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
