import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ru } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Copy, Edit, Info, Minus } from 'lucide-react';

import '../../components/Chart/datepickerOverrides.css';
import './styles.css';

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
  const editIconRef = useRef(null);
  const calendarRef = useRef(null);
  const today = new Date();

  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  const isArray = Array.isArray(value);
  const hasData =
    value !== null &&
    value !== undefined &&
    (isArray ? value.length > 0 : value !== 0 && value !== '');

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

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutsideMenu);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutsideCalendar = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutsideCalendar);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideCalendar);
    };
  }, [isCalendarOpen]);

  return (
    <div className="dashboard-stat-card" ref={wrapperRef}>
      <div className="dashboard-stat-row">
        <div className="dashboard-stat-value" style={small ? {fontSize:'30px',fontWeight:500,lineHeight:1.2} : {}}>
          {isFormPopup ? (
            <button className="form-popup-button" onClick={onFormClick}>
              Посмотреть поля
            </button>
          ) : (
            <>
              {(onIncrement || onDecrement) && (
                <span className="dashboard-stat-counter-button">
                  {onIncrement && (
                    <div className="dashboard-stat-counter" onClick={onIncrement}>
                      ＋
                    </div>
                  )}
                  {onDecrement && (
                    <div className="dashboard-stat-counter" onClick={onDecrement}>
                      －
                    </div>
                  )}
                </span>
              )}

              {isRating ? (
                <div className="dashboard-rating-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`star ${i < value ? 'filled' : ''}`}>
                      ★
                    </span>
                  ))}
                </div>
              ) : isTag ? (
                <div className="dashboard-tags">
                  {(isArray ? value : [value]).map((item, idx) => (
                    <span key={idx} className="client-card-tag">
                      {item}
                    </span>
                  ))}
                </div>
              ) : !hasData ? (
                <span className="dashboard-no-data">Нет данных</span>
              ) : isArray ? (
                <div className="dashboard-tags">
                  {value.map((item, idx) => (
                    <span key={idx} className="client-card-tag">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={valueColor ? { color: valueColor } : {}}>
                  {label === 'LTV'
                    ? `${value}₽`
                    : isDatePicker
                      ? new Date(value).toLocaleDateString('ru-RU')
                      : value}
                </span>
              )}
            </>
          )}
        </div>
        <div className="dashboard-action">
          {tooltip && (
            <div className="dashboard-action-icon" title={tooltip}>
              <Info size={16} />
            </div>
          )}
          {copyable && hasData && !isArray && !isRating && !isDatePicker && (
            <button className="dashboard-action-icon" onClick={handleCopy} title="Скопировать">
              <Copy size={16} />
            </button>
          )}
          {isDatePicker ? (
            <>
              <button
                className="dashboard-action-icon"
                onClick={() => setCalendarOpen((prev) => !prev)}
                title="Выбрать дату"
                ref={editIconRef}
              >
                <Edit size={16} />
              </button>

              {isCalendarOpen && (
                <div
                  className="datepicker-wrapper"
                  ref={calendarRef}
                  style={{
                    position: 'absolute',
                    top: `35px`,
                    left: `-235px`,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10000,
                  }}
                >
                  <DatePicker
                    selected={value ? new Date(value) : today}
                    onChange={(date) => {
                      onDateChange?.(date);
                      setCalendarOpen(false);
                    }}
                    inline
                    locale={ru}
                    minDate={today}
                  />
                </div>
              )}
            </>
          ) : (
            actionMenu && (
              <>
                <button className="dashboard-action-icon" onClick={() => setMenuOpen((p) => !p)}>
                  <Edit size={16} />
                </button>
                {menuOpen && (
                  <div className="dashboard-popup-menu" ref={menuRef}>
                    {actionMenu.map((item, i) => (
                      <div
                        key={i}
                        className="dashboard-popup-menu-item"
                        onClick={() => {
                          item.onClick();
                          setMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          )}
        </div>

        {showRightCircle && !isArray && !isRating && !isDatePicker && hasData && (
          <div className={`client-stat-dropdown-icon-circle ${changeType}`}>
            {isPositive ? (
              <ArrowUp size={14} className={`client-stat-icon ${changeType}`} />
            ) : isNegative ? (
              <ArrowDown size={14} className={`client-stat-icon ${changeType}`} />
            ) : (
              <Minus size={14} className={`client-stat-icon ${changeType}`} />
            )}
          </div>
        )}
      </div>

      <div className="dashboard-stat-row">
        <div className="dashboard-stat-label">
          {showRightCircle && !isArray && hasData && !isRating && !isDatePicker && (
            <span className={`dashboard-stat-dot ${changeType}`}></span>
          )}
          {label}
        </div>
        {showRightCircle && !isArray && hasData && !isRating && !isDatePicker && (
          <div className="client-stat-dropdown-change">
            <span className={`client-stat-dropdown-change-value ${changeType}`}>
              {isPositive ? `+${change}` : change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCardItem;
