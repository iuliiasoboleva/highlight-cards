import React, { useEffect, useMemo, useState } from 'react';

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
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  PaginationSelect,
} from './styles';

const FilterableTable = ({ columns, rows, onRowClick, onShowModal }) => {
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTags, rowsPerPage]);

  const sortedAndFilteredRows = useMemo(() => {
    const groupedTags = activeTags.reduce((acc, tag) => {
      if (!acc[tag.group]) acc[tag.group] = [];
      acc[tag.group].push(tag.label);
      return acc;
    }, {});

    const filtered = rows.filter((row) => {
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

    return filtered.sort((a, b) => {
      const parseDate = (dateStr) => {
        if (!dateStr) return 0;
        const parts = dateStr.split(' ');
        if (parts.length === 2) {
          const [datePart, timePart] = parts;
          const [day, month, year] = datePart.split('/');
          const [hours, minutes] = timePart.split(':');
          return new Date(year, month - 1, day, hours, minutes).getTime();
        }
        return 0;
      };
      
      const dateA = parseDate(a.createdAt);
      const dateB = parseDate(b.createdAt);
      return dateB - dateA;
    });
  }, [rows, search, activeTags]);

  const totalPages = Math.ceil(sortedAndFilteredRows.length / rowsPerPage);
  
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedAndFilteredRows.slice(startIndex, endIndex);
  }, [sortedAndFilteredRows, currentPage, rowsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
          {sortedAndFilteredRows.length === 0 ? (
            <TR>
              <NoDataRow colSpan={columns.length}>Нет данных</NoDataRow>
            </TR>
          ) : (
            paginatedRows.map((row, rowIndex) => (
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

      {sortedAndFilteredRows.length > 0 && (
        <PaginationContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Показывать:</span>
            <PaginationSelect value={rowsPerPage} onChange={handleRowsPerPageChange}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </PaginationSelect>
          </div>

          <PaginationInfo>
            Показано {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, sortedAndFilteredRows.length)} из{' '}
            {sortedAndFilteredRows.length}
          </PaginationInfo>

          <div style={{ display: 'flex', gap: '8px' }}>
            <PaginationButton
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              ««
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹
            </PaginationButton>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationButton
                    key={page}
                    onClick={() => handlePageChange(page)}
                    $active={currentPage === page}
                  >
                    {page}
                  </PaginationButton>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} style={{ padding: '8px 4px' }}>...</span>;
              }
              return null;
            })}

            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ›
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              »»
            </PaginationButton>
          </div>
        </PaginationContainer>
      )}
    </TableWrapper>
  );
};

export default FilterableTable;
