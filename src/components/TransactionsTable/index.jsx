import React from "react";
import "./styles.css";

const headers = [
  "ИМЯ ПОЛЬЗОВАТЕЛЯ",
  "ДАТА И ВРЕМЯ",
  "ТЕЛЕФОН",
  "УСТРОЙСТВО",
  "ШАБЛОН",
  "СОБЫТИЕ",
  "КОЛИЧЕСТВО",
  "БАЛАНС",
];

const TransactionsTable = () => {
  return (
    <div className="transactions-wrapper">
      <h2 className="transactions-title">Последние транзакции по карте</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Введите ваш запрос"
          className="search-input"
        />
        <button className="search-button">🔍</button>
      </div>

      <div className="table-scroll">
        <table className="transactions-table">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>
                  {header}
                  <span className="sort-arrow">▼</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={headers.length} className="empty-message">
                Показано 0 из 0 событий по карте
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>Показать по:</span>
        {[10, 20, 50, 100].map((num) => (
          <button key={num} className={`page-size ${num === 10 ? "active" : ""}`}>
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionsTable;
