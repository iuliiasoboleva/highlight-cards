import React from 'react';

import { Checkmark, HiddenInput, Label, LabelSub, RadioGroup, RadioOption } from './styles';

const CustomRadio = ({ name, value, checked, onChange, label, labelSub }) => (
  <RadioOption>
    <HiddenInput
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
    />
    <Checkmark />
    <Label>
      {label}
      {labelSub && <LabelSub>{labelSub}</LabelSub>}
    </Label>
  </RadioOption>
);

export const CustomRadioGroup = ({ name, options, selected, onChange, inline }) => (
  <RadioGroup $inline={inline}>
    {options.map((option) => (
      <CustomRadio
        key={option.value}
        name={name}
        value={option.value}
        checked={selected === option.value}
        onChange={onChange}
        label={option.label}
        labelSub={option.labelSub}
      />
    ))}
  </RadioGroup>
);

export default CustomRadio;
