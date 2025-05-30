import React from 'react';

import { Trash2 } from 'lucide-react';

import './styles.css';

const CardStatusForm = ({ statusFields, onFieldChange, onAddField, onRemoveField }) => {
  return (
    <>
      <div className="card-status-header">
        <span>Название статуса</span>
        <span>Затраты для достижения</span>
        <span>Процент %</span>
      </div>

      {statusFields.map((field, index) => (
        <div key={index} className="card-status-row">
          <input
            type="text"
            className="custom-input"
            value={field.name}
            onChange={(e) => onFieldChange(index, 'name', e.target.value)}
            placeholder="Название статуса"
          />
          <input
            type="number"
            className="custom-input"
            value={field.cost}
            onChange={(e) => onFieldChange(index, 'cost', e.target.value)}
            placeholder="Затраты для достижения"
          />
          <input
            type="number"
            className="custom-input"
            value={field.percent}
            onChange={(e) => onFieldChange(index, 'percent', e.target.value)}
            placeholder="Процент %"
          />
          <button
            className="card-form-delete-btn"
            onClick={() => onRemoveField(index)}
            aria-label="Удалить статус"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      <button className="card-form-add-btn" onClick={onAddField} disabled={statusFields.length > 6}>
        Добавить статус
      </button>
    </>
  );
};

export default CardStatusForm;
