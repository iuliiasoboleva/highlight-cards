import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  faCalendar,
  faCalendarAlt,
  faCalendarDay,
  faCalendarDays,
  faCalendarWeek,
  faInfinity,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ru } from 'date-fns/locale';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import './styles.css';

const periodIcons = {
  day: faCalendarDay,
  week: faCalendarWeek,
  month: faCalendarAlt,
  year: faCalendar,
  allTime: faInfinity,
  custom: faCalendarDays,
};

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const tooltipRef = useRef(null);
  const periodButtonRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
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
        <h2 className="title">{title}</h2>
        <p className="chart-subtitle">{subtitle}</p>
      </div>

      <div className="statistics-card">
        <div className="statistics-header">
          <div className="filters-block">
            <span>{getDateRange()}</span>
            <div className="filters">
              {Object.keys(periods).map((key) => (
                <button
                  key={key}
                  onClick={() => handlePeriodClick(key)}
                  className={selectedPeriod === key ? 'active' : ''}
                  ref={key === 'custom' ? periodButtonRef : null}
                >
                  <FontAwesomeIcon icon={periodIcons[key]} />
                  {periods[key]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="statistics-grid">
          <div className="stat-item">
            <div className="stat-label">Всего визитов</div>
            <div className="stat-value">{chartData[chartData.length - 1]?.visits || 0}</div>
            <div className="stat-change neutral">{overallStats.totalVisits.change}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label stat-tooltip-wrapper" ref={tooltipRef}>
              Повторные клиенты
              <span className="stat-tooltip-icon" onClick={() => setShowTooltip((prev) => !prev)}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
              {showTooltip && (
                <div className="stat-tooltip-box">
                  Клиенты, которые вернулись повторно после первого визита
                </div>
              )}
            </div>

            <div className="stat-value">{chartData[chartData.length - 1]?.repeatClients || 0}%</div>
            <div className="stat-change neutral">{overallStats.repeatClients.change}</div>
          </div>
        </div>

        {/* === График === */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  selectedPeriod === 'day'
                    ? `${new Date(value).getHours()}:00`
                    : new Date(value).toLocaleDateString('ru-RU', {
                        month: 'short',
                        day: '2-digit',
                      })
                }
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#8884d8"
                name={lineLabels.visits}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="repeatClients"
                stroke="#82ca9d"
                name={lineLabels.repeatClients}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="newClients"
                stroke="#ffc658"
                name={lineLabels.newClients}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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
