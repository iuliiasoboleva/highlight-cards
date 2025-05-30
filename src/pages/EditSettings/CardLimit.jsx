import React from 'react';

import './styles.css';

const CardLimit = ({
  value,
  onChange,
  title = 'Ограничить количество',
  subtitle,
  placeholder = 'Введите количество',
}) => {
  return (
    <>
      <div className="card-limit-header">
        <h3 className="barcode-radio-title">{title}</h3>
        {subtitle && <span className="card-limit-subtitle">{subtitle}</span>}
      </div>
      <input
        type="number"
        className="custom-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </>
  );
};

export default CardLimit;
