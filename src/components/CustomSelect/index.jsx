import React, { useEffect, useRef, useState } from 'react';

import './styles.css';

const CustomSelect = ({ value, onChange, options, placeholder = '', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`tariff-period-select ${className}`} ref={selectRef}>
      <div
        className={`select-header-box ${isOpen ? 'select-header-opened' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="select-current-value">{displayValue}</span>
        <svg
          className={`select-arrow-icon ${isOpen ? 'select-arrow-up' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {isOpen && (
        <div className="select-options-list">
          {options.map((option, index) => (
            <div
              key={index}
              className={`select-option-item ${option.value === value ? 'select-option-selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
