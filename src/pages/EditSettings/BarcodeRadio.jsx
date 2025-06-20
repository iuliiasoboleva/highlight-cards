import React from 'react';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

import './styles.css';

const BarcodeRadio = ({
  options,
  title,
  selected,
  onChange,
  name,
  subtitle,
  tooltip,
  additionalContentByValue = {},
  dataKey,
}) => {
  const tooltipId = `tooltip-${name}`;

  return (
    <div className="barcode-radio-group" data-info-key={dataKey}>
      <h3 className="barcode-radio-title">
        {title}
        {tooltip && (
          <HelpCircle
            size={16}
            style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
            data-tooltip-id={tooltipId}
            data-tooltip-html={tooltip.replace(/\n/g, '<br/>')}
          />
        )}
      </h3>
      {tooltip && <Tooltip id={tooltipId} className="custom-tooltip" />}
      {subtitle && <p className="labeled-textarea-subtitle">{subtitle}</p>}
      <div className="barcode-radio-options">
        {options?.map((option) => (
          <React.Fragment key={option.value}>
            <label className="barcode-radio-option">
              <input
                type="radio"
                className="barcode-radio-input"
                name={name}
                value={option.value}
                checked={selected === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="barcode-radio-checkmark"></span>
              <span className="barcode-radio-label">
                <span className="barcode-radio-label">
                  <span className="barcode-radio-label">{option.label}</span>
                  {option.labelSub && (
                    <span className="barcode-radio-label-sub">{option.labelSub}</span>
                  )}
                </span>
              </span>
            </label>
          </React.Fragment>
        ))}
      </div>
      {additionalContentByValue?.[selected] && (
        <div className="barcode-radio-additional">{additionalContentByValue[selected]}</div>
      )}
    </div>
  );
};

export default BarcodeRadio;
