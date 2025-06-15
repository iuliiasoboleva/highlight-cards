import React from 'react';

import './styles.css';

const DeleteClientModal = ({ fullName, onConfirm, onCancel }) => {
  return (
    <div className="client-modal-overlay">
      <div className="client-modal">
        <div className="client-modal-header">
          <h3>Удаление клиента</h3>
          <span className="client-modal-close" onClick={onCancel}>
            ×
          </span>
        </div>
        <p className="client-modal-sub">Информация будет удалена безвозвратно</p>
        <p className="client-modal-question">Удалить клиента {fullName}?</p>
        <div className="client-modal-actions">
          <button className="client-personal-btn save" onClick={onConfirm}>
            Удалить
          </button>
          <button className="client-personal-btn delete" onClick={onCancel}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
