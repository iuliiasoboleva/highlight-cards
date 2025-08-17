import React from 'react';

import { HiddenCheckbox, Slider, SwitchLabel } from './styles';

const CustomToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <SwitchLabel disabled={disabled}>
      <HiddenCheckbox checked={checked} onChange={onChange} disabled={disabled} />
      <Slider checked={checked} disabled={disabled} />
    </SwitchLabel>
  );
};

export default CustomToggleSwitch;
