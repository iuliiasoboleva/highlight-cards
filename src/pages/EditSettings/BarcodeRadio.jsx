import React from 'react';

import './styles.css';

const BarcodeRadio = ({
  options,
  title,
  selected,
  onChange,
  name,
  additionalContentKey = null,
  additionalContent = null,
}) => {
  return (
    <div className="barcode-radio-group">
      <h3 className="barcode-radio-title">{title}</h3>
      <div className="barcode-radio-options">
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <label className="barcode-radio-option">
              <input
                type="radio"
                className="barcode-radio-input"
                name={name}
                value={option.value}
                checked={selected === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="barcode-radio-checkmark"></span>
              <span className="barcode-radio-label">{option.label}</span>
            </label>
            {additionalContentKey === option.value &&
              selected === option.value &&
              additionalContent && (
                <div className="barcode-radio-additional">{additionalContent}</div>
              )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BarcodeRadio;
