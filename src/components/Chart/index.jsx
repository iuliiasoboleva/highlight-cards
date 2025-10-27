import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ru } from 'date-fns/locale';

import {
  mockStatsDataDay,
  mockStatsDataMonth,
  mockStatsDataWeek,
  mockStatsDataYear,
} from '../../mocks/chartData';
import { calculateOverallStats } from '../../utils/calculateOverallStats';
import StatisticsCard from '../StatisticsCard';
import TitleWithHelp from '../TitleWithHelp/index.jsx';
import {
  DatepickerWrapper,
  FilterButton,
  Filters,
  TitleBlock,
  TitleFilterWrapper,
} from './styles.jsx';

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
    if (externalData !== null && externalData !== undefined) {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      
      const filtered = externalData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= now;
      });
      
      setChartData(filtered.length ? filtered : externalData);
    }
  }, [externalData]);

  useEffect(() => {
    if (externalData === null || externalData === undefined) {
      if (selectedPeriod === 'custom') {
        return;
      }
      const newData = dataMap[selectedPeriod] || [];
      const sortedData = [...newData].sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData(sortedData);
      setSelectedRange({ start: null, end: null });
      setIsCalendarVisible(false);
      return;
    }

    if (selectedPeriod === 'custom') {
      return;
    }

    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'allTime':
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(0);
    }

    const filtered = externalData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });

    const sortedFiltered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setChartData(sortedFiltered);
    setSelectedRange({ start: null, end: null });
    setIsCalendarVisible(false);
  }, [selectedPeriod, externalData]);

  useEffect(() => {
    const sorted = [...chartData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let previousData = [];
    let previousPreviousData = [];
    
    if (sorted.length === 0) {
      const stats = calculateOverallStats([], [], []);
      setOverallStats(stats);
      return;
    }
    
    if (externalData !== null && externalData !== undefined && sorted.length) {
      const currentStart = new Date(sorted[0].date);
      const currentEnd = new Date(sorted[sorted.length - 1].date);
      const diffMs = currentEnd - currentStart;
      
      if (selectedPeriod === 'allTime') {
        const mid = Math.floor(sorted.length / 2);
        const quarter = Math.floor(sorted.length / 4);
        previousData = sorted.slice(0, mid);
        previousPreviousData = sorted.slice(0, quarter);
      } else {
        const previousEnd = new Date(currentStart.getTime() - 1);
        const previousStart = new Date(previousEnd.getTime() - diffMs);
        
        previousData = externalData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= previousStart && itemDate <= previousEnd;
        });
        
        const previousPreviousEnd = new Date(previousStart.getTime() - 1);
        const previousPreviousStart = new Date(previousPreviousEnd.getTime() - diffMs);
        
        previousPreviousData = externalData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= previousPreviousStart && itemDate <= previousPreviousEnd;
        });
      }
    } else {
      const mid = Math.floor(sorted.length / 2);
      const quarter = Math.floor(sorted.length / 4);
      previousData = sorted.slice(0, mid);
      previousPreviousData = sorted.slice(0, quarter);
    }
    
    const stats = calculateOverallStats(sorted, previousData, previousPreviousData);
    setOverallStats(stats);
  }, [chartData, selectedPeriod, selectedRange, externalData]);

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
      
      const sourceData = (externalData !== null && externalData !== undefined) ? externalData : Object.values(dataMap).flat();
      const byDate = new Map();
      for (const item of sourceData) {
        byDate.set(item.date, item);
      }

      const filtered = [...byDate.values()].filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });

      const sortedFiltered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      setChartData(sortedFiltered);
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
    }
  };

  return (
    <>
      <TitleBlock>
        <TitleFilterWrapper>
          <TitleWithHelp
            title={title}
            tooltipId="chart-help"
            tooltipHtml
            tooltipContent={subtitle}
          />
          <Filters>
            {Object.keys(periods).map((key) => (
              <FilterButton
                key={key}
                onClick={() => handlePeriodClick(key)}
                className={selectedPeriod === key ? 'active' : ''}
                ref={key === 'custom' ? periodButtonRef : null}
              >
                {periods[key]}
              </FilterButton>
            ))}
          </Filters>
        </TitleFilterWrapper>
      </TitleBlock>

      <StatisticsCard
        chartData={sortedChartData}
        overallStats={overallStats}
        lineLabels={lineLabels}
        selectedPeriod={selectedPeriod}
        getDateRange={getDateRange}
      />

      {selectedPeriod === 'custom' && isCalendarVisible && (
        <DatepickerWrapper
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
        </DatepickerWrapper>
      )}
    </>
  );
};

export default Chart;
