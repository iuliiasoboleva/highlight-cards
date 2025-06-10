import React from 'react';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
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

const ClientsActivityChart = ({
  chartData,
  lineLabels,
  selectedPeriod,
  change,
  value,
  label,
  dataKey,
}) => {
  const axisStyle = {
    fontSize: '12px',
    lineHeight: 1.6666666667,
    color: '#656565',
    letterSpacing: '-0.024rem',
    fontFamily: 'Manrope, sans-serif',
  };

  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  return (
    <div className="statistics-card">
      <div className="client-stat-header">
        <div className="client-stat-left">
          <span className="client-stat-title">{label}</span>
          <span className="client-stat-subtitle">{value}</span>
        </div>
        <div className="client-stat-right">
          <span className={`client-stat-change-value ${changeType}`}>
            {isPositive ? `+${change}` : change}
          </span>
          <div className={`client-stat-change-wrapper ${changeType}`}>
            <div className={`client-stat-dropdown-icon-circle ${changeType}`}>
              {isPositive ? (
                <ArrowUp size={14} className={`client-stat-icon ${changeType}`} />
              ) : isNegative ? (
                <ArrowDown size={14} className={`client-stat-icon ${changeType}`} />
              ) : (
                <Minus size={14} className={`client-stat-icon ${changeType}`} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="statistics-content">
        <div className="statistics-left">
          <div className="chart-wrapper">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e6e6e6" strokeDasharray="2 4" strokeWidth={1} />
                  <XAxis
                    dataKey="date"
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      selectedPeriod === 'day'
                        ? `${new Date(value).getHours()}:00`
                        : new Date(value).toLocaleDateString('ru-RU', {
                            month: 'short',
                            day: '2-digit',
                          })
                    }
                  />
                  <YAxis
                    tick={axisStyle}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    padding={{ top: 10, bottom: 10 }}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey={dataKey} // ✅ теперь работает правильно
                    stroke="#ffc658"
                    name={lineLabels?.[dataKey] ?? label}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsActivityChart;
