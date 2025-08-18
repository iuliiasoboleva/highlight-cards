import React, { useMemo } from 'react';

import CustomTable from '../../../components/CustomTable';
import { ManagerEditButton, TableName, TablesGroup } from '../styles';

/**
 * Презентационный блок таблиц.
 * Здесь же собираем columns из headers и текущих данных.
 */
const TablesBlock = ({
  // данные
  managers,
  locations,
  networks,
  // заголовки-описатели колонок
  managersHeaders,
  locationsHeaders,
  // коллбеки на действия
  onEditManager,
  onEditLocation,
  onEditNetwork,
}) => {
  // ---- COLS: Managers
  const managersColumns = useMemo(
    () => [
      ...managersHeaders.map((header) => {
        if (header.key === 'shift') {
          return {
            key: header.key,
            title: header.label,
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => {
              if (row.shift) return `${row.shift.startShift || ''} - ${row.shift.endShift || ''}`;
              return `${row.start_shift || ''} - ${row.end_shift || ''}`;
            },
          };
        }
        return {
          key: header.key,
          title: header.label,
          className: 'text-center',
          cellClassName: 'text-center',
        };
      }),
      {
        key: 'actions',
        title: 'Действия',
        className: 'text-center',
        cellClassName: 'text-center',
        render: (row) => (
          <ManagerEditButton onClick={() => onEditManager(row)} title="Редактировать">
            ✏️
          </ManagerEditButton>
        ),
      },
    ],
    [managersHeaders, onEditManager],
  );

  // ---- COLS: Locations
  const locationColumns = useMemo(
    () => [
      ...locationsHeaders.map((header) => {
        if (header.key === 'network') {
          return {
            key: 'network',
            title: 'Сеть',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => {
              const net = networks.find((n) => n.id === row.network_id);
              return net ? net.name : '-';
            },
          };
        }
        if (['clientsCount', 'cardsIssued', 'pointsAccumulated'].includes(header.key)) {
          return {
            key: header.key,
            title: header.label,
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => row[header.key] ?? 0,
          };
        }
        return {
          key: header.key,
          title: header.label,
          className: 'text-center',
          cellClassName: 'text-center',
        };
      }),
      {
        key: 'actions',
        title: 'Действия',
        className: 'text-center',
        cellClassName: 'text-center',
        render: (row) => (
          <ManagerEditButton onClick={() => onEditLocation(row)} title="Редактировать">
            ✏️
          </ManagerEditButton>
        ),
      },
    ],
    [locationsHeaders, networks, onEditLocation],
  );

  // ---- COLS: Networks
  const networkColumns = useMemo(
    () => [
      { key: 'name', title: 'Название', className: 'text-left', cellClassName: 'text-left' },
      { key: 'description', title: 'Описание', className: 'text-left', cellClassName: 'text-left' },
      {
        key: 'actions',
        title: 'Действия',
        className: 'text-center',
        cellClassName: 'text-center',
        render: (row) => (
          <ManagerEditButton onClick={() => onEditNetwork(row)} title="Редактировать">
            ✏️
          </ManagerEditButton>
        ),
      },
    ],
    [onEditNetwork],
  );

  return (
    <TablesGroup>
      <TableName>Информация о сотрудниках</TableName>
      {managers.length ? (
        <CustomTable columns={managersColumns} rows={managers} />
      ) : (
        <CustomTable
          columns={managersColumns.filter((c) => c.key !== 'actions')}
          rows={[]}
          emptyText="Здесь будет информация о сотрудниках"
        />
      )}

      <TableName>Информация о точках продаж</TableName>
      {locations.length ? (
        <CustomTable columns={locationColumns} rows={locations} />
      ) : (
        <CustomTable
          columns={locationColumns.filter((c) => c.key !== 'actions')}
          rows={[]}
          emptyText="Здесь будет информация о точках продаж"
        />
      )}

      <TableName>Сети точек</TableName>
      {networks.length ? (
        <CustomTable columns={networkColumns} rows={networks} />
      ) : (
        <CustomTable
          columns={networkColumns.filter((c) => c.key !== 'actions')}
          rows={[]}
          emptyText="Здесь будет информация о сетях"
        />
      )}
    </TablesGroup>
  );
};

export default TablesBlock;
