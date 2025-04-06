import React from 'react';

import TransactionsTable from '../../components/TransactionsTable';
import { mailingsHeaders, mockMailings } from '../../mocks/mockMailings';

import './styles.css';

const cards = [
  { value: '0', label: 'Клиентов в базе' },
  { value: 'Бесплатно!', label: 'Push и Web-push', className: 'highlight' },
  { value: 'Нет данных', label: 'Баланс SMS', className: 'gray small' },
  { value: 'Нет данных', label: 'Баланс Email', className: 'gray small' },
];

const MailingsInfo = () => {
  return (
    <>
      <h2 className="page-title">Рассылки</h2>

      <div className="stats-cards">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <div className={`value ${card.className || ''}`}>{card.value}</div>
            <div className={`label ${card.className?.includes('small') ? 'small' : ''}`}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="alert">
        Для создания рассылок необходимо подключить провайдера SMS или Email в настройках.{' '}
        <a href="#">Подключить</a>
      </div>

      <div className="table-wrapper">
        <TransactionsTable title="" headers={mailingsHeaders} data={mockMailings} />
      </div>
    </>
  );
};

export default MailingsInfo;
