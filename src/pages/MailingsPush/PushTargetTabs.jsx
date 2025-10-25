import React, { useEffect, useState, useMemo, useRef } from 'react';
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

const PushTargetTabs = ({ selectedCardId, onTabChange, onFilteredCountChange }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [segment, setSegment] = useState('need-attention');
  const [symbol, setSymbol] = useState('equal');
  const [filterInput, setFilterInput] = useState('');

  const onTabChangeRef = useRef(onTabChange);
  const onFilteredCountChangeRef = useRef(onFilteredCountChange);

  useEffect(() => {
    onTabChangeRef.current = onTabChange;
    onFilteredCountChangeRef.current = onFilteredCountChange;
  }, [onTabChange, onFilteredCountChange]);

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

  // Фильтруем клиентов только тех, у кого есть выбранная карта
  const clientsWithSelectedCard = useMemo(() => {
    if (!selectedCardId) return [];
    
    return clients.filter((client) => {
      if (!client.cards || client.cards.length === 0) return false;
      
      return client.cards?.some((card) => 
        String(card.cardUuid) === String(selectedCardId) || String(card.cardId) === String(selectedCardId)
      );
    });
  }, [clients, selectedCardId]);

  const isDiscreteSegment = DISCRETE_SEGMENTS.includes(segment);
  const numericDisabled = isDiscreteSegment;

  const segmentLabel = useMemo(
    () => segmentOptions.find((o) => o.value === segment)?.label,
    [segment]
  );

  useEffect(() => {
    onTabChangeRef.current?.(selectedTab, {
      segment,
      symbol,
      filter: filterInput,
      segmentLabel,
    });
  }, [selectedTab, segment, symbol, filterInput, segmentLabel]);

  useEffect(() => {
    if (selectedTab === 'segment') {
      const filtered = clientsWithSelectedCard.filter((client) => {
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
          const clientSegment = client.rfmSegment || (client.segment && client.segment[0]) || '';
          return clientSegment === segment;
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

      onFilteredCountChangeRef.current?.(filtered.length);
    } else {
      onFilteredCountChangeRef.current?.(clientsWithSelectedCard.length);
    }
  }, [selectedTab, segment, symbol, filterInput, clientsWithSelectedCard]);

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
            onChange={(e) => {
              let raw = e.target.value;
              // Убираем лидирующие нули
              if (raw.length > 1 && raw.startsWith('0')) {
                raw = raw.replace(/^0+/, '') || '0';
                e.target.value = raw;
              }
              setFilterInput(raw);
            }}
            disabled={numericDisabled}
          />
        </PushSegmentControls>
      )}
    </PushTabs>
  );
};

export default PushTargetTabs;
