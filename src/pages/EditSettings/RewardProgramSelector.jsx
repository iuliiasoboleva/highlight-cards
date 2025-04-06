import React from 'react';

const options = [
  {
    id: 'spending',
    label: 'Расход',
    description: 'Начисление баллов в зависимости от расходов клиента',
  },
  {
    id: 'visit',
    label: 'Визит',
    description: 'Начисление баллов в зависимости от количества посещений клиента',
  },
  {
    id: 'manual',
    label: 'Баллы',
    description: 'Начисление баллов в соответствии с вашими правилами',
  },
];

const RewardProgramSelector = ({ value, onChange }) => {
  return (
    <div className="form-section">
      <div className="section-title">Программа вознаграждения</div>
      <div className="radio-group vertical">
        {options.map((opt) => (
          <label key={opt.id} className="radio-option">
            <input
              type="radio"
              name="rewardProgram"
              value={opt.id}
              checked={value === opt.id}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className="custom-radio green" />
            {opt.label}
            <span className="subtext">({opt.description})</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RewardProgramSelector;
