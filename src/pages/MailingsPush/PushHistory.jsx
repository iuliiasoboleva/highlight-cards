import React from 'react';

import { Copy, HelpCircle, Trash2 } from 'lucide-react';

import './styles.css';

const PushHistory = ({ history = [], onDelete }) => {
  const handleCopy = (message) => {
    navigator.clipboard.writeText(message || '');
  };

  return (
    <div className="push-history-wrapper">
      <h3 className="barcode-radio-title">
        История отправки <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>

      <div className="push-history-list">
        {history.map(({ id, dateTime, message, status }) => (
          <div key={id} className="push-history-item">
            <div className="push-history-top">
              <div className="push-history-dates">{dateTime}</div>

              <div className="push-history-controls">
                <span className="push-history-delivered">{status}</span>
                <Copy
                  size={16}
                  className="push-history-icon"
                  onClick={() => handleCopy(message)}
                  title="Скопировать сообщение"
                />
                <Trash2
                  size={16}
                  className="push-history-icon"
                  onClick={() => onDelete && onDelete(id)}
                  title="Удалить"
                />
              </div>
            </div>

            <div className="push-history-message">
              {message?.trim() ? message : <span className="empty-message">Нет текста</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PushHistory;
