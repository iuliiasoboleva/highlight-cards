import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import { PushSegmentControls, PushTabs, PushToggleButtons, ToggleButton } from './styles';

const PushTargetTabs = ({ onTabChange, onFilteredCountChange }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [segment, setSegment] = useState('need-attention');
  const [symbol, setSymbol] = useState('equal');
  const [filterInput, setFilterInput] = useState('');

  const segmentOptions = [
    { label: 'Требуют внимания', value: 'need-attention' },
    { label: 'Лояльные - постоянные', value: 'loyal-regulars' },
    { label: 'Чемпионы', value: 'champions' },
    { label: 'В зоне риска', value: 'at-risk' },
    { label: 'Средние (на грани)', value: 'borderline' },
    { label: 'Растущие', value: 'growing' },
    { label: 'Текущее количество использований', value: 'current-quantity' },
    { label: 'Количество штампов', value: 'stamp-quantity' },
    { label: 'День рождения не указан', value: 'no-birthday' },
  ];

  const symbolsOptions = [
    { label: 'Равно', value: 'equal' },
    { label: 'Больше', value: 'more' },
    { label: 'Меньше', value: 'less' },
  ];

  const clients = useSelector((state) => state.clients.list || []);

  useEffect(() => {
    onTabChange(selectedTab);

    if (selectedTab === 'segment') {
      const numericValue = Number(filterInput);

      const filtered = clients.filter((client) => {
        if (segment === 'no-birthday') {
          return client.birthdate === null;
        }

        const value =
          segment === 'current-quantity' ? client.currentCardUsageCount : client.stampQuantity;
        if (symbol === 'equal') return value === numericValue;
        if (symbol === 'more') return value > numericValue;
        if (symbol === 'less') return value < numericValue;
        return false;
      });

      onFilteredCountChange(filtered.length);
    } else {
      onFilteredCountChange(clients.length);
    }
  }, [selectedTab, segment, symbol, filterInput, onTabChange, clients, onFilteredCountChange]);

  return (
    <PushTabs>
      <PushToggleButtons>
        <ToggleButton
          type="button"
          $active={selectedTab === 'all'}
          onClick={() => setSelectedTab('all')}
        >
          Всем клиентам
        </ToggleButton>

        <ToggleButton
          type="button"
          $active={selectedTab === 'segment'}
          onClick={() => setSelectedTab('segment')}
        >
          Выбранному сегменту
        </ToggleButton>
      </PushToggleButtons>

      {selectedTab === 'segment' && (
        <PushSegmentControls>
          <CustomSelect value={segment} onChange={setSegment} options={segmentOptions} />
          {segment !== 'no-birthday' && (
            <>
              <CustomSelect value={symbol} onChange={setSymbol} options={symbolsOptions} />
              <CustomInput
                type="number"
                placeholder="0"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
              />
            </>
          )}
        </PushSegmentControls>
      )}
    </PushTabs>
  );
};

export default PushTargetTabs;
