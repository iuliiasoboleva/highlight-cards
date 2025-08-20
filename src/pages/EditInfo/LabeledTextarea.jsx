import React from 'react';

import CustomTextArea from '../../customs/CustomTextarea';
import CustomTooltip from '../../customs/CustomTooltip';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import { StampSectionLabel, Subtitle } from './styles';

import './styles.css';

const LabeledTextarea = ({
  label,
  value,
  onChange,
  subtitle,
  placeholder,
  required = false,
  dataKey,
  tooltip,
}) => (
  <div className="labeled-textarea">
    <StampSectionLabel>
      {label && <BarcodeRadioTitle>{label}</BarcodeRadioTitle>}
      {tooltip && <CustomTooltip id={`tooltip-${label}`} html content={tooltip} />}
    </StampSectionLabel>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}

    <div className="policy-textarea-wrapper">
      <CustomTextArea
        data-info-key={dataKey}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {required && <span className="required-asterisk">*</span>}
    </div>
  </div>
);

export default LabeledTextarea;
