import React from 'react';

import './styles.css';

const CustomTable = ({ columns, rows }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className || ''}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.cellClassName || ''}>
                  {Array.isArray(row[column.key])
                    ? row[column.key].join(', ')
                    : column.render
                      ? column.render(row)
                      : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
