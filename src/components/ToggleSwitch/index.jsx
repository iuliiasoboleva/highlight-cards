import React from 'react';

import './styles.css';

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
};

export default ToggleSwitch;
