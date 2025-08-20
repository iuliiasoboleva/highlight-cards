import React from 'react';

import { Trash2 } from 'lucide-react';

import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import ToggleSwitch from '../../customs/CustomToggleSwitch';
import {
  AddBtn,
  Container,
  DeleteCell,
  HeaderLabel,
  HeaderLabelCenter,
  HeaderLabelTrash,
  IssueHeader,
  IssueRow,
  NameCell,
  NamePlaceholder,
  RequiredCell,
  RequiredLabel,
  TypeCell,
  Warning,
} from './styles';

const STANDARD_OPTIONS = [
  { value: 'name', label: 'Имя' },
  { value: 'surname', label: 'Фамилия' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
  { value: 'birthday', label: 'Дата рождения' },
];

const ALL_OPTIONS = [...STANDARD_OPTIONS, { value: 'custom', label: 'Кастомное поле' }];
const isUniqueType = (t) => t === 'phone' || t === 'email';

const CardIssueForm = ({ formFields, onFieldChange, onAddField, onRemoveField }) => {
  const hasUniqueField = formFields?.some((f) => isUniqueType(f.type) && f.unique);

  const handleTypeChange = (index, value) => {
    const std = STANDARD_OPTIONS.find((opt) => opt.value === value);
    onFieldChange(index, 'type', value);

    if (value === 'custom') {
      onFieldChange(index, 'name', formFields?.[index]?.name || 'Кастомное поле');
      onFieldChange(index, 'unique', false);
    } else if (std) {
      onFieldChange(index, 'name', std.label);
      onFieldChange(index, 'unique', isUniqueType(value));
    }
  };

  const filteredOptionsForRow = (index) => {
    const used = new Set(
      (formFields || [])
        .map((f, i) => (i === index ? null : f?.type))
        .filter((t) => t && t !== 'custom'),
    );
    return ALL_OPTIONS.filter((opt) => opt.value === 'custom' || !used.has(opt.value));
  };

  return (
    <Container>
      {!hasUniqueField && (
        <Warning>Форма должна включать как минимум одно уникальное поле Телефон или Email</Warning>
      )}

      <IssueHeader>
        <HeaderLabel>Тип поля</HeaderLabel>
        <HeaderLabel>Наименование</HeaderLabel>
        <HeaderLabelCenter>Обязательное</HeaderLabelCenter>
        <HeaderLabelTrash />
      </IssueHeader>

      {formFields?.map((field, index) => {
        const options = filteredOptionsForRow(index);
        const isCustom = field.type === 'custom';

        return (
          <IssueRow key={index}>
            <TypeCell>
              <CustomSelect
                value={field.type}
                onChange={(value) => handleTypeChange(index, value)}
                options={options}
              />
            </TypeCell>

            <NameCell>
              {isCustom ? (
                <CustomInput
                  type="text"
                  value={field.name || ''}
                  onChange={(e) => onFieldChange(index, 'name', e.target.value)}
                  placeholder="Кастомное поле"
                />
              ) : (
                <NamePlaceholder>—</NamePlaceholder>
              )}
            </NameCell>

            <RequiredCell>
              <RequiredLabel>Обязательное</RequiredLabel>
              <ToggleSwitch
                checked={!!field.required}
                onChange={(e) => onFieldChange(index, 'required', e.target.checked)}
              />
            </RequiredCell>

            <DeleteCell onClick={() => onRemoveField(index)} aria-label="Удалить поле">
              <Trash2 size={20} />
            </DeleteCell>
          </IssueRow>
        );
      })}

      <AddBtn
        onClick={() =>
          onAddField({
            type: 'custom',
            name: 'Кастомное поле',
            required: false,
            unique: false,
          })
        }
      >
        Добавить поле
      </AddBtn>
    </Container>
  );
};

export default CardIssueForm;
