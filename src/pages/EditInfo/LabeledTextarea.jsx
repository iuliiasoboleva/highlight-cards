import React from 'react';

import { HelpCircle } from 'lucide-react';

import './styles.css';

const LabeledTextarea = ({ label, value, onChange, subtitle, placeholder, required = false, dataKey }) => (
  <div className="labeled-textarea">
    <h3 className="barcode-radio-title">
      {label} <HelpCircle size={16} style={{ marginLeft: 6 }} />
    </h3>
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
