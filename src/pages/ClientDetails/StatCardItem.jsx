import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ru } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Copy, Edit, Info, Minus } from 'lucide-react';

import {
  ClientCardTag,
  ClientStatDropdownChange,
  ClientStatDropdownChangeValue,
  ClientStatDropdownIconCircle,
  DashboardAction,
  DashboardActionIcon,
  DashboardPopupMenu,
  DashboardPopupMenuItem,
  DashboardRatingStars,
  DashboardStatCard,
  DashboardStatCounter,
  DashboardStatCounterButton,
  DashboardStatLabel,
  DashboardStatRow,
  DashboardStatValue,
  DashboardTags,
  DatepickerWrapper,
  FormPopupButton,
  Star,
} from './styles';

const StatCardItem = ({
  label,
  value,
  change = null,
  onIncrement = null,
  onDecrement = null,
  showRightCircle = true,
  valueColor = null,
  actionMenu = null,
  copyable = false,
  isRating = false,
  isDatePicker = false,
  onDateChange = null,
  isTag = false,
  isFormPopup = false,
  onFormClick = null,
  tooltip = '',
  small = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const calendarRef = useRef(null);
  const today = new Date();

  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  const isArray = Array.isArray(value);
  const hasData =
    (value !== null &&
    value !== undefined &&
    (isArray ? value.length > 0 : value !== 0 && value !== '')) ||
    value === 'Без срока';

  const handleCopy = () => {
    if (!copyable || !value || isArray) return;
    navigator.clipboard.writeText(value.toString());
  };

  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutsideCalendar = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    if (isCalendarOpen) document.addEventListener('mousedown', handleClickOutsideCalendar);
    return () => document.removeEventListener('mousedown', handleClickOutsideCalendar);
  }, [isCalendarOpen]);

  return (
    <DashboardStatCard ref={wrapperRef}>
      <DashboardStatRow>
        <DashboardStatValue $small={small} style={valueColor ? { color: valueColor } : undefined}>
          {isFormPopup ? (
            <FormPopupButton onClick={onFormClick}>Посмотреть поля</FormPopupButton>
          ) : (
            <>
              {(onIncrement || onDecrement) && (
                <DashboardStatCounterButton>
                  {onIncrement && (
                    <DashboardStatCounter onClick={onIncrement}>＋</DashboardStatCounter>
                  )}
                  {onDecrement && (
                    <DashboardStatCounter onClick={onDecrement}>－</DashboardStatCounter>
                  )}
                </DashboardStatCounterButton>
              )}

              {isRating ? (
                <DashboardRatingStars>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} data-filled={i < value}>
                      ★
                    </Star>
                  ))}
                </DashboardRatingStars>
              ) : isTag ? (
                <DashboardTags>
                  {(isArray ? value : [value]).map((item, idx) => (
                    <ClientCardTag key={idx}>{item}</ClientCardTag>
                  ))}
                </DashboardTags>
              ) : !hasData ? (
                <span className="dashboard-no-data">Нет данных</span>
              ) : isArray ? (
                <DashboardTags>
                  {value.map((item, idx) => (
                    <ClientCardTag key={idx}>{item}</ClientCardTag>
                  ))}
                </DashboardTags>
              ) : (
                <span>
                  {label === 'LTV'
                    ? `${value}`
                    : isDatePicker
                      ? value && value !== 'Без срока' && !isNaN(new Date(value).getTime())
                        ? new Date(value).toLocaleDateString('ru-RU')
                        : value || 'Без срока'
                      : value}
                </span>
              )}
            </>
          )}
        </DashboardStatValue>

        <DashboardAction>
          {tooltip && (
            <DashboardActionIcon title={tooltip} as="div">
              <Info size={16} />
            </DashboardActionIcon>
          )}

          {copyable && hasData && !isArray && !isRating && !isDatePicker && value !== 'Без срока' && (
            <DashboardActionIcon onClick={handleCopy} title="Скопировать">
              <Copy size={16} />
            </DashboardActionIcon>
          )}

          {isDatePicker && value !== 'Без срока' ? (
            <>
              <DashboardActionIcon
                onClick={() => setCalendarOpen((prev) => !prev)}
                title="Выбрать дату"
              >
                <Edit size={16} />
              </DashboardActionIcon>

              {isCalendarOpen && (
                <DatepickerWrapper ref={calendarRef}>
                  <DatePicker
                    selected={value && value !== 'Без срока' && !isNaN(new Date(value).getTime()) ? new Date(value) : today}
                    onChange={(date) => {
                      onDateChange?.(date);
                      setCalendarOpen(false);
                    }}
                    inline
                    locale={ru}
                    minDate={today}
                  />
                </DatepickerWrapper>
              )}
            </>
          ) : isDatePicker ? null : (
            actionMenu && (
              <>
                <DashboardActionIcon onClick={() => setMenuOpen((p) => !p)}>
                  <Edit size={16} />
                </DashboardActionIcon>

                {menuOpen && (
                  <DashboardPopupMenu ref={menuRef}>
                    {actionMenu.map((item, i) => (
                      <DashboardPopupMenuItem
                        key={i}
                        onClick={() => {
                          item.onClick();
                          setMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </DashboardPopupMenuItem>
                    ))}
                  </DashboardPopupMenu>
                )}
              </>
            )
          )}
        </DashboardAction>

        {showRightCircle && !isArray && !isRating && !(isDatePicker && value === 'Без срока') && !isDatePicker && hasData && (
          <ClientStatDropdownIconCircle $type={changeType}>
            {isPositive ? (
              <ArrowUp size={14} />
            ) : isNegative ? (
              <ArrowDown size={14} />
            ) : (
              <Minus size={14} />
            )}
          </ClientStatDropdownIconCircle>
        )}
      </DashboardStatRow>

      <DashboardStatRow style={{ marginTop: 'auto' }}>
        <DashboardStatLabel>{label}</DashboardStatLabel>

        {showRightCircle && !isArray && hasData && !isRating && !(isDatePicker && value === 'Без срока') && !isDatePicker && (
          <ClientStatDropdownChange>
            <ClientStatDropdownChangeValue $type={changeType}>
              {isPositive ? `+${change}` : change}
            </ClientStatDropdownChangeValue>
          </ClientStatDropdownChange>
        )}
      </DashboardStatRow>
    </DashboardStatCard>
  );
};

export default StatCardItem;
