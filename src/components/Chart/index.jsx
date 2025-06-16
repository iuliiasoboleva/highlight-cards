import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip } from 'react-tooltip';

import { ru } from 'date-fns/locale';
import { HelpCircle } from 'lucide-react';

import {
  mockStatsDataDay,
  mockStatsDataMonth,
  mockStatsDataWeek,
  mockStatsDataYear,
} from '../../mocks/chartData';
import { calculateOverallStats } from '../../utils/calculateOverallStats';
import StatisticsCard from '../StatisticsCard';

import './datepickerOverrides.css';
import './styles.css';

const periods = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  allTime: 'Все время',
  custom: 'Период',
};

const periodLabels = {
  day: 'день',
  week: 'неделю',
  month: 'месяц',
  year: 'год',
  allTime: 'всё время',
  custom: 'период',
};

const Chart = ({
  title = 'Статистика аккаунта',
  subtitle,
  lineLabels = {
    visits: 'Визиты',
    repeatClients: 'Повторные клиенты',
    newClients: 'Новые клиенты',
  },
  externalData = null,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState(externalData || []);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [overallStats, setOverallStats] = useState({});

  const periodButtonRef = useRef(null);
  const calendarRef = useRef(null);

  const dataMap = {
    day: mockStatsDataDay,
    week: mockStatsDataWeek,
    month: mockStatsDataMonth,
    year: mockStatsDataYear,
    allTime: mockStatsDataYear,
  };

  const sortedChartData = useMemo(() => {
    return [...chartData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [chartData]);

  useEffect(() => {
    if (externalData) return;
    if (selectedPeriod !== 'custom') {
      const newData = dataMap[selectedPeriod] || [];
      const sortedData = [...newData].sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData(sortedData);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    const sorted = [...chartData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const mid = Math.floor(sorted.length / 2);
    const previousData = sorted.slice(0, mid);
    const stats = calculateOverallStats(sorted, previousData);
    setOverallStats(stats);
  }, [chartData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (externalData) return;
    if (selectedPeriod !== 'custom') {
      setChartData(dataMap[selectedPeriod] || []);
      setSelectedRange({ start: null, end: null });
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedPeriod === 'custom' && periodButtonRef.current) {
      const rect = periodButtonRef.current.getBoundingClientRect();
      let top = rect.bottom + window.scrollY + 4;
      let left = rect.left + window.scrollX;

      const calendarWidth = 320;
      if (left + calendarWidth > window.innerWidth) {
        left = window.innerWidth - calendarWidth - 10;
      }

      const calendarHeight = 350;
      if (top + calendarHeight > window.innerHeight) {
        top = rect.top + window.scrollY - calendarHeight - 10;
      }

      setCalendarPosition({ top, left });
      setIsCalendarVisible(true);
    }
  }, [selectedPeriod]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setCustomStartDate(start);
    setCustomEndDate(end);

    if (start && end) {
      setSelectedRange({ start, end });
      const allData = Object.values(dataMap).flat();
      const filtered = allData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
      setChartData(filtered);
    }
  };

  const getDateRange = () => {
    if (selectedPeriod === 'custom') {
      const { start, end } = selectedRange;
      if (!start || !end) return `За период: данных нет`;

      return `За период, ${start.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
      })} — ${end.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
      })}`;
    }

    if (!sortedChartData.length) {
      return `За ${periodLabels[selectedPeriod]}: данных нет`;
    }

    const start = new Date(sortedChartData[0].date);
    const end = new Date(sortedChartData[sortedChartData.length - 1].date);

    const format = { day: '2-digit', month: 'short' };

    if (selectedPeriod === 'allTime') {
      return `За всё время, ${start.toLocaleDateString('ru-RU', {
        ...format,
        year: 'numeric',
      })} — ${end.toLocaleDateString('ru-RU', {
        ...format,
        year: 'numeric',
      })}`;
    }

    return `За ${periodLabels[selectedPeriod]}, ${start.toLocaleDateString('ru-RU', format)} — ${end.toLocaleDateString('ru-RU', format)}`;
  };

  const handlePeriodClick = (key) => {
    setSelectedPeriod(key);
    if (key === 'custom') {
      setIsCalendarVisible(true);
    } else {
      setIsCalendarVisible(false);
    }
  };

  return (
    <>
      <div className="title-block">
        <div className="title-filter-wrapper">
          <div>
            <h2 className="title">
              {title}
              <HelpCircle
                size={16}
                style={{ marginLeft: 6, cursor: 'pointer' }}
                data-tooltip-id="managers-help"
                data-tooltip-content={subtitle}
              />
            </h2>
            <Tooltip id="managers-help" className="custom-tooltip" />
          </div>
          <div className="filters">
            {Object.keys(periods).map((key) => (
              <button
                key={key}
                onClick={() => handlePeriodClick(key)}
                className={selectedPeriod === key ? 'active' : ''}
                ref={key === 'custom' ? periodButtonRef : null}
              >
                {periods[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StatisticsCard
        chartData={sortedChartData}
        overallStats={overallStats}
        lineLabels={lineLabels}
        selectedPeriod={selectedPeriod}
        getDateRange={getDateRange}
      />

      {selectedPeriod === 'custom' && isCalendarVisible && (
        <div
          className="datepicker-wrapper"
          ref={calendarRef}
          style={{
            top: `${calendarPosition.top}px`,
            left: `${calendarPosition.left}px`,
            opacity: calendarPosition.top ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <DatePicker
            selected={customStartDate}
            onChange={handleDateChange}
            startDate={customStartDate}
            endDate={customEndDate}
            selectsRange
            inline
            locale={ru}
            maxDate={new Date()}
          />
        </div>
      )}
    </>
  );
};

export default Chart;
