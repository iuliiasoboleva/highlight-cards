import React, { useState, useEffect } from 'react';
import ConfirmModal from '../ConfirmModal';
import { useSelector } from 'react-redux';

const NetworkModal = ({ isOpen, onClose, onSave, onDelete = () => {}, initialData = {}, isEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const branches = useSelector((state) => state.locations.list);
  // точки, которые можно выбрать: без сети или уже принадлежащие редактируемой сети
  const availableBranches = branches.filter((b) => {
    if (isEdit) return !b.network_id || b.network_id === initialData.id;
    return !b.network_id; // при создании — только свободные
  });

  const needScroll = availableBranches.length > 7;

  useEffect(() => {
    if (!isOpen) return;

    setName(initialData.name || '');
    setDescription(initialData.description || '');

    if (isEdit) {
      const preselected = branches
        .filter((b) => b.network_id === initialData.id)
        .map((b) => b.id);
      setSelectedBranches(preselected);
    } else {
      setSelectedBranches([]);
    }
  }, [initialData, isOpen, branches, isEdit]);

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
          style={{ padding: '10px' }}
        />
        <div className="modal-section">
          <h4>Выберите точки продаж:</h4>
          <div
            style={{
              maxHeight: needScroll ? 220 : 'auto',
              overflowY: needScroll ? 'auto' : 'visible',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: 6,
            }}
          >
            {availableBranches.map((br) => (
              <label key={br.id} style={{ display: 'block', marginBottom: 4 }}>
                <input
                  type="checkbox"
                  checked={selectedBranches.includes(br.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBranches([...selectedBranches, br.id]);
                    } else {
                      setSelectedBranches(selectedBranches.filter((id) => id !== br.id));
                    }
                  }}
                />{' '}
                {br.name}
              </label>
            ))}
            {availableBranches.length === 0 && <p style={{ fontSize: 14 }}>Нет доступных точек.</p>}
          </div>
        </div>
        <div className="modal-buttons">
          <button
            className="btn btn-dark"
            onClick={() => {
              if (!name.trim()) return;
              onSave({ id: initialData.id, name: name.trim(), description, branches: selectedBranches });
            }}
          >
            Сохранить
          </button>
          {isEdit && (
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Удалить
            </button>
          )}
          <button className="btn-light" onClick={onClose}>
            Отмена
          </button>
        </div>
        <ConfirmModal
          small
          isOpen={showDeleteConfirm}
          message="Удалить сеть без возможности восстановления? Все связанные точки останутся без сети."
          confirmText="Удалить"
          cancelText="Отмена"
          onConfirm={() => {
            onDelete(initialData.id);
            setShowDeleteConfirm(false);
            onClose();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
};

export default NetworkModal; 