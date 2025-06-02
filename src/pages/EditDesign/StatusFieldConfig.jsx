import React from 'react';
import { useDispatch } from 'react-redux';

import CustomSelect from '../../components/CustomSelect';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { statusConfig } from '../../utils/statusConfig';

import './styles.css';

const commonFieldOptions = [
  { value: 'name', label: 'Имя' },
  { value: 'surname', label: 'Фамилия' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
  { value: 'birthday', label: 'Дата рождения' },
];

const systemTypes = ['balanceMoney', 'credits', 'balance', 'expirationDate'];

const StatusFieldConfig = ({ statusType, fields }) => {
  const dispatch = useDispatch();

  const statusOptions = (statusConfig[statusType] || [])
    .filter((item) => !systemTypes.includes(item.valueKey))
    .map((item) => ({
      value: item.valueKey,
      label: item.label,
    }));

  const fieldOptions = [
    { value: '', label: 'Поле не используется' },
    ...statusOptions,
    ...commonFieldOptions,
  ];

  const editableFields = fields
    .map((field, originalIndex) => ({ ...field, originalIndex }))
    .filter((field) => !systemTypes.includes(field.type));

  const handleTypeChange = (editableIndex, value) => {
    const targetIndex = editableFields[editableIndex].originalIndex;

    const updatedFields = fields.map((field, i) =>
      i === targetIndex
        ? value
          ? {
              ...field,
              type: value,
              name: fieldOptions.find((opt) => opt.value === value)?.label || '',
            }
          : { ...field, type: '', name: '' }
        : field,
    );

    dispatch(updateCurrentCardField({ path: 'fieldsName', value: updatedFields }));
  };

  const handleNameChange = (editableIndex, value) => {
    const targetIndex = editableFields[editableIndex].originalIndex;

    const updatedFields = fields.map((field, i) =>
      i === targetIndex ? { ...field, name: value } : field,
    );

    dispatch(updateCurrentCardField({ path: 'fieldsName', value: updatedFields }));
  };

  return (
    <div className="card-form-container">
      <div className="card-fields-header">
        <span>Поле</span>
        <span>Название для отображения</span>
      </div>

      {editableFields.map((field, index) => (
        <div key={index} className="card-fields-row">
          <CustomSelect
            value={field.type}
            onChange={(value) => handleTypeChange(index, value)}
            options={fieldOptions}
          />

          <input
            type="text"
            className="custom-input"
            value={field.name}
            onChange={(e) => handleNameChange(index, e.target.value)}
            placeholder=""
            disabled={!field.type}
          />
        </div>
      ))}
    </div>
  );
};

export default StatusFieldConfig;
