import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CustomSelect from '../../components/CustomSelect';

const PushTargetTabs = ({ onTabChange, onFilteredCountChange }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [segment, setSegment] = useState('current-quantity');
  const [symbol, setSymbol] = useState('equal');
  const [filterInput, setFilterInput] = useState('');

  const segmentOptions = [
    { label: 'Текущее количество использований', value: 'current-quantity' },
    { label: 'Количество штампов', value: 'stamp-quantity' },
    { label: 'День рождения не указан', value: 'no-birthday' },
  ];

  const symbolsOptions = [
    { label: '=', value: 'equal' },
    { label: '>', value: 'more' },
    { label: '<', value: 'less' },
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
    <div className="push-tabs">
      <div className="push-toggle-buttons">
        <button
          className={`btn ${selectedTab === 'all' ? 'btn-dark' : 'btn-light'}`}
          onClick={() => setSelectedTab('all')}
        >
          Всем клиентам
        </button>
        <button
          className={`btn ${selectedTab === 'segment' ? 'btn-dark' : 'btn-light'}`}
          onClick={() => setSelectedTab('segment')}
        >
          Выбранному сегменту
        </button>
      </div>

      {selectedTab === 'segment' && (
        <div className="push-segment-controls">
          <CustomSelect
            value={segment}
            onChange={setSegment}
            options={segmentOptions}
            className="push-segment-select"
          />
          {segment !== 'no-birthday' && (
            <>
              <CustomSelect
                value={symbol}
                onChange={setSymbol}
                options={symbolsOptions}
                className="push-segment-select"
              />
              <input
                className="push-input"
                type="number"
                placeholder="0"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PushTargetTabs;
