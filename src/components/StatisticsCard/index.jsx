import React from 'react';

import {
  CartesianGrid,
  LineChart,
  Line as RechartsLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ClientStatDropdownCard from '../ClientStatDropdownCard';
import StatisticInfo from '../StatisticInfo';

import './styles.css';

const StatisticsCard = ({ chartData, overallStats, lineLabels, selectedPeriod, getDateRange }) => {
  const axisStyle = {
    fontSize: '12px',
    lineHeight: 1.6666666667,
    color: '#656565',
    letterSpacing: '-0.024rem',
    fontFamily: 'Manrope, sans-serif',
  };

  return (
    <div className="statistics-card">
      <div className="statistics-header">
        <div className="filters-block">
          <span>{getDateRange()}</span>
        </div>
      </div>

      <div className="statistics-content">
        <div className="statistics-left">
          <div className="statistics-card-grid">
            <ClientStatDropdownCard
              selectable={false}
              initialKey="lastPeriod"
              statsByType={{
                referral: {
                  value: overallStats?.referrals?.value ?? 0,
                  change: overallStats?.referrals?.change ?? 0,
                },
              }}
            />

            <ClientStatDropdownCard
              selectable={true}
              statsByType={{
                new: {
                  value: overallStats?.newClients?.value ?? 0,
                  change: overallStats?.newClients?.change ?? 0,
                },
                repeat: {
                  value: overallStats?.repeatClients?.value ?? 0,
                  change: overallStats?.repeatClients?.change ?? 0,
                },
                referral: {
                  value: overallStats?.referrals?.value ?? 0,
                  change: overallStats?.referrals?.change ?? 0,
                },
              }}
            />

            <ClientStatDropdownCard
              selectable={false}
              initialKey="visits"
              statsByType={{
                visits: {
                  value: overallStats?.totalVisits?.value ?? 0,
                  change: overallStats?.totalVisits?.change ?? 0,
                },
              }}
            />
          </div>

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
                    cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 40 }}
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

                  <RechartsLine
                    type="monotone"
                    dataKey="repeatClients"
                    stroke="#6C2BD9"
                    name={lineLabels.repeatClients}
                    strokeWidth={2}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="newClients"
                    stroke="#C7A4FF"
                    name={lineLabels.newClients}
                    strokeWidth={2}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="visits"
                    stroke="#34C759"
                    name={lineLabels.visits}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="statistics-right">
          <StatisticInfo
            colorClass="repeat"
            label="Повторные клиенты"
            value={overallStats?.repeatClients?.value ?? 0}
            change={overallStats?.repeatClients?.change ?? 0}
          />
          <StatisticInfo
            colorClass="new"
            label="Новые клиенты"
            value={overallStats?.newClients?.value ?? 0}
            change={overallStats?.newClients?.change ?? 0}
          />
          <StatisticInfo
            colorClass="referral"
            label="Рефералы"
            value={overallStats?.referrals?.value ?? 0}
            change={overallStats?.referrals?.change ?? 0}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
