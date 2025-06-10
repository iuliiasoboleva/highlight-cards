import React from 'react';

import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

import './styles.css';

const StatisticInfo = ({ colorClass, label, value = 0, change = 0 }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const changeType = isPositive ? 'positive' : isNegative ? 'negative' : 'neutral';

  return (
    <div className="client-stat-card">
      <div className="client-stat-top">
        <span className="client-stat-dropdown-value">{value}</span>
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
      <div className="client-stat-top">
        <div className="client-stat-dropdown-label">
          <span className={`client-stat-dot ${colorClass}`}></span>
          <span>{label}</span>
        </div>
        <span className={`client-stat-change-value ${changeType}`}>
          {isPositive ? `+${change}` : change}
        </span>
      </div>
    </div>
  );
};

export default StatisticInfo;
