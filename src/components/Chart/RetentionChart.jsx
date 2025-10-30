import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ru } from 'date-fns/locale';

import { retentionMockData } from '../../mocks/retentionMockData';
import ClientsActivityChart from '../ClientActivityChart';
import TitleWithHelp from '../TitleWithHelp';
import { DatepickerWrapper, FilterButton, Filters, TitleBlock, TitleFilterWrapper } from './styles';

const periods = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  allTime: 'Все время',
  custom: 'Период',
};

const RetentionChart = ({ title = 'Возвращаемость', externalData = null }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [customRange, setCustomRange] = useState({ start: null, end: null });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const periodButtonRef = useRef(null);
  const calendarRef = useRef(null);

  const [chartData, setChartData] = useState(externalData || []);

  const allPoints = useMemo(() => {
    if (externalData !== null && externalData !== undefined) {
      return externalData
        .map((p) => ({ ...p, _date: new Date(p.date) }))
        .filter((p) => !isNaN(p._date));
    }
    const arrays = Object.values(retentionMockData).filter(Array.isArray);
    const flat = arrays.flat();
    return flat.map((p) => ({ ...p, _date: new Date(p.date) })).filter((p) => !isNaN(p._date));
  }, [externalData]);

  const filterByRange = (from, to) => {
    return allPoints
      .filter((p) => p._date >= from && p._date <= to)
      .sort((a, b) => a._date - b._date)
      .map((p) => ({ ...p, date: p._date.toISOString() }));
  };

  useEffect(() => {
    const now = new Date();
    const end = now;
    let data = [];

    if (selectedPeriod === 'allTime') {
      data = [...allPoints]
        .sort((a, b) => a._date - b._date)
        .map((p) => ({ ...p, date: p._date.toISOString() }));
    } else if (selectedPeriod === 'custom') {
      if (customRange.start && customRange.end) {
        data = filterByRange(customRange.start, customRange.end);
      } else {
        data = [];
      }
    } else {
      const daysMap = { day: 1, week: 7, month: 30, year: 365 };
      const days = daysMap[selectedPeriod] ?? 30;
      const start = new Date(end);
      start.setDate(start.getDate() - days + 1);
      data = filterByRange(start, end);
    }

    setChartData(data);
  }, [selectedPeriod, customRange, allPoints]);

  // клик вне календаря — закрыть
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!calendarRef.current) return;
      if (!calendarRef.current.contains(e.target) && !periodButtonRef.current?.contains(e.target)) {
        setIsCalendarVisible(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handlePeriodClick = (key) => {
    setSelectedPeriod(key);
    setIsCalendarVisible(key === 'custom');
  };

  const handleDateChange = ([start, end]) => {
    setCustomRange({ start, end });
  };

  const sortedChartData = chartData; // уже отсортировано выше

  // агрегируем метрику для карточки
  const { value, change } = useMemo(() => {
    if (!sortedChartData.length) return { value: 0, change: 0 };
    const mid = Math.floor(sortedChartData.length / 2);
    const prevSum = sortedChartData
      .slice(0, mid)
      .reduce((acc, cur) => acc + (cur.retention || 0), 0);
    const nextSum = sortedChartData.slice(mid).reduce((acc, cur) => acc + (cur.retention || 0), 0);
    const ch = prevSum === 0 ? nextSum : ((nextSum - prevSum) / prevSum) * 100;
    return { value: nextSum, change: Number.isFinite(ch) ? Math.round(ch) : 0 };
  }, [sortedChartData]);

  return (
    <>
      <TitleBlock>
        <TitleFilterWrapper>
          <TitleWithHelp
            title={title}
            tooltipId="retention-help"
            tooltipHtml
            tooltipContent={`Отображает количество вернувшихся клиентов за выбранный период<br/>
Retention Rate = (C(repeat) / C(current))*100%<br/>
где:<br/>
C(repeat) — количество клиентов, которые были в обоих периодах (текущем и предыдущем).<br/>
C(current) — общее количество клиентов в текущем периоде.`}
          />

          <Filters>
            {Object.entries(periods).map(([key, label]) => (
              <FilterButton
                key={key}
                onClick={() => handlePeriodClick(key)}
                className={selectedPeriod === key ? 'active' : ''}
                ref={key === 'custom' ? periodButtonRef : null}
              >
                {label}
              </FilterButton>
            ))}

            {selectedPeriod === 'custom' && isCalendarVisible && (
              <DatepickerWrapper ref={calendarRef}>
                <DatePicker
                  selected={customRange.start}
                  onChange={handleDateChange}
                  startDate={customRange.start}
                  endDate={customRange.end}
                  selectsRange
                  inline
                  locale={ru}
                  maxDate={new Date()}
                />
              </DatepickerWrapper>
            )}
          </Filters>
        </TitleFilterWrapper>
      </TitleBlock>

      <ClientsActivityChart
        chartData={sortedChartData}
        dataKey="retention"
        lineLabels={{ retention: 'Возвращаемость' }}
        selectedPeriod={selectedPeriod}
        label="Возвращаемость"
        value={value}
        change={change}
      />
    </>
  );
};

export default RetentionChart;
