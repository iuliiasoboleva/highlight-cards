import React, { useCallback } from 'react';

import CustomCheckbox from '../../customs/CustomCheckbox';
import { EmptyText, ListBox, Row } from './styles';

const BranchCheckboxList = ({
  items = [],
  selected = [],
  onChange,
  getId = (i) => i.id,
  getLabel = (i) => i.name ?? String(i.id),
  emptyText = 'Нет доступных элементов.',
  maxHeight = 180,
  gap = 4,
  onTouch,
  className,
}) => {
  const toggle = useCallback(
    (id, checked) => {
      onTouch?.();
      if (checked) {
        onChange?.([...selected, id]);
      } else {
        onChange?.(selected.filter((x) => x !== id));
      }
    },
    [onChange, onTouch, selected],
  );

  if (!items.length) {
    return (
      <ListBox $maxHeight={maxHeight} className={className}>
        <EmptyText>{emptyText}</EmptyText>
      </ListBox>
    );
  }

  return (
    <ListBox $maxHeight={maxHeight} className={className}>
      {items.map((item) => {
        const id = getId(item);
        const label = getLabel(item);
        const isChecked = selected.includes(id);
        return (
          <Row key={id} $gap={gap}>
            <CustomCheckbox checked={isChecked} onChange={(e) => toggle(id, e.target.checked)} />
            {label}
          </Row>
        );
      })}
    </ListBox>
  );
};

export default BranchCheckboxList;
