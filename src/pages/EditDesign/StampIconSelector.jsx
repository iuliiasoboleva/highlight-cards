import React, { useEffect } from 'react';

import CustomSelect from '../../customs/CustomSelect';
import CustomTooltip from '../../customs/CustomTooltip';

const StampIconSelector = ({ label, value, options, onChange, tooltip }) => {
  const formattedOptions = options.map((opt) => ({
    value: opt.value, // строка, например: 'Star'
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {opt.component && <opt.component size={16} />}
        {opt.name}
      </div>
    ),
  }));

  const normalizedValue = typeof value === 'string' ? value : '';
  const selectedOption =
    formattedOptions.find((opt) => opt.value === normalizedValue) || formattedOptions[0];

  useEffect(() => {
    if (!normalizedValue && formattedOptions.length > 0) {
      onChange(formattedOptions[0].value);
    }
  }, [normalizedValue, onChange, formattedOptions]);

  return (
    <div className="stamp-icon-selector">
      <h3 className="barcode-radio-title">{label}</h3>
      <CustomTooltip id="stamp-design-help" html content={tooltip} />
      <CustomSelect
        value={selectedOption.value}
        onChange={onChange}
        options={formattedOptions}
        className="stamp-icon-select"
      />
    </div>
  );
};

export default StampIconSelector;
