import React, { useMemo, useState } from 'react';

import FilterPanel from './FilterPanel';
import TableToolbar from './TableToolbar';

import './styles.css';

const FilterableTable = ({ columns, rows, onRowClick, onShowModal }) => {
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState([]);

  const filteredRows = useMemo(() => {
    const groupedTags = activeTags.reduce((acc, tag) => {
      if (!acc[tag.group]) acc[tag.group] = [];
      acc[tag.group].push(tag.label);
      return acc;
    }, {});

    return rows.filter((row) => {
      const matchesSearch = search
        ? Object.values(row).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
        : true;

      const matchesFilters = Object.entries(groupedTags).every(([group, values]) => {
        const groupToFieldMap = {
          Лояльность: 'loyalty',
          'RFM-сегменты': 'segment',
          Коммуникация: 'segment',
          Устройство: 'device',
          UTM: 'utm',
          Сегмент: 'segment',
        };

        const field = groupToFieldMap[group];
        const rowValue = row[field];

        if (Array.isArray(rowValue)) {
          return rowValue.some((val) => values.includes(val));
        }

        return values.includes(rowValue);
      });

      return matchesSearch && matchesFilters;
    });
  }, [rows, search, activeTags]);

  return (
    <div className="table-wrapper">
      <FilterPanel onFiltersChange={setActiveTags} />
      <TableToolbar
        onSearchChange={(value) => setSearch(value)}
        onAction={(action) => {
          if (action === 'add') onShowModal(true);
        }}
      />
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="no-data-row">
                Нет данных
              </td>
            </tr>
          ) : (
            filteredRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={onRowClick ? 'clickable-row' : ''}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    <div className="dashboard-tags">
                      {col.render
                        ? col.render(row)
                        : col.key === 'segment' && Array.isArray(row[col.key])
                          ? row[col.key].map((val, idx) => (
                              <div key={idx} className="client-card-tag">
                                {val}
                              </div>
                            ))
                          : row[col.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilterableTable;
