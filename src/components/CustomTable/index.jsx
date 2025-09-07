import React from 'react';

import {
  Container,
  DashboardTags,
  NoDataTd,
  // на будущее, если нужно группировать теги внутри ячеек
  StatusBadge,
  Table,
  Td,
  Th,
  Thead,
  Trow,
} from './styles';

const getAlignFromClass = (cls = '') => {
  if (cls.includes('text-right')) return 'right';
  if (cls.includes('text-left')) return 'left';
  if (cls.includes('text-center')) return 'center';
  return 'center';
};

const isFeatureCell = (cls = '') => cls.includes('feature-cell');

const getStatusVariant = (cls = '') => {
  if (cls.includes('status-error')) return 'error';
  if (cls.includes('status-planned')) return 'planned';
  if (cls.includes('status-sent')) return 'sent';
  if (cls.includes('status-draft')) return 'draft';
  if (cls.includes('success')) return 'success'; // "status-badge success"
  return null;
};

const CustomTable = ({
  columns,
  rows,
  onRowClick,
  emptyText = 'Здесь будут ваши транзакции по карте',
}) => {
  return (
    <Container>
      <Table>
        <Thead>
          <Trow>
            {columns.map((column, index) => (
              <Th
                key={index}
                $align={getAlignFromClass(column.className || '')}
                className={column.className || undefined}
              >
                {column.title}
              </Th>
            ))}
          </Trow>
        </Thead>

        <tbody>
          {rows.length === 0 ? (
            <Trow>
              <NoDataTd colSpan={columns.length}>{emptyText}</NoDataTd>
            </Trow>
          ) : (
            rows.map((row, rowIndex) => (
              <Trow
                key={rowIndex}
                $clickable={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => {
                  const cls = column.cellClassName || '';
                  const align = getAlignFromClass(cls);
                  const featured = isFeatureCell(cls);
                  const statusVariant = getStatusVariant(cls);

                  const rawContent = Array.isArray(row[column.key])
                    ? row[column.key].join(', ')
                    : column.render
                      ? column.render(row)
                      : row[column.key];

                  const content = statusVariant ? (
                    <StatusBadge $variant={statusVariant}>{rawContent}</StatusBadge>
                  ) : (
                    rawContent
                  );

                  return (
                    <Td
                      key={colIndex}
                      $align={align}
                      $featureCell={featured}
                      className={cls || undefined}
                    >
                      {content}
                    </Td>
                  );
                })}
              </Trow>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CustomTable;
