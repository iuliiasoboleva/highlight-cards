import React from 'react';

const PointsEarningConfig = ({ spendingAmount, points, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      spendingAmount,
      points,
      [field]: value,
    });
  };

  return (
    <div className="form-section">
      <div className="section-title">Как ваши клиенты заработают баллы?</div>
      <div className="subtext">Например: 1 балл за каждый потраченный 1$.</div>
      <div className="points-row">
        <span className="currency-label">$</span>
        <input
          className="small-input"
          type="number"
          value={spendingAmount}
          onChange={(e) => handleChange('spendingAmount', e.target.value)}
        />
        <span className="equal">=</span>
        <input
          className="small-input"
          type="number"
          value={points}
          onChange={(e) => handleChange('points', e.target.value)}
        />
        <span className="unit">Баллов</span>
      </div>
    </div>
  );
};

export default PointsEarningConfig;
