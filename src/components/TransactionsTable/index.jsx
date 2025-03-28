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

// 👇 Пример моков
const mockData = [
  {
    "ИМЯ ПОЛЬЗОВАТЕЛЯ": "Алексей Иванов",
    "ДАТА И ВРЕМЯ": "2024-06-26 14:32",
    "ТЕЛЕФОН": "+7 912 345 67 89",
    "УСТРОЙСТВО": "iPhone 13",
    "ШАБЛОН": "Шаблон 1",
    "СОБЫТИЕ": "Покупка",
    "КОЛИЧЕСТВО": "1",
    "БАЛАНС": "100 ₽",
  },
  {
    "ИМЯ ПОЛЬЗОВАТЕЛЯ": "Мария Смирнова",
    "ДАТА И ВРЕМЯ": "2024-06-25 09:15",
    "ТЕЛЕФОН": "+7 926 888 00 11",
    "УСТРОЙСТВО": "Samsung Galaxy S22",
    "ШАБЛОН": "Шаблон 2",
    "СОБЫТИЕ": "Получение бонуса",
    "КОЛИЧЕСТВО": "2",
    "БАЛАНС": "150 ₽",
  },
];

const TransactionsTable = () => {
  return (
    <div className="transactions-wrapper">
      <h2 className="transactions-title">Последние транзакции по карте</h2>

      <div className="search-bar">
        <input type="text" placeholder="Введите ваш запрос" className="search-input" />
        <button className="search-button">🔍</button>
      </div>

      {mockData.length === 0 ? (
        <div className="empty-message">Показано 0 из 0 событий по карте</div>
      ) : (
        <div className="transactions-list">
          {mockData.map((item, idx) => (
            <div className="transaction-card" key={idx}>
              {headers.map((header, i) => (
                <div className="transaction-row" key={i}>
                  <div className="label">{header}</div>
                  <div className="value">{item[header]}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

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
