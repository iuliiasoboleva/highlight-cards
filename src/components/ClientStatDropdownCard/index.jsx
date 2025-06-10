import React, { useState } from 'react';

import { ArrowDown, ArrowUp, ChevronDown, Minus } from 'lucide-react';

import './styles.css';

const OPTIONS = [
  { key: 'new', label: 'Новые клиенты' },
  { key: 'repeat', label: 'Повторные клиенты' },
  { key: 'referral', label: 'Рефералы' },
  { key: 'lastPeriod', label: 'Прошлый период' },
];

const selectOptions = [
  { key: 'new', label: 'Новые клиенты' },
  { key: 'repeat', label: 'Повторные клиенты' },
  { key: 'referral', label: 'Рефералы' },
];

const ClientStatDropdownCard = ({ statsByType = {}, initialKey = 'new', selectable = false }) => {
  const [selected, setSelected] = useState(initialKey);
  const [open, setOpen] = useState(false);

  const { value = 0, change = 0 } = statsByType[selected] || {};
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  const toggleDropdown = () => {
    if (selectable) setOpen(!open);
  };

  const handleSelect = (key) => {
    setSelected(key);
    setOpen(false);
  };

  const selectedLabel = OPTIONS.find((o) => o.key === selected)?.label || '';

  return (
    <div className="client-stat-dropdown-card">
      <div className="client-stat-dropdown-top">
        <div
          className={`client-stat-dropdown-label ${selectable ? 'clickable' : ''}`}
          onClick={toggleDropdown}
        >
          <span>{selectedLabel}</span>
          {selectable && <ChevronDown size={16} />}
        </div>

        <div className="client-stat-dropdown-change">
          <span className={`client-stat-dropdown-change-value ${changeType}`}>
            {change > 0 ? `+${change}` : change}
          </span>
        </div>
      </div>

      {selectable && open && (
        <div className="client-stat-dropdown-popover">
          <div className="client-stat-dropdown-options">
            {selectOptions.map((opt) => (
              <div
                key={opt.key}
                className={`client-stat-dropdown-option ${selected === opt.key ? 'active' : ''}`}
                onClick={() => handleSelect(opt.key)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="client-stat-dropdown-bottom">
        <div className="client-stat-dropdown-value">{value}</div>
        <div className={`client-stat-dropdown-icon-circle ${changeType}`}>
          {isPositive ? (
            <ArrowUp size={14} className={`client-stat-icon ${changeType}`} />
          ) : isNegative ? (
            <ArrowDown size={14} className={`client-stat-icon ${changeType}`} />
          ) : (
            <Minus size={14} className={`client-stat-icon ${changeType}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientStatDropdownCard;
