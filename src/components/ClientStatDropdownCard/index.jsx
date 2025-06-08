import React, { useState } from 'react';
import './styles.css';
import { ArrowUp, ArrowDown, Minus, ChevronDown } from 'lucide-react';

const OPTIONS = [
  { key: 'new', label: 'Новые клиенты' },
  { key: 'repeat', label: 'Повторные клиенты' },
  { key: 'referral', label: 'Рефералы' },
  { key: 'visits', label: 'Всего визитов' },
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
          <div className={`client-stat-dropdown-icon-circle ${changeType}`}>
            {isPositive ? (
              <ArrowUp size={14} />
            ) : isNegative ? (
              <ArrowDown size={14} />
            ) : (
              <Minus size={14} />
            )}
          </div>
        </div>
      </div>

      {selectable && open && (
        <div className="client-stat-dropdown-options">
          {OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className={`client-stat-dropdown-option ${selected === opt.key ? 'active' : ''}`}
              onClick={() => handleSelect(opt.key)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      <div className="client-stat-dropdown-value">{value}</div>
    </div>
  );
};

export default ClientStatDropdownCard;
