import React from "react";
import "./styles.css";

const stats = [
  { label: "Установленных карт", value: 0 },
  { label: "Клиентов в базе", value: 0 },
  { label: "Штампов начислено", value: 0 },
  { label: "Транзакций", value: 0 },
  { label: "Наград заработано", value: 0 },
  { label: "Отзывов", value: 0 },
  { label: "Наград получено", value: 0 },
];

const DashboardStats = () => {
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
          <span className="tooltip-icon" data-tooltip="Показатель активности и вовлеченности клиентов.">?</span>
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;
