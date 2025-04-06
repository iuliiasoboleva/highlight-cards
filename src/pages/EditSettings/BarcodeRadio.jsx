import React from 'react';
import './styles.css';

const BarcodeRadio = ({ options, title, selected, onChange }) => {
  return (
    <div className="barcode-radio-group">
      <h3 className="barcode-radio-title">{title}</h3>
      <div className="barcode-radio-options">
        {options.map(option => (
          <label key={option.value} className="barcode-radio-option">
            <input
              type="radio"
              className="barcode-radio-input"
              name="barcode-type"
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="barcode-radio-checkmark"></span>
            <span className="barcode-radio-label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BarcodeRadio;
