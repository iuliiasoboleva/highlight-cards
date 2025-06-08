import React from 'react';
import { Trash2, Copy } from 'lucide-react';

import './styles.css';
import { mockPushHistory } from '../../mocks/mockPushHistory';

const PushHistory = () => {
  return (
    <div className="push-history-wrapper">
      <h3 className="push-history-title">История отправки</h3>
      <div className="push-history-list">
        {mockPushHistory.map(({ id, date, message, delivered }) => (
          <div key={id} className="push-history-item">
            <div className="push-history-meta">
              <span className="push-history-date">{date}</span>
              <span className="push-history-status">
                Доставлено:{delivered}{' '}
                <Copy size={14} className="push-history-icon" />
                <Trash2 size={14} className="push-history-icon danger" />
              </span>
            </div>
            <div className="push-history-message">{message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PushHistory;
