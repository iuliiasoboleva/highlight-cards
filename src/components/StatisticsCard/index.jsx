import React, { useEffect, useRef, useState } from 'react';

import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

const StatisticsCard = ({ chartData, overallStats, lineLabels, selectedPeriod, getDateRange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="statistics-card">
      <div className="statistics-header">
        <div className="filters-block">
          <span>{getDateRange()}</span>
        </div>
      </div>

      <div className="statistics-content">
        <div className="statistics-left">
          <div className="statistics-grid">
            <div className="stat-item">
              <div className="stat-label">Всего визитов</div>
              <div className="stat-value">{chartData[chartData.length - 1]?.visits || 0}</div>
              <div className="stat-change neutral">{overallStats?.totalVisits?.change ?? 0}</div>
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
              <div className="stat-value">
                {chartData[chartData.length - 1]?.repeatClients || 0}
              </div>
              <div className="stat-change neutral">{overallStats?.repeatClients?.change ?? 0}</div>
            </div>
          </div>

          <div className="chart-wrapper">
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
        </div>

        <div className="statistics-right">
          <div className="summary-item">
            <div className="summary-left">
              <span className="summary-dot repeat"></span>
              <span className="summary-label">Повторные клиенты</span>
            </div>
            <div className="summary-values">
              <span className="summary-count">{overallStats?.repeatClients?.value ?? 0}</span>
              <span className="summary-change neutral">
                {overallStats?.repeatClients?.change ?? 0}
              </span>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-left">
              <span className="summary-dot new"></span>
              <span className="summary-label">Новые клиенты</span>
            </div>
            <div className="summary-values">
              <span className="summary-count">{overallStats?.newClients?.value ?? 0}</span>
              <span className="summary-change positive">
                {overallStats?.newClients?.change ?? 0}
              </span>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-left">
              <span className="summary-dot referral"></span>
              <span className="summary-label">Рефералы</span>
            </div>
            <div className="summary-values">
              <span className="summary-count">{overallStats?.referrals?.value ?? 0}</span>
              <span className="summary-change neutral">{overallStats?.referrals?.change ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
