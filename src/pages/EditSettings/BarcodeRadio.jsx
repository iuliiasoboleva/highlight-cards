import React from 'react';

import { CustomRadioGroup } from '../../customs/CustomRadio';
import CustomTooltip from '../../customs/CustomTooltip';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import { AdditionalBox, GroupWrap, StampSectionLabel, Subtitle } from './styles';

const BarcodeRadio = ({
  options,
  title,
  selected,
  onChange,
  name,
  subtitle,
  tooltip,
  additionalContentByValue = {},
  dataKey,
}) => {
  const tooltipId = `tooltip-${name}`;

  return (
    <GroupWrap data-info-key={dataKey}>
      <StampSectionLabel>
        {title && <BarcodeRadioTitle>{title}</BarcodeRadioTitle>}
        {tooltip && <CustomTooltip id={tooltipId} html content={tooltip.replace(/\n/g, '<br/>')} />}
      </StampSectionLabel>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}

      <CustomRadioGroup
        name={name}
        options={options || []}
        selected={selected}
        onChange={onChange}
      />

      {additionalContentByValue?.[selected] && (
        <AdditionalBox>{additionalContentByValue[selected]}</AdditionalBox>
      )}
    </GroupWrap>
  );
};

export default BarcodeRadio;
