import React, { useState } from 'react';

import { ArrowDown, ArrowUp, ChevronDown, Minus } from 'lucide-react';

import {
  BottomRow,
  Card,
  ChangeValue,
  ChangeWrap,
  IconCircle,
  Label,
  Option,
  Options,
  Popover,
  TopRow,
  Value,
} from './styles';

const OPTIONS = [
  { key: 'new', label: 'Новые клиенты' },
  { key: 'repeat', label: 'Повторные клиенты' },
  { key: 'referral', label: 'Рефералы' },
  { key: 'lastPeriod', label: 'Прошлый период' },
  { key: 'visits', label: 'Всего визитов' },
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
    <Card>
      <TopRow>
        <Label $clickable={selectable} onClick={toggleDropdown}>
          <span>{selectedLabel}</span>
          {selectable && <ChevronDown size={16} />}
        </Label>

        <ChangeWrap>
          <ChangeValue $type={changeType}>{isPositive ? `+${change}` : change}</ChangeValue>
        </ChangeWrap>
      </TopRow>

      {selectable && open && (
        <Popover>
          <Options>
            {selectOptions.map((opt) => (
              <Option
                key={opt.key}
                className={selected === opt.key ? 'active' : ''}
                onClick={() => handleSelect(opt.key)}
              >
                {opt.label}
              </Option>
            ))}
          </Options>
        </Popover>
      )}

      <BottomRow>
        <Value>{value}</Value>
        <IconCircle $type={changeType}>
          {isPositive ? (
            <ArrowUp size={14} />
          ) : isNegative ? (
            <ArrowDown size={14} />
          ) : (
            <Minus size={14} />
          )}
        </IconCircle>
      </BottomRow>
    </Card>
  );
};

export default ClientStatDropdownCard;
