import React from 'react';

import CustomInput from '../../customs/CustomInput';

import './styles.css';

const BalanceModal = ({ type, onClose }) => {
  const title = type === 'increase' ? 'Насколько увеличить баланс?' : 'Насколько уменьшить баланс?';
  return (
    <div className="client-modal-overlay">
      <div className="client-modal">
        <div className="client-modal-header">
          <h3>Изменение баланса</h3>
          <button className="client-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <p>{title}</p>

        <p>
          Для: <strong></strong>
        </p>
        <label>Значение:</label>
        <CustomInput type="number" placeholder="Введите значение" />
        <label>Сумма покупки:</label>
        <CustomInput type="number" placeholder="₽" />
        <label>Комментарий:</label>
        <textarea placeholder="Комментарий (необязательно)" />

        <div className="client-modal-actions">
          <button className="primary">Применить</button>
          <button onClick={onClose}>Отменить</button>
        </div>
      </div>
    </div>
  );
};

export default BalanceModal;
