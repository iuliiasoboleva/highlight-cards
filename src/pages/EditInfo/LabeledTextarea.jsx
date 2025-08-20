import React from 'react';

import CustomTextArea from '../../customs/CustomTextarea';
import CustomTooltip from '../../customs/CustomTooltip';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import {
  LabeledTextareaWrapper,
  PolicyTextareaWrapper,
  RequiredAsterisk,
  StampSectionLabel,
  Subtitle,
} from './styles';

const LabeledTextarea = ({
  label,
  value,
  onChange,
  subtitle,
  placeholder,
  required = false,
  dataKey,
  tooltip,
  showCounter,
  maxLength,
  warnAt,
}) => (
  <LabeledTextareaWrapper>
    <StampSectionLabel>
      {label && <BarcodeRadioTitle>{label}</BarcodeRadioTitle>}
      {tooltip && <CustomTooltip id={`tooltip-${label}`} html content={tooltip} />}
    </StampSectionLabel>

    {subtitle && <Subtitle>{subtitle}</Subtitle>}

    <PolicyTextareaWrapper>
      <CustomTextArea
        data-info-key={dataKey}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        showCounter={showCounter}
        maxLength={maxLength}
        warnAt={warnAt}
      />
      {required && <RequiredAsterisk>*</RequiredAsterisk>}
    </PolicyTextareaWrapper>
  </LabeledTextareaWrapper>
);

export default LabeledTextarea;
