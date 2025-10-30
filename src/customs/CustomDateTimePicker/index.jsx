import React, { useEffect, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  CalendarDropdown,
  CalendarHeader,
  CalendarSection,
  DateTimeInput,
  DateTimePickerWrapper,
  DayCell,
  DaysGrid,
  MonthYearSelect,
  NavButton,
  TimeInput,
  TimeInputGroup,
  TimeInputs,
  TimeLabel,
  TimeSection,
  TimeUnit,
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

const formatDateTimeToDisplay = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const formatDateTimeToValue = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const CustomDateTimePicker = ({
  value,
  onChange,
  placeholder = 'Выберите дату и время',
  min,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  const [hours, setHours] = useState(() => {
    if (value) {
      return String(new Date(value).getHours()).padStart(2, '0');
    }
    return '12';
  });

  const [minutes, setMinutes] = useState(() => {
    if (value) {
      return String(new Date(value).getMinutes()).padStart(2, '0');
    }
    return '00';
  });

  const wrapperRef = useRef(null);

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
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    date.setHours(h, m, 0, 0);
    const formatted = formatDateTimeToValue(date);
    onChange?.(formatted);
  };

  const handleTimeChange = (newHours, newMinutes) => {
    if (!value) return;

    const date = new Date(value);
    date.setHours(parseInt(newHours) || 0, parseInt(newMinutes) || 0, 0, 0);
    const formatted = formatDateTimeToValue(date);
    onChange?.(formatted);
  };

  const handleHoursChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    if (val && parseInt(val) > 23) val = '23';
    setHours(val);
    if (val.length === 2) {
      handleTimeChange(val, minutes);
    }
  };

  const handleMinutesChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    if (val && parseInt(val) > 59) val = '59';
    setMinutes(val);
    if (val.length === 2) {
      handleTimeChange(hours, val);
    }
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
      selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
    }

    const minDate = min ? new Date(min) : null;
    if (minDate) minDate.setHours(0, 0, 0, 0);

    return days.map((dayInfo, index) => {
      const dayDate = new Date(dayInfo.date);
      dayDate.setHours(0, 0, 0, 0);

      const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
      const isToday = dayDate.getTime() === today.getTime();
      const isDisabled = minDate && dayDate.getTime() < minDate.getTime();

      return (
        <DayCell
          key={index}
          onClick={() => !isDisabled && handleDateClick(dayInfo.date)}
          $selected={isSelected}
          $today={isToday}
          $otherMonth={dayInfo.otherMonth}
          disabled={isDisabled}
        >
          {dayInfo.date.getDate()}
        </DayCell>
      );
    });
  };

  const currentYear = viewDate.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <DateTimePickerWrapper ref={wrapperRef}>
      <DateTimeInput
        type="text"
        value={formatDateTimeToDisplay(value)}
        onClick={() => setIsOpen(!isOpen)}
        placeholder={placeholder}
        readOnly
        $hasValue={!!value}
        $error={error}
      />

      {isOpen && (
        <CalendarDropdown>
          <CalendarSection>
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
          </CalendarSection>

          <TimeSection>
            <TimeLabel>Время</TimeLabel>
            <TimeInputs>
              <TimeInputGroup>
                <TimeInput
                  type="text"
                  value={hours}
                  onChange={handleHoursChange}
                  placeholder="00"
                  maxLength={2}
                />
                <TimeUnit>часов</TimeUnit>
              </TimeInputGroup>
              <TimeInputGroup>
                <TimeInput
                  type="text"
                  value={minutes}
                  onChange={handleMinutesChange}
                  placeholder="00"
                  maxLength={2}
                />
                <TimeUnit>минут</TimeUnit>
              </TimeInputGroup>
            </TimeInputs>
          </TimeSection>
        </CalendarDropdown>
      )}
    </DateTimePickerWrapper>
  );
};

export default CustomDateTimePicker;
