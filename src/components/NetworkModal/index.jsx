import React, { useState, useEffect } from 'react';
import CustomSelect from '../CustomSelect';

const NetworkModal = ({ isOpen, onClose, onSave, onDelete = () => {}, initialData = {}, isEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEdit ? 'Редактировать сеть' : 'Создать сеть'}</h3>
        <input
          type="text"
          placeholder="Название сети"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="modal-input"
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button
            className="btn btn-dark"
            onClick={() => {
              if (!name.trim()) return;
              onSave({ id: initialData.id, name: name.trim(), description });
            }}
          >
            Сохранить
          </button>
          {isEdit && (
            <button
              className="btn btn-danger"
              onClick={() => {
                onDelete(initialData.id);
              }}
            >
              Удалить
            </button>
          )}
          <button className="btn-light" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkModal; 