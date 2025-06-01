import React, { useEffect } from 'react';

import { HelpCircle } from 'lucide-react';

import CustomSelect from '../../components/CustomSelect';

const StampIconSelector = ({ label, value, options, onChange }) => {
  const formattedOptions = options.map((opt) => ({
    value: opt.value,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <opt.component size={16} />
        {opt.name}
      </div>
    ),
  }));

  const selectedOption = formattedOptions.find((opt) => opt.value === value) || formattedOptions[0];

  useEffect(() => {
    if (!value && formattedOptions.length > 0) {
      onChange(formattedOptions[0].value);
    }
  }, [value, onChange, formattedOptions]);

  return (
    <div className="stamp-icon-selector">
      <h3 className="barcode-radio-title">
        {label} <HelpCircle size={16} style={{ marginLeft: 6 }} />
      </h3>

      <CustomSelect
        value={selectedOption.value}
        onChange={(selectedValue) => onChange(selectedValue)}
        options={formattedOptions}
        className="stamp-icon-select"
      />
    </div>
  );
};

export default StampIconSelector;
