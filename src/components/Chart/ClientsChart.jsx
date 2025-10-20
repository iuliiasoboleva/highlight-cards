import React, { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ru } from 'date-fns/locale';

import { clientActivityMockData } from '../../mocks/clientActivityMockData';
import ClientsActivityChart from '../ClientActivityChart';
import {
  ChartsBlock,
  DatepickerWrapper,
  FilterButton,
  Filters,
  Subtitle,
  TitleBlock,
  TitleFilterWrapper,
} from './styles';

const periods = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  allTime: 'Все время',
  custom: 'Период',
};

const ClientsChart = ({ title = 'Клиентская активность', externalData = null }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState(externalData || []);
  const [customRange, setCustomRange] = useState({ start: null, end: null });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const clientPeriodButtonRef = useRef(null);
  const clientCalendarRef = useRef(null);

  useEffect(() => {
    if (externalData && externalData.length) {
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
    if (!externalData || !externalData.length) {
      if (selectedPeriod === 'custom' && customRange.start && customRange.end) {
        const all = Object.values(clientActivityMockData).flat();
        const filtered = all.filter((item) => {
          const date = new Date(item.date);
          return date >= customRange.start && date <= customRange.end;
        });
        setChartData(filtered);
      } else {
        setChartData(clientActivityMockData[selectedPeriod] || []);
      }
      return;
    }

    const now = new Date();
    let startDate;

    if (selectedPeriod === 'custom') {
      if (customRange.start && customRange.end) {
        const filtered = externalData.filter((item) => {
          const date = new Date(item.date);
          return date >= customRange.start && date <= customRange.end;
        });
        setChartData(filtered);
      }
      return;
    }

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

    setChartData(filtered);
  }, [selectedPeriod, customRange, externalData]);

  const sortedChartData = useMemo(() => {
    return [...chartData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [chartData]);

  const calculateChange = (key) => {
    const mid = Math.floor(sortedChartData.length / 2);
    const prevSum = sortedChartData.slice(0, mid).reduce((acc, cur) => acc + (cur[key] || 0), 0);
    const nextSum = sortedChartData.slice(mid).reduce((acc, cur) => acc + (cur[key] || 0), 0);
    const change = prevSum === 0 ? nextSum : ((nextSum - prevSum) / prevSum) * 100;
    return {
      value: nextSum,
      change: isFinite(change) ? Math.round(change) : 0,
    };
  };

  const handlePeriodClick = (key) => {
    setSelectedPeriod(key);
    if (key !== 'custom') {
      setIsCalendarVisible(false);
    }
  };

  const handleDateChange = ([start, end]) => {
    setCustomRange({ start, end });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientCalendarRef.current && !clientCalendarRef.current.contains(event.target)) {
        setIsCalendarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedPeriod === 'custom' && clientPeriodButtonRef.current) {
      const rect = clientPeriodButtonRef.current.getBoundingClientRect();
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

      setIsCalendarVisible(true);
    }
  }, [selectedPeriod]);

  const newClientsStats = calculateChange('newClients');
  const cardsIssuedStats = calculateChange('cardsIssued');

  return (
    <>
      <TitleBlock>
        <TitleFilterWrapper>
          <div>
            <Subtitle>{title}</Subtitle>
          </div>

          <Filters>
            {Object.entries(periods).map(([key, label]) => (
              <FilterButton
                key={key}
                onClick={() => handlePeriodClick(key)}
                className={selectedPeriod === key ? 'active' : ''}
                ref={key === 'custom' ? clientPeriodButtonRef : null}
              >
                {label}
              </FilterButton>
            ))}

            {selectedPeriod === 'custom' && isCalendarVisible && (
              <DatepickerWrapper ref={clientCalendarRef}>
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

      <ChartsBlock>
        <ClientsActivityChart
          chartData={sortedChartData}
          dataKey="newClients"
          lineLabels={{ newClients: 'Новые клиенты' }}
          selectedPeriod={selectedPeriod}
          label="Новые клиенты"
          value={newClientsStats.value}
          change={newClientsStats.change}
        />

        <ClientsActivityChart
          chartData={sortedChartData}
          dataKey="cardsIssued"
          lineLabels={{ cardsIssued: 'Карт выдано' }}
          selectedPeriod={selectedPeriod}
          label="Карт выдано"
          value={cardsIssuedStats.value}
          change={cardsIssuedStats.change}
        />
      </ChartsBlock>
    </>
  );
};

export default ClientsChart;
