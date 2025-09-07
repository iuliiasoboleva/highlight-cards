import React, { useState } from 'react';

import { X } from 'lucide-react';

import {
  FPContainer,
  FPMainBtn,
  FPRemoveBtn,
  FPSelected,
  FPSelectedTag,
  FPSubfilters,
  FPTagBtn,
  FPTopButtons,
} from './styles';

const FILTER_GROUPS = {
  Лояльность: [0, 1, 2, 3, 4, 5],
  'RFM-сегменты': ['Новые', 'RFM - Спящие'],
  Коммуникация: ['День рождения сегодня', 'День рождения в ближайшие 30 дней'],
  Устройство: ['Apple Wallet', 'Google Pay', 'PWA'],
  UTM: ['qr', 'push', 'ads'],
  Сегмент: ['Установленные карты', 'Держатели Apple Wallet'],
};

const FilterPanel = ({ onFiltersChange }) => {
  const [openedGroup, setOpenedGroup] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (group, label) => {
    const exists = selectedTags.some((tag) => tag.group === group && tag.label === label);
    const newTags = exists
      ? selectedTags.filter((tag) => !(tag.group === group && tag.label === label))
      : [...selectedTags, { group, label }];
    setSelectedTags(newTags);
    onFiltersChange?.(newTags);
  };

  const removeTag = (group, label) => {
    const newTags = selectedTags.filter((tag) => !(tag.group === group && tag.label === label));
    setSelectedTags(newTags);
    onFiltersChange?.(newTags);
  };

  return (
    <FPContainer>
      <FPTopButtons>
        {Object.keys(FILTER_GROUPS).map((group) => (
          <FPMainBtn
            key={group}
            $active={openedGroup === group}
            onClick={() => setOpenedGroup(openedGroup === group ? null : group)}
          >
            {group}
          </FPMainBtn>
        ))}
      </FPTopButtons>

      {openedGroup && (
        <FPSubfilters>
          {FILTER_GROUPS[openedGroup].map((label) => {
            const isActive = selectedTags.some(
              (tag) => tag.group === openedGroup && tag.label === label,
            );
            return (
              <FPTagBtn
                key={label}
                $active={isActive}
                onClick={() => toggleTag(openedGroup, label)}
              >
                {label}
              </FPTagBtn>
            );
          })}
        </FPSubfilters>
      )}

      {!!selectedTags.length && (
        <FPSelected>
          {selectedTags.map((tag) => (
            <FPSelectedTag key={tag.group + tag.label}>
              {tag.label}
              <FPRemoveBtn onClick={() => removeTag(tag.group, tag.label)} aria-label="Удалить">
                <X size={12} />
              </FPRemoveBtn>
            </FPSelectedTag>
          ))}
        </FPSelected>
      )}
    </FPContainer>
  );
};

export default FilterPanel;
