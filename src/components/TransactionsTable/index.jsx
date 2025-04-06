import React, { useState } from 'react';

import TableFilters from '../TableFilters';

import './styles.css';

const TransactionsTable = ({
  title,
  headers,
  data,
  showFilters = false,
  pageSizes = [10, 20, 50, 100],
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(10);

  const handleFilter = (filters) => {
    const filtered = data.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        String(item[key]).toLowerCase().includes(value.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
  };

  return (
    <div className="transactions-wrapper">
      <h2 className="transactions-title">{title}</h2>

      <div className="search-bar">
        <input type="text" placeholder="Введите ваш запрос" className="search-input" />
        <button className="search-button">🔍</button>
      </div>

      {showFilters && <TableFilters headers={headers} onFilterChange={handleFilter} />}

      {filteredData.length === 0 ? (
        <div className="empty-message">Показано 0 из 0 пользователей</div>
      ) : (
        <div className="scroll-root">
          <div className="scroll-viewport">
            <div className="scroll-container">
              <table className="force-scroll-table">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header.key}>{header.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(0, pageSize).map((row) => (
                    <tr key={row.id}>
                      {headers.map((header) => (
                        <td key={`${row.id}-${header.key}`}>{row[header.key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="table-footer">
        <span>Показать по:</span>
        {pageSizes.map((num) => (
          <button
            key={num}
            className={`page-size ${num === pageSize ? 'active' : ''}`}
            onClick={() => setPageSize(num)}
          >
            {num}
          </button>
        ))}
        <div className="showing-info">Показано {filteredData.length} пользователей</div>
      </div>
    </div>
  );
};

export default TransactionsTable;
