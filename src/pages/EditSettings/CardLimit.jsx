import React from 'react';

import CustomInput from '../../customs/CustomInput';
import CustomTooltip from '../../customs/CustomTooltip';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import { StampSectionLabel, SubTitle } from './styles';

const CardLimit = ({
  value,
  onChange,
  title = 'Ограничить количество',
  subtitle,
  tooltip,
  placeholder = 'Введите количество',
  min = 0,
  step = 1,
}) => {
  return (
    <>
      <div>
        <StampSectionLabel>
          <BarcodeRadioTitle>{title}</BarcodeRadioTitle>
          {tooltip && <CustomTooltip id="card-limit-help" html content={tooltip} />}
        </StampSectionLabel>
        {subtitle && <SubTitle>{subtitle}</SubTitle>}
      </div>
      <CustomInput
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => {
          let raw = e.target.value;
          
          // Если пустая строка
          if (raw === '') {
            onChange('');
            return;
          }
          
          // Убираем лидирующие нули (кроме самого нуля)
          // "040" -> "40", "00123" -> "123", "0" -> "0"
          if (raw.length > 1 && raw.startsWith('0')) {
            raw = raw.replace(/^0+/, '') || '0';
            e.target.value = raw; // Обновляем значение в input
          }
          
          const n = parseInt(raw, 10);
          onChange(Number.isNaN(n) ? min : Math.max(min, n));
        }}
        onBlur={(e) => {
          if (e.target.value === '' || e.target.value == null) onChange(min);
        }}
        placeholder={placeholder}
      />
    </>
  );
};

export default CardLimit;
