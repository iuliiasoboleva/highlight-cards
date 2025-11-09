import React, { useEffect, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  CalendarDropdown,
  CalendarHeader,
  DateInput,
  DatePickerWrapper,
  DayCell,
  DaysGrid,
  MonthYearSelect,
  NavButton,
  WeekDay,
  WeekDaysRow,
} from './styles';

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const formatDateToDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

const formatDateToValue = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const CustomDatePicker = ({ value, onChange, placeholder = 'Выберите дату', error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDateToDisplay(value));
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [year, month] = value.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    }
    return new Date();
  });

  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(formatDateToDisplay(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDateClick = (date) => {
    const formatted = formatDateToValue(date);
    onChange?.(formatted);
    setInputValue(formatDateToDisplay(formatted));
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    
    let formatted = digits;
    if (digits.length > 8) {
      formatted = digits.slice(0, 8);
    }
    
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '.' + formatted.slice(2);
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
    }
    
    setInputValue(formatted);
    
    if (digits.length === 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      const d = parseInt(day);
      const m = parseInt(month);
      const y = parseInt(year);
      
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
        const formattedDate = `${year}-${month}-${day}`;
        onChange?.(formattedDate);
      }
    } else if (digits.length === 0) {
      onChange?.('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const changeMonth = (delta) => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setViewDate((prev) => new Date(prev.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setViewDate((prev) => new Date(newYear, prev.getMonth(), 1));
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevYear, prevMonth, day);
      days.push({ date, otherMonth: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, otherMonth: false });
    }

    const totalCells = firstDay + daysInMonth;
    const weeksNeeded = Math.ceil(totalCells / 7);
    const remainingDays = weeksNeeded * 7 - days.length;

    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const date = new Date(nextYear, nextMonth, day);
      days.push({ date, otherMonth: true });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let selectedDate = null;
    if (value) {
      const [y, m, d] = value.split('-');
      selectedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      selectedDate.setHours(0, 0, 0, 0);
    }

    return days.map((dayInfo, index) => {
      const dayDate = new Date(dayInfo.date);
      dayDate.setHours(0, 0, 0, 0);

      const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
      const isToday = dayDate.getTime() === today.getTime();

      return (
        <DayCell
          key={index}
          onClick={() => handleDateClick(dayInfo.date)}
          $selected={isSelected}
          $today={isToday}
          $otherMonth={dayInfo.otherMonth}
        >
          {dayInfo.date.getDate()}
        </DayCell>
      );
    });
  };

  const currentYear = viewDate.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  return (
    <DatePickerWrapper ref={wrapperRef}>
      <DateInput
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onClick={() => setIsOpen(!isOpen)}
        placeholder={placeholder}
        $hasValue={!!value}
        $error={error}
      />

      {isOpen && (
        <CalendarDropdown>
          <CalendarHeader>
            <NavButton onClick={() => changeMonth(-1)}>
              <ChevronLeft size={20} />
            </NavButton>

            <MonthYearSelect value={viewDate.getMonth()} onChange={handleMonthChange}>
              {MONTHS.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </MonthYearSelect>

            <MonthYearSelect value={viewDate.getFullYear()} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </MonthYearSelect>

            <NavButton onClick={() => changeMonth(1)}>
              <ChevronRight size={20} />
            </NavButton>
          </CalendarHeader>

          <WeekDaysRow>
            {WEEKDAYS.map((day) => (
              <WeekDay key={day}>{day}</WeekDay>
            ))}
          </WeekDaysRow>

          <DaysGrid>{renderCalendar()}</DaysGrid>
        </CalendarDropdown>
      )}
    </DatePickerWrapper>
  );
};

export default CustomDatePicker;
