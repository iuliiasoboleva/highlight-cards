import React, { useEffect, useState } from 'react';

import dicesIcon from '../../assets/icons/dices.svg';
import PalettePicker from '../../components/PalettePicker';
import CustomInput from '../../customs/CustomInput';
import { CardFieldsRow, ColorOptionLabel, InputGroup, Label } from './styles';

const HEX6 = /^#?([0-9a-f]{6})$/i;
const HEX3 = /^#?([0-9a-f]{3})$/i;
const RGBA = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i;

const toHex6 = (str) => {
  if (!str) return null;
  const s = String(str).trim();
  let m = HEX6.exec(s);
  if (m) return `#${m[1].toLowerCase()}`;
  m = HEX3.exec(s);
  if (m) {
    const [r, g, b] = m[1].toLowerCase().split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return null;
};
const isRgba = (str) => RGBA.test(String(str).trim());
const normalizeColor = (str) => {
  if (!str) return '';
  const s = String(str).trim();
  if (isRgba(s)) return s;
  const h = toHex6(s);
  return h || '';
};

const ColorSettings = ({ colors = {}, handleColorChange, isStampCard, onHoverKeyChange }) => {
  const [validColors, setValidColors] = useState({});
  const [localInputs, setLocalInputs] = useState({});

  useEffect(() => {
    setValidColors({ ...colors });
    setLocalInputs({ ...colors });
  }, [colors]);

  const softTryParse = (value) => {
    if (!value) return '';
    const s = String(value).trim();
    if (isRgba(s)) return s;
    const h = toHex6(s);
    return h || '';
  };

  const handleInputChange = (key, rawValue) => {
    setLocalInputs((prev) => ({ ...prev, [key]: rawValue }));

    const parsed = softTryParse(rawValue);
    if (parsed !== '') {
      setValidColors((prev) => ({ ...prev, [key]: parsed }));
      handleColorChange(key, parsed);
    }
  };

  const handleInputBlur = (key) => {
    const raw = localInputs[key] ?? '';
    const normalized = normalizeColor(raw);
    setLocalInputs((prev) => ({ ...prev, [key]: normalized }));
    if (normalized !== '') {
      setValidColors((prev) => ({ ...prev, [key]: normalized }));
      handleColorChange(key, normalized);
    } else {
      setValidColors((prev) => ({ ...prev, [key]: '' }));
      handleColorChange(key, '');
    }
  };

  const handleColorPickerChange = (key, value) => {
    setLocalInputs((prev) => ({ ...prev, [key]: value }));
    setValidColors((prev) => ({ ...prev, [key]: value }));
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
    { key: 'inactiveStampBgColor', label: 'Фон неактивного штампа' },
  ];

  const limitedColorFields = [
    { key: 'cardBackground', label: 'Фон карты' },
    { key: 'stampBackgroundColor', label: 'Цвет фона центральной части' },
    { key: 'textColor', label: 'Цвет текста' },
  ];

  const colorFields = isStampCard ? fullColorFields : limitedColorFields;

  return (
    <CardFieldsRow>
      {colorFields.map(({ key, label }) => {
        const raw = localInputs[key] ?? '';
        const displayValue = raw === 'none' ? '' : raw;
        const currentColor = validColors[key] || '';
        const invalid = Boolean(displayValue) && normalizeColor(displayValue) === '';

        const pickerValue = currentColor || '#000000';

        return (
          <ColorOptionLabel
            key={key}
            data-design-key={key}
            onMouseEnter={() => onHoverKeyChange?.(key)}
            onMouseLeave={() => onHoverKeyChange?.(null)}
          >
            <Label>{label}</Label>

            <InputGroup>
              <PalettePicker
                value={pickerValue}
                emitAlpha
                onChange={(val) => handleColorPickerChange(key, val)}
              />

              <CustomInput
                value={displayValue}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onBlur={() => handleInputBlur(key)}
                placeholder="Не задано"
                $invalid={invalid}
                data-invalid={invalid}
                iconSrc={dicesIcon}
                iconTitle="Случайный цвет"
                onIconClick={() => {
                  const rnd =
                    '#' +
                    Math.floor(Math.random() * 0xffffff)
                      .toString(16)
                      .padStart(6, '0');
                  setLocalInputs((p) => ({ ...p, [key]: rnd }));
                  setValidColors((p) => ({ ...p, [key]: rnd }));
                  handleColorChange(key, rnd);
                }}
              />
            </InputGroup>
          </ColorOptionLabel>
        );
      })}
    </CardFieldsRow>
  );
};

export default ColorSettings;
