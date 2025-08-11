import React from 'react';

import CustomInput from '../../customs/CustomInput';

import './styles.css';

const ConnectModal = ({ service, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="connect-modal">
        <div className="modal-header">
          <h3>Подключение аккаунта {service.name}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form>
          {service.fields.map((field, index) => (
            <CustomInput key={index} type="text" placeholder={field} required />
          ))}
          <div className="modal-actions">
            <button type="submit" className="btn-dark">
              Подключить
            </button>
            <button type="button" className="btn-light" onClick={onClose}>
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectModal;
