import React, { useEffect, useState } from 'react';

import './styles.css';

const isValidHex = (value) => /^#([0-9a-f]{6})$/i.test(value);

const formatHex = (value) => {
  if (!value.startsWith('#')) return `#${value}`;
  return value;
};

const ColorSettings = ({ colors, handleColorChange, isStampCard }) => {
  const [validColors, setValidColors] = useState({});
  const [localInputs, setLocalInputs] = useState({});

  useEffect(() => {
    setValidColors({ ...colors });
    setLocalInputs({ ...colors });
  }, [colors]);

  const handleInputChange = (key, rawValue) => {
    const value = formatHex(rawValue);
    const isValid = isValidHex(value);

    setLocalInputs((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (isValid) {
      setValidColors((prev) => ({
        ...prev,
        [key]: value,
      }));
      handleColorChange(key, value);
    } else {
      handleColorChange(key, value);
    }
  };

  const handleColorPickerChange = (key, value) => {
    setLocalInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
    setValidColors((prev) => ({
      ...prev,
      [key]: value,
    }));
    handleColorChange(key, value);
  };

  const fullColorFields = [
    { key: 'cardBackground', label: 'Фон карты' },
    { key: 'stampBackgroundColor', label: 'Цвет фона центральной части' },
    { key: 'activeStampColor', label: 'Активный штамп' },
    { key: 'activeStampBgColor', label: 'Фон активного штампа' },
    { key: 'textColor', label: 'Цвет текста' },
    { key: 'borderColor', label: 'Цвет обводки' },
    { key: 'inactiveStampColor', label: 'Неактивный штамп' },
  ];

  const limitedColorFields = [
    { key: 'cardBackground', label: 'Фон карты' },
    { key: 'stampBackgroundColor', label: 'Цвет фона центральной части' },
    { key: 'textColor', label: 'Цвет текста' },
  ];

  const colorFields = isStampCard ? fullColorFields : limitedColorFields;

  return (
    <div className="color-settings-grid">
      {colorFields.map(({ key, label }) => {
        const rawValue = localInputs[key] || '';
        const displayValue = rawValue === 'none' ? '' : rawValue;
        const isValid = isValidHex(displayValue);

        return (
          <div className="color-settings-item" key={key}>
            <span>{label}</span>
            <div className="color-input-group">
              <input
                type="color"
                value={validColors[key] || '#000000'}
                onChange={(e) => handleColorPickerChange(key, e.target.value)}
              />
              <input
                type="text"
                value={displayValue}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder="Не задано"
                style={{
                  borderColor: isValid ? '#ccc' : 'red',
                  outline: 'none',
                }}
              />
              {/* {!isValid && value.length > 0 && (
                <div style={{ color: 'red', fontSize: '12px' }}>
                  Неверный HEX, должно быть 6 символов (#RRGGBB)
                </div>
              )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColorSettings;
