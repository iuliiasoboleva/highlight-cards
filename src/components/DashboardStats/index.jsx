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
        <div key={index} className="stat-card">
          <div className="stat-value">{stat.value}</div>
          <div className="stat-icon">−</div>
          <div className="stat-footer">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
      <div className="stat-card loyalty">
        <div className="stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>☆</span>
          ))}
        </div>
        <div className="stat-label">Уровень лояльности</div>
      </div>
    </div>
  );
};

export default DashboardStats;
