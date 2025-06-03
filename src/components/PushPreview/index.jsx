import React from 'react';

import { Bell } from 'lucide-react';

import './styles.css';

const PushPreview = ({ card, message, scheduledDate }) => {
  return (
    <div className="card-info" style={{ maxWidth: '210px' }}>
      {scheduledDate && (
        <div className="push-preview-header">
          <Bell className="push-app-icon" size={16} />
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
