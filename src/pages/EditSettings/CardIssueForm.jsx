import React from 'react';

import { Trash2 } from 'lucide-react';

import ToggleSwitch from '../../components/ToggleSwitch';
import CustomSelect from '../../customs/CustomSelect';

import './styles.css';

const fieldOptions = [
  { value: 'name', label: 'Имя' },
  { value: 'surname', label: 'Фамилия' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
  { value: 'birthday', label: 'Дата рождения' },
  { value: 'text', label: 'Текст' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Дата' },
  { value: 'number', label: 'Число' },
  { value: 'photo', label: 'Фотография' },
];

const CardIssueForm = ({ formFields, onFieldChange, onAddField, onRemoveField }) => {
  const hasUniqueField = formFields?.some(
    (field) => (field.type === 'phone' || field.type === 'email') && field.unique,
  );
  const handleTypeChange = (index, value) => {
    const label = fieldOptions.find((opt) => opt.value === value)?.label || '';
    onFieldChange(index, 'type', value);
    onFieldChange(index, 'name', label);
  };

  return (
    <div className="card-form-container">
      {!hasUniqueField && (
        <div className="card-form-warning">
          Форма должна включать как минимум одно уникальное поле Телефон или Email
        </div>
      )}

      <div className="card-form-header">
        <span>Тип поля</span>
        <span>Наименование</span>
        <span>Обязательное</span>
        <span>Уникальное</span>
      </div>

      {formFields?.map((field, index) => (
        <div key={index} className="card-form-row">
          <CustomSelect
            value={field.type}
            onChange={(value) => handleTypeChange(index, value)}
            options={fieldOptions}
          />

          <input
            type="text"
            className="custom-input"
            value={field.name}
            onChange={(e) => onFieldChange(index, 'name', e.target.value)}
            placeholder="Введите наименование"
          />

          <ToggleSwitch
            checked={field.required}
            onChange={(e) => onFieldChange(index, 'required', e.target.checked)}
          />

          <ToggleSwitch
            checked={field.unique}
            onChange={(e) => onFieldChange(index, 'unique', e.target.checked)}
          />

          <button
            className="card-form-delete-btn"
            onClick={() => onRemoveField(index)}
            aria-label="Удалить поле"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      <button
        className="card-form-add-btn"
        onClick={() =>
          onAddField({
            type: 'text',
            name: 'Текст',
            required: false,
            unique: false,
          })
        }
        disabled={formFields?.length > 6}
      >
        Добавить поле
      </button>
    </div>
  );
};

export default CardIssueForm;
