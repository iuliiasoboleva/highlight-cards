import React, { useState } from 'react';

import './styles.css';

const IssueFieldsModal = ({ fields = [], onClose, onSave }) => {
  const [formState, setFormState] = useState(fields.map((field) => ({ ...field })));

  const handleChange = (index, value) => {
    const updated = [...formState];
    updated[index].value = value;
    setFormState(updated);
  };

  const handleSubmit = () => {
    if (onSave) onSave(formState);
    onClose();
  };

  return (
    <div className="issue-fields-overlay">
      <div className="issue-fields-modal">
        <div className="issue-fields-header">
          <h3>Поля</h3>
          <button className="issue-fields-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="issue-fields-body">
          {formState.map((field, i) => (
            <div key={i} className="issue-fields-field">
              <label>{field.label}</label>
              <input
                type={field.type === 'date' ? 'date' : 'text'}
                value={field.value}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="issue-fields-actions">
          <button className="issue-fields-btn" onClick={handleSubmit}>
            Сохранить
          </button>
          <button className="issue-fields-btn cancel" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueFieldsModal;
