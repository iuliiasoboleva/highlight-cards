import React, { useEffect, useMemo } from 'react';

import CustomSelect from '../../customs/CustomSelect';
import CustomTooltip from '../../customs/CustomTooltip';
import { BarcodeRadioTitle, OptionLabel, TitleRow, Wrapper } from './styles';

const StampIconSelector = ({ label, value, options = [], onChange, tooltip, tooltipId }) => {
  const formattedOptions = useMemo(
    () =>
      options.map((opt) => ({
        value: opt.value,
        label: (
          <OptionLabel>
            {opt.component ? <opt.component size={16} /> : null}
            {opt.name}
          </OptionLabel>
        ),
      })),
    [options],
  );

  const normalizedValue = typeof value === 'string' ? value : '';
  const selectedOption =
    formattedOptions.find((opt) => opt.value === normalizedValue) || formattedOptions[0];

  useEffect(() => {
    if (!normalizedValue && formattedOptions.length > 0 && onChange) {
      onChange(formattedOptions[0].value);
    }
  }, [normalizedValue, formattedOptions, onChange]);

  return (
    <Wrapper>
      <TitleRow>
        <BarcodeRadioTitle>{label}</BarcodeRadioTitle>
        {tooltip ? (
          <CustomTooltip id={tooltipId || 'stamp-design-help'} html content={tooltip} />
        ) : null}
      </TitleRow>

      <CustomSelect
        value={selectedOption ? selectedOption.value : ''}
        onChange={onChange}
        options={formattedOptions}
      />
    </Wrapper>
  );
};

export default StampIconSelector;
