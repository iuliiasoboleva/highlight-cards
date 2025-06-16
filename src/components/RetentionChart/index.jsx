import React, { useEffect, useMemo, useState } from 'react';

import { retentionMockData } from '../../mocks/retentionMockData';
import ClientsActivityChart from '../ClientActivityChart';

const periods = {
  days60: '60 дней',
  days120: '120 дней',
  days240: '240 дней',
};

const RetentionChart = ({ title = 'Возвращаемость', externalData = null }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('days60');
  const [chartData, setChartData] = useState(externalData || []);

  useEffect(() => {
    if (externalData) return;
    setChartData(retentionMockData[selectedPeriod] || []);
  }, [selectedPeriod]);

  const sortedChartData = useMemo(() => {
    return [...chartData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [chartData]);

  const calculateChange = () => {
    const mid = Math.floor(sortedChartData.length / 2);
    const prevSum = sortedChartData
      .slice(0, mid)
      .reduce((acc, cur) => acc + (cur.retention || 0), 0);
    const nextSum = sortedChartData.slice(mid).reduce((acc, cur) => acc + (cur.retention || 0), 0);
    const change = prevSum === 0 ? nextSum : ((nextSum - prevSum) / prevSum) * 100;
    return {
      value: nextSum,
      change: isFinite(change) ? Math.round(change) : 0,
    };
  };

  const { value, change } = calculateChange();

  return (
    <>
      <div className="title-block">
        <div className="title-filter-wrapper">
          <div>
            <h2 className="subtitle">{title}</h2>
          </div>
          <div className="filters">
            {Object.entries(periods).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedPeriod(key)}
                className={selectedPeriod === key ? 'active' : ''}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ClientsActivityChart
        chartData={sortedChartData}
        dataKey="retention"
        lineLabels={{ retention: 'Возвращаемость' }}
        selectedPeriod={selectedPeriod}
        label="Возвращаемость"
        value={value}
        change={change}
      />
    </>
  );
};

export default RetentionChart;
