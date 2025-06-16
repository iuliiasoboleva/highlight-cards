import React, { useState } from 'react';

import { X } from 'lucide-react';

import './styles.css';

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
    onFiltersChange(newTags);
  };

  const removeTag = (group, label) => {
    const newTags = selectedTags.filter((tag) => !(tag.group === group && tag.label === label));
    setSelectedTags(newTags);
    onFiltersChange(newTags);
  };

  return (
    <div className="fp-container">
      <div className="fp-top-buttons">
        {Object.keys(FILTER_GROUPS).map((group) => (
          <button
            key={group}
            className={`fp-main-btn ${openedGroup === group ? 'active' : ''}`}
            onClick={() => setOpenedGroup(openedGroup === group ? null : group)}
          >
            {group}
          </button>
        ))}
      </div>

      {openedGroup && (
        <div className="fp-subfilters">
          {FILTER_GROUPS[openedGroup].map((label) => {
            const isActive = selectedTags.some(
              (tag) => tag.group === openedGroup && tag.label === label,
            );
            return (
              <button
                key={label}
                className={`fp-tag-btn ${isActive ? 'active' : ''}`}
                onClick={() => toggleTag(openedGroup, label)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="fp-selected">
          {selectedTags.map((tag) => (
            <div key={tag.group + tag.label} className="fp-selected-tag">
              {tag.label}
              <button onClick={() => removeTag(tag.group, tag.label)} className="fp-remove-btn">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
