import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ru } from 'date-fns/locale';

import StatisticsCard from '../StatisticsCard';

import './styles.css';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const Chart = ({
  title = 'Статистика аккаунта',
  subtitle,
  generateData,
  overallStats,
  periodLabels,
  periods,
  lineLabels = {
    visits: 'Визиты',
    repeatClients: 'Повторные клиенты',
    newClients: 'Новые клиенты',
  },
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const periodButtonRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedPeriod !== 'custom') {
      const newData = generateData(selectedPeriod);
      setChartData(newData);
    }
  }, [selectedPeriod, generateData]);

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
      const allData = generateData('month');
      const filteredData = allData.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
      setChartData(filteredData);
    }
  };

  const getDateRange = () => {
    if (selectedPeriod === 'custom') {
      if (chartData.length === 0) {
        return `За ${periodLabels[selectedPeriod]}: данных нет`;
      }
    } else {
      if (chartData.length === 0) return '';
    }

    if (selectedPeriod === 'day') {
      const currentDate = new Date(chartData[0].date).toLocaleDateString('ru-RU', {
        month: 'short',
        day: '2-digit',
      });
      return `За ${periodLabels[selectedPeriod]}, ${currentDate}`;
    }

    const startDate = new Date(chartData[0].date).toLocaleDateString('ru-RU', {
      month: 'short',
      day: '2-digit',
    });

    const endDate = new Date(chartData[chartData.length - 1].date).toLocaleDateString('ru-RU', {
      month: 'short',
      day: '2-digit',
    });

    return `За ${periodLabels[selectedPeriod]}, ${startDate} - ${endDate}`;
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
            <h2 className="title">{title}
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
        chartData={chartData}
        overallStats={overallStats}
        lineLabels={lineLabels}
        selectedPeriod={selectedPeriod}
        getDateRange={getDateRange}
      />

      {/* === Календарь === */}
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
