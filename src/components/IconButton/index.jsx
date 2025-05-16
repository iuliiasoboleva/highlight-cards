import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

const IconButton = ({ icon, onClick, title, className = '' }) => {
  return (
    <button className={`icon-button ${className}`} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
      <span className="icon-label">{title}</span>
    </button>
  );
};

export default IconButton;
