import React, { useMemo, useState } from 'react';

import FilterPanel from './FilterPanel';
import TableToolbar from './TableToolbar';
import {
  ClientCardTag,
  CustomTable,
  DashboardTags,
  NoDataRow,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableWrapper,
} from './styles';

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
    <TableWrapper>
      <FilterPanel onFiltersChange={setActiveTags} />

      <TableToolbar
        onSearchChange={setSearch}
        onAction={(action) => {
          if (action === 'add') onShowModal?.(true);
        }}
      />

      <CustomTable>
        <THead>
          <TR>
            {columns.map((col, i) => (
              <TH key={i}>{col.title}</TH>
            ))}
          </TR>
        </THead>

        <TBody>
          {filteredRows.length === 0 ? (
            <TR>
              <NoDataRow colSpan={columns.length}>Нет данных</NoDataRow>
            </TR>
          ) : (
            filteredRows.map((row, rowIndex) => (
              <TR
                key={rowIndex}
                $clickable={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col, colIndex) => (
                  <TD key={colIndex}>
                    <DashboardTags>
                      {col.render
                        ? col.render(row)
                        : col.key === 'segment' && Array.isArray(row[col.key])
                          ? row[col.key].map((val, idx) => (
                              <ClientCardTag key={idx}>{val}</ClientCardTag>
                            ))
                          : row[col.key]}
                    </DashboardTags>
                  </TD>
                ))}
              </TR>
            ))
          )}
        </TBody>
      </CustomTable>
    </TableWrapper>
  );
};

export default FilterableTable;
