import React from 'react';

import { Trash2 } from 'lucide-react';

import CustomInput from '../../customs/CustomInput';
import { AddBtn, DeleteBtn, Header, Row, SpanHint } from './styles';

const CardStatusForm = ({ statusFields, onFieldChange, onAddField, onRemoveField }) => {
  return (
    <>
      <Header>
        <SpanHint>Название статуса</SpanHint>
        <SpanHint>Затраты для достижения</SpanHint>
        <SpanHint>Процент %</SpanHint>
      </Header>

      {statusFields?.map((field, index) => (
        <Row key={index}>
          <CustomInput
            type="text"
            value={field.name}
            onChange={(e) => onFieldChange(index, 'name', e.target.value)}
            placeholder="Название статуса"
          />
          <CustomInput
            type="number"
            value={field.cost}
            onChange={(e) => onFieldChange(index, 'cost', e.target.value)}
            placeholder="Затраты для достижения"
          />
          <CustomInput
            type="number"
            value={field.percent}
            onChange={(e) => onFieldChange(index, 'percent', e.target.value)}
            placeholder="Процент %"
          />
          <DeleteBtn onClick={() => onRemoveField(index)} aria-label="Удалить статус">
            <Trash2 size={20} />
          </DeleteBtn>
        </Row>
      ))}

      <AddBtn onClick={onAddField} disabled={statusFields?.length > 6}>
        Добавить статус
      </AddBtn>
    </>
  );
};

export default CardStatusForm;
