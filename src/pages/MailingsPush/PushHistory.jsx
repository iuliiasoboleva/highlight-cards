import React, { useState } from 'react';

import { Copy, HelpCircle, Trash2 } from 'lucide-react';

import { mockPushHistory as initialHistory } from '../../mocks/mockPushHistory';

import './styles.css';

const PushHistory = () => {
  const [history, setHistory] = useState(initialHistory);

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message || '').then(() => {
      console.log('Сообщение скопировано');
    });
  };

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="push-history-wrapper">
      <h3 className="barcode-radio-title">
        История отправки <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>

      <div className="push-history-list">
        {history.map(({ id, date, message, delivered }) => (
          <div key={id} className="push-history-item">
            <div className="push-history-top">
              <div className="push-history-dates">{date}</div>

              <div className="push-history-controls">
                <span className="push-history-delivered">Доставлено:{delivered}</span>
                <Copy
                  size={16}
                  className="push-history-icon"
                  onClick={() => handleCopy(message)}
                  title="Скопировать сообщение"
                />
                <Trash2
                  size={16}
                  className="push-history-icon"
                  onClick={() => handleDelete(id)}
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
