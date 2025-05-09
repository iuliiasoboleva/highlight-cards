import React from 'react';

import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './styles.css';

const PushPreview = ({ card, message, scheduledDate }) => {
  return (
    <div className="card-info" style={{ maxWidth: '210px' }}>
      {scheduledDate && (
        <div className="push-preview-header">
          <FontAwesomeIcon icon={faBell} className="push-app-icon" />
          <div className="push-time">
            Запланировано на: {new Date(scheduledDate).toLocaleString()}
          </div>
        </div>
      )}
      <div className="push-preview-content">
        <div className="push-title">{card?.title || 'Уведомление'}</div>
        <div className="push-message">{message || 'Новое сообщение'}</div>
      </div>
    </div>
  );
};

export default PushPreview;
