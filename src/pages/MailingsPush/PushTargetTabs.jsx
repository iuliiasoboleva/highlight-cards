import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import { PushSegmentControls, PushTabs, PushToggleButtons, ToggleButton } from './styles';

const DISCRETE_SEGMENTS = [
  'need-attention',
  'loyal-regulars',
  'champions',
  'at-risk',
  'borderline',
  'growing',
  'no-birthday',
];

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

  const isDiscreteSegment = DISCRETE_SEGMENTS.includes(segment);
  const numericDisabled = isDiscreteSegment;

  useEffect(() => {
    onTabChange?.(selectedTab);

    if (selectedTab === 'segment') {
      const filtered = clients.filter((client) => {
        if (
          [
            'need-attention',
            'loyal-regulars',
            'champions',
            'at-risk',
            'borderline',
            'growing',
          ].includes(segment)
        ) {
          const seg = (client.rfmSegment || client.segment || '').toString().trim().toLowerCase();
          return seg === segment;
        }

        if (segment === 'no-birthday') {
          return client.birthdate == null;
        }

        const numericValue = Number(filterInput);
        const value =
          segment === 'current-quantity'
            ? Number(client.currentCardUsageCount ?? 0)
            : Number(client.stampQuantity ?? 0);

        if (Number.isNaN(numericValue)) return false;

        if (symbol === 'equal') return value === numericValue;
        if (symbol === 'more') return value > numericValue;
        if (symbol === 'less') return value < numericValue;
        return false;
      });

      onFilteredCountChange?.(filtered.length);
    } else {
      onFilteredCountChange?.(clients.length);
    }
  }, [selectedTab, segment, symbol, filterInput, clients, onTabChange, onFilteredCountChange]);

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

          <CustomSelect
            value={symbol}
            onChange={setSymbol}
            options={symbolsOptions}
            disabled={numericDisabled}
          />
          <CustomInput
            type="number"
            placeholder="0"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            disabled={numericDisabled}
          />
        </PushSegmentControls>
      )}
    </PushTabs>
  );
};

export default PushTargetTabs;
