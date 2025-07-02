import React from 'react';

import './styles.css';

const PushPreview = ({ card, message, scheduledDate }) => {
  return (
    <div className="push-preview-wrapper">
      <div className="push-preview">
        <div className="push-header">
          <div className="push-header-title">
            <img src={card.design.icon || '/push-logotype.svg'} alt="logo" className="push-logo" />
            <span className="push-title">
              {(card?.infoFields.companyName || 'Название компании').toUpperCase()}
            </span>
          </div>
          <span className="push-time">{scheduledDate || 'сейчас'}</span>
        </div>
        <div className="push-message">
          {message ||
            'Текст push-сообщения в боковом превью сервиса с возможностью использования emojis 👀 🧾 💬 😍'}
        </div>
      </div>
    </div>
  );
};

export default PushPreview;
