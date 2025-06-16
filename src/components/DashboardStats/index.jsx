import React from 'react';

import './styles.css';

const defaultStats = [
  { label: 'Установленных карт', key: 'installed', value: 0 },
  { label: 'Клиентов в базе', key: 'clients', value: 0 },
  { label: 'Штампов начислено', key: 'stamps', value: 0 },
  { label: 'Транзакций', key: 'transactions', value: 0 },
  { label: 'Наград заработано', key: 'rewards', value: 0 },
  { label: 'Отзывов', key: 'reviews', value: 0 },
  { label: 'Наград получено', key: 'rewardsReceived', value: 0 },
];

const DashboardStats = ({ data = null }) => {
  const stats = defaultStats.map((item) => ({
    ...item,
    value: data && data[item.key] !== undefined ? data[item.key] : item.value,
  }));

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div key={index} className="dashboard-stat-card">
          <div className="dashboard-stat-row">
            <div className="dashboard-stat-value">{stat.value}</div>
            <div className="dashboard-stat-icon">−</div>
          </div>
          <div className="dashboard-stat-row">
            <div className="dashboard-stat-label">{stat.label}</div>
            <div className="dashboard-stat-footer">{stat.value}</div>
          </div>
        </div>
      ))}
      <div className="dashboard-stat-card">
        <div className="dashboard-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>☆</span>
          ))}
        </div>
        <div className="dashboard-stat-block">
          <p className="dashboard-stat-label">Уровень лояльности</p>
          <span
            className="tooltip-icon"
            data-tooltip="Показатель активности и вовлеченности клиентов."
          >
            ?
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
