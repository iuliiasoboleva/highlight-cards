import React from 'react';
import './styles.css';
import { ArrowUp, Minus } from 'lucide-react';

const StatisticInfo = ({ colorClass, label, value = 0, change = 0 }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="client-stat-card">
      <div className="client-stat-top">
        <span className="client-stat-value">{value}</span>
        <div className={`client-stat-change-wrapper ${isPositive ? 'positive' : 'neutral'}`}>
          <div className="client-stat-icon-circle">
            {isPositive ? <ArrowUp size={14} /> : <Minus size={14} />}
          </div>
          <span className={`client-stat-change-value ${isPositive ? 'green' : 'orange'}`}>
            {isPositive ? `+${change}` : change}
          </span>
        </div>
      </div>
      <div className="client-stat-label">
        <span className={`client-stat-dot ${colorClass}`}></span>
        <span>{label}</span>
      </div>
    </div>
  );
};

export default StatisticInfo;
