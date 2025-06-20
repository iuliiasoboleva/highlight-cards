import React from 'react';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

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
    <h3 className="barcode-radio-title">
      {label}
      {tooltip && (
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id={`tooltip-${label}`}
          data-tooltip-html={tooltip}
        />
      )}
    </h3>
    {tooltip && <Tooltip id={`tooltip-${label}`} className="custom-tooltip" />}
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
