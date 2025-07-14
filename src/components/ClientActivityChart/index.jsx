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
                  <CartesianGrid
                    vertical={true}
                    horizontal={false}
                    stroke="#f0f0f0"
                    strokeDasharray="0"
                  />
                  <XAxis
                    dataKey="date"
                    interval={0}
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
                    width={28}
                    padding={{ top: 6, bottom: 4 }}
                  />

                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload) return null;

                      const date = new Date(label).toLocaleDateString('ru-RU', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      });

                      return (
                        <div
                          style={{
                            backgroundColor: '#fff',
                            border: '1px solid #eee',
                            borderRadius: 8,
                            padding: 8,
                            fontSize: 12,
                            color: '#333',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          }}
                        >
                          <div style={{ marginBottom: 4, fontWeight: 600 }}>{date}</div>
                          {payload.map((item) => (
                            <div key={item.name} style={{ color: item.color }}>
                              {item.name}: {item.value}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={dataKey}
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
