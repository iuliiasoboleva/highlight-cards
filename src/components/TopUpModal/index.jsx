import React, { useState } from 'react';

import './styles.css';

const presetAmounts = [500, 1000, 1500, 2000];

const TopUpModal = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const num = parseInt(amount, 10);
    if (num > 0) {
      onConfirm(num);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>Пополнить баланс</h3>
        <div className="topup-preset-grid">
          {presetAmounts.map((a) => (
            <button key={a} className="preset-btn" onClick={() => setAmount(String(a))}>
              {a.toLocaleString('ru-RU')} ₽
            </button>
          ))}
        </div>
        <input
          type="number"
          className="topup-input"
          placeholder="Другая сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
        />
        <div className="modal-buttons">
          <button
            className="btn btn-dark"
            style={{ minWidth: 120 }}
            onClick={handleConfirm}
            disabled={!parseInt(amount || 0, 10)}
          >
            Пополнить
          </button>
          <button className="btn-light" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal; 