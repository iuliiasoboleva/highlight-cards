import React from 'react';

import { Trash2 } from 'lucide-react';

import CustomInput from '../../customs/CustomInput';
import {
  AddBtn,
  Container,
  DeleteCell,
  HeaderLabel,
  HeaderLabelTrash,
  StatusIssueHeader,
  StatusIssueRow,
  StatusNameCell,
  StatusRequiredCell,
  StatusTypeCell,
  SpendingLabel,
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
                onChange={(e) => onFieldChange(index, 'cost', e.target.value)}
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
                onChange={(e) => onFieldChange(index, 'percent', e.target.value)}
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
