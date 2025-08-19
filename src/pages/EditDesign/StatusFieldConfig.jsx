import React from 'react';
import { useDispatch } from 'react-redux';

import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { statusConfig } from '../../utils/statusConfig';
import { CardFieldsHeader, CardFieldsRow, MobileLabel, Wrapper } from './styles';

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
    .map((item) => ({ value: item.valueKey, label: item.label }));

  const fieldOptions = [
    { value: '', label: 'Поле не используется' },
    ...statusOptions,
    ...commonFieldOptions,
  ];

  const editableFields = fields
    .map((field, originalIndex) => ({ ...field, originalIndex }))
    .filter((field) => !systemTypes.includes(field.type));

  const labelByValue = (v) => fieldOptions.find((o) => o.value === v)?.label || '';

  const handleTypeChange = (editableIndex, value) => {
    const targetIndex = editableFields[editableIndex].originalIndex;

    const updatedFields = fields.map((field, i) => {
      if (i !== targetIndex) return field;

      const prevType = field.type;
      const prevAuto = labelByValue(prevType);
      const nextAuto = labelByValue(value);

      const shouldAutoFill = !field.name || field.name === prevAuto;

      return value
        ? { ...field, type: value, name: shouldAutoFill ? nextAuto : field.name }
        : { ...field, type: '', name: '' };
    });

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
    <Wrapper>
      <CardFieldsHeader>
        <span>Поле</span>
        <span>Название для отображения</span>
      </CardFieldsHeader>

      {editableFields.map((field, index) => (
        <CardFieldsRow key={index}>
          <div>
            <MobileLabel>Поле</MobileLabel>
            <CustomSelect
              value={field.type}
              onChange={(value) => handleTypeChange(index, value)}
              options={fieldOptions}
            />
          </div>

          <div>
            <MobileLabel>Название для отображения</MobileLabel>
            <CustomInput
              type="text"
              value={field.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder=""
              disabled={!field.type}
              aria-label="Название для отображения"
            />
          </div>
        </CardFieldsRow>
      ))}
    </Wrapper>
  );
};

export default StatusFieldConfig;
