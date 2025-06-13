import React from 'react';

import './styles.css';

const StatCard = ({ title, value, subtitle, color = '#1a1a1a' }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-value" style={{ color }}>
        {value}
      </div>
      <div className="stat-card-title">{title}</div>
      {subtitle && <div className="stat-card-sub">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
