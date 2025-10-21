import React from 'react';

import { Trash2 } from 'lucide-react';

import CustomInput from '../../customs/CustomInput';
import {
  AddBtn,
  Container,
  DeleteCell,
  HeaderLabel,
  HeaderLabelTrash,
  SpendingLabel,
  StatusIssueHeader,
  StatusIssueRow,
  StatusNameCell,
  StatusRequiredCell,
  StatusTypeCell,
} from './styles';

const CardStatusForm = ({ statusFields, onFieldChange, onAddField, onRemoveField }) => {
  return (
    <Container>
      <StatusIssueHeader>
        <HeaderLabel>Название статуса</HeaderLabel>
        <HeaderLabel>Пороговая сумма для получения статуса</HeaderLabel>
        <HeaderLabel>Процент скидки</HeaderLabel>
        <HeaderLabelTrash />
      </StatusIssueHeader>

      {statusFields?.map((field, index) => (
        <StatusIssueRow key={index}>
          <StatusTypeCell>
            <CustomInput
              type="text"
              value={field.name ?? ''}
              onChange={(e) => onFieldChange(index, 'name', e.target.value)}
              placeholder="Название статуса"
            />
          </StatusTypeCell>

          <StatusNameCell>
            <SpendingLabel>
              <CustomInput
                type="number"
                value={field.cost ?? ''}
                onChange={(e) => {
                  let raw = e.target.value;
                  // Убираем лидирующие нули
                  if (raw.length > 1 && raw.startsWith('0')) {
                    raw = raw.replace(/^0+/, '') || '0';
                    e.target.value = raw;
                  }
                  onFieldChange(index, 'cost', raw);
                }}
                placeholder="₽"
              />
              <span>руб.</span>
            </SpendingLabel>
          </StatusNameCell>

          <StatusRequiredCell>
            <SpendingLabel>
              <CustomInput
                type="number"
                value={field.percent ?? ''}
                onChange={(e) => {
                  let raw = e.target.value;
                  // Убираем лидирующие нули
                  if (raw.length > 1 && raw.startsWith('0')) {
                    raw = raw.replace(/^0+/, '') || '0';
                    e.target.value = raw;
                  }
                  onFieldChange(index, 'percent', raw);
                }}
                placeholder="%"
              />
              <span>%</span>
            </SpendingLabel>
          </StatusRequiredCell>

          <DeleteCell onClick={() => onRemoveField(index)} aria-label="Удалить статус">
            <Trash2 size={20} />
          </DeleteCell>
        </StatusIssueRow>
      ))}

      <AddBtn onClick={onAddField} disabled={statusFields?.length > 6}>
        Добавить статус
      </AddBtn>
    </Container>
  );
};

export default CardStatusForm;
