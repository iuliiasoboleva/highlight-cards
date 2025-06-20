import React, { useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

import CustomSelect from '../../components/CustomSelect';

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
      <h3 className="barcode-radio-title">
        {label}
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="stamp-design-help"
          data-tooltip-html={tooltip}
        />
      </h3>
      <Tooltip id="stamp-design-help" className="custom-tooltip" />

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
