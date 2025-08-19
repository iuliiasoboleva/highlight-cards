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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </>
  );
};

export default CardLimit;
