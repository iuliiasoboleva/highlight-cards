import React from 'react';

import CustomTooltip from '../../customs/CustomTooltip';

import './styles.css';

const LabeledTextarea = ({
  label,
  value,
  onChange,
  subtitle,
  placeholder,
  required = false,
  dataKey,
  tooltip,
}) => (
  <div className="labeled-textarea">
    <h3 className="barcode-radio-title">{label}</h3>
    {tooltip && <CustomTooltip id={`tooltip-${label}`} html content={tooltip} />}
    {subtitle && <p className="labeled-textarea-subtitle">{subtitle}</p>}
    <div className="policy-textarea-wrapper">
      <textarea
        className="custom-textarea"
        data-info-key={dataKey}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {required && <span className="required-asterisk">*</span>}
    </div>
  </div>
);

export default LabeledTextarea;
