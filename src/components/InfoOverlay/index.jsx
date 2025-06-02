import React from 'react';

import { X } from 'lucide-react';

import './styles.css';

const InfoOverlay = ({ infoFields, onClose }) => {
  if (!infoFields) return null;

  return (
    <div className="info-overlay">
      <div className="info-overlay-header">
        <h3>Информация</h3>
        <button className="info-overlay-close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="info-overlay-content">
        {Object.entries(infoFields).map(([key, value]) => (
          <div key={key} className="info-overlay-item">
            <strong>{key}:</strong> <span>{String(value) || 'Нет данных'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoOverlay;
