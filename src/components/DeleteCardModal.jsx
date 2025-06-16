import React from 'react';

import './DeleteCardModal.css';

const DeleteCardModal = ({ cardName, onConfirm, onCancel }) => (
  <div className="client-modal-overlay">
    <div className="client-modal">
      <div className="client-modal-header">
        <h3>Удаление карты</h3>
        <span className="client-modal-close" onClick={onCancel}>×</span>
      </div>
      <p className="client-modal-sub">Карта будет удалена безвозвратно</p>
      <p className="client-modal-question">Удалить карту {cardName}?</p>
      <div className="client-modal-actions">
        <button className="client-personal-btn save" onClick={onConfirm}>Удалить</button>
        <button className="client-personal-btn delete" onClick={onCancel}>Отменить</button>
      </div>
    </div>
  </div>
);

export default DeleteCardModal; 