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

import './styles.css';
import StatisticInfo from '../StatisticInfo';
import ClientStatDropdownCard from '../ClientStatDropdownCard';

const StatisticsCard = ({ chartData, overallStats, lineLabels, selectedPeriod, getDateRange }) => {
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
              initialKey="referral"
              statsByType={{
                referral: { value: 0, change: 0 },
              }}
            />
            <ClientStatDropdownCard
              selectable={true}
              statsByType={{
                new: { value: 1, change: 1 },
                repeat: { value: 0, change: 0 },
                referral: { value: 0, change: 0 },
              }}
            />
            <ClientStatDropdownCard
              selectable={false}
              initialKey="referral"
              statsByType={{
                referral: { value: 0, change: 0 },
              }}
            />
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
          <StatisticInfo
            colorClass="repeat"
            label="Повторные клиенты"
            value={overallStats?.repeatClients?.value}
            change={overallStats?.repeatClients?.change}
          />
          <StatisticInfo
            colorClass="new"
            label="Новые клиенты"
            value={overallStats?.newClients?.value}
            change={overallStats?.newClients?.change}
          />
          <StatisticInfo
            colorClass="referral"
            label="Рефералы"
            value={overallStats?.referrals?.value}
            change={overallStats?.referrals?.change}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
