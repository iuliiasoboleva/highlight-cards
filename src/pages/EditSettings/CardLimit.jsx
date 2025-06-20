import React from 'react';
import { Tooltip } from 'react-tooltip';

import { HelpCircle } from 'lucide-react';

import './styles.css';

const CardLimit = ({
  value,
  onChange,
  title = 'Ограничить количество',
  subtitle,
  tooltip,
  placeholder = 'Введите количество',
}) => {
  return (
    <>
      <div className="card-limit-header">
        <h3 className="barcode-radio-title">
          {title}
          {tooltip && (
            <HelpCircle
              size={16}
              style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
              data-tooltip-id="card-limit-help"
              data-tooltip-html={tooltip}
            />
          )}
        </h3>
        {tooltip && <Tooltip id="card-limit-help" className="custom-tooltip" />}
        {subtitle && <span className="card-limit-subtitle">{subtitle}</span>}
      </div>
      <input
        type="number"
        className="custom-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </>
  );
};

export default CardLimit;
