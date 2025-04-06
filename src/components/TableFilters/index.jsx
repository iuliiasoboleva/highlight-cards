import React, { useState } from 'react';

import PropTypes from 'prop-types';

import './styles.css';

const TableFilters = ({ headers, onFilterChange }) => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters-row">
      {headers.map((header) => (
        <div key={header.key} className="filter-cell">
          <input
            type="text"
            placeholder={`Фильтр ${header.label}`}
            value={filters[header.key] || ''}
            onChange={(e) => handleFilterChange(header.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

TableFilters.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TableFilters;
