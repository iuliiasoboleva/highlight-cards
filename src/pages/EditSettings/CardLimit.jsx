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
          const raw = e.target.value;
          if (raw === '') {
            onChange('');
            return;
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
