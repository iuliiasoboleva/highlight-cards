import React, { useState } from 'react';

import './styles.css';

const mockRFM = [
  {
    title: 'RFM - Требуют внимания',
    freqFrom: 8,
    freqTo: 12,
    recencyFrom: 61,
    recencyTo: 90,
  },
  {
    title: 'RFM - Лояльные - постоянные',
    freqFrom: 8,
    freqTo: 12,
    recencyFrom: 31,
    recencyTo: 60,
  },
  {
    title: 'RFM - Чемпионы',
    freqFrom: 8,
    freqTo: 12,
    recencyFrom: 0,
    recencyTo: 30,
  },
  {
    title: 'RFM - В зоне риска',
    freqFrom: 4,
    freqTo: 7,
    recencyFrom: 61,
    recencyTo: 90,
  },
  {
    title: 'RFM - Средние (на грани)',
    freqFrom: 4,
    freqTo: 7,
    recencyFrom: 31,
    recencyTo: 60,
  },
  {
    title: 'RFM - Растущие',
    freqFrom: 4,
    freqTo: 7,
    recencyFrom: 0,
    recencyTo: 30,
  },
];

const SettingsRFMSegment = () => {
  const [segments, setSegments] = useState(mockRFM);

  const handleChange = (index, field, value) => {
    const updated = [...segments];
    updated[index][field] = value;
    setSegments(updated);
  };

  return (
    <div className="rfm-settings-page">
      <h2 className="rfm-title">Настройки RFM</h2>
      <p className="rfm-subtitle">
        <span>Частота – визиты (как часто пользователи у вас покупают)</span>
        <span>Давность – дни (как давно ваши пользователи что-то у вас покупали)</span>
      </p>
      <div className="rfm-warning">При изменении настроек будут пересчитаны все сегменты</div>

      <div className="rfm-grid">
        {segments.map((segment, index) => (
          <div className="rfm-card" key={index}>
            <h4 className="rfm-card-title">{segment.title}</h4>
            <div className="rfm-field-row">
              <div className="rfm-field">
                <label>Частота от</label>
                <input
                  type="number"
                  value={segment.freqFrom}
                  onChange={(e) => handleChange(index, 'freqFrom', e.target.value)}
                />
              </div>
              <div className="rfm-field">
                <label>Частота до</label>
                <input
                  type="number"
                  value={segment.freqTo}
                  onChange={(e) => handleChange(index, 'freqTo', e.target.value)}
                />
              </div>
            </div>
            <div className="rfm-field-row">
              <div className="rfm-field">
                <label>Давность от</label>
                <input
                  type="number"
                  value={segment.recencyFrom}
                  onChange={(e) => handleChange(index, 'recencyFrom', e.target.value)}
                />
              </div>
              <div className="rfm-field">
                <label>Давность до</label>
                <input
                  type="number"
                  value={segment.recencyTo}
                  onChange={(e) => handleChange(index, 'recencyTo', e.target.value)}
                />
              </div>
            </div>
            <button className="btn-dark">Сохранить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsRFMSegment;
