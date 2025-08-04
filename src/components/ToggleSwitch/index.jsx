import React from 'react';

import { HiddenCheckbox, Slider, SwitchLabel } from './styles';

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <SwitchLabel>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <Slider checked={checked} />
    </SwitchLabel>
  );
};

export default ToggleSwitch;
