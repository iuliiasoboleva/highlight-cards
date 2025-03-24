import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.css';

const IconButton = ({ icon, onClick, className = '', title }) => {
  return (
    <button 
      className={`icon-button ${className}`} 
      onClick={onClick} 
      title={title}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

export default IconButton;
