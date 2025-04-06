import React, { useState } from 'react';

import YandexMapPicker from '../../components/YandexMapPicker';

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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Добавить локацию</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder="Название локации"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Введите адрес локации"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <YandexMapPicker
          onSelect={({ coords }) => {
            console.log('Выбранные координаты:', coords);
            // можно сохранять в state адрес или координаты
          }}
        />

        <textarea
          placeholder="Текст push-уведомления"
          value={pushText}
          onChange={(e) => setPushText(e.target.value)}
        />

        <label className="toggle-container">
          Отображать
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          <span className="slider" />
        </label>

        <div className="modal-actions">
          <button className="btn btn-black" onClick={handleSubmit}>
            Добавить
          </button>
          <button className="btn btn-white" onClick={onClose}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
