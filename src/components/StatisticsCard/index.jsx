import React from 'react';

import {
  CartesianGrid,
  Line,
  LineChart,
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
