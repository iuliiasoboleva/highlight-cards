import React from 'react';

import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './styles.css';

const ClientPortraitCard = ({ title, value }) => (
  <div className="portrait-card">
    <div className="portrait-title">{title}</div>
    {value ? (
      <div className="value">{value}</div>
    ) : (
      <div className="empty-state">
        <FontAwesomeIcon icon={faSun} className="empty-icon" />
        Недостаточно данных
      </div>
    )}
  </div>
);

export default ClientPortraitCard;
