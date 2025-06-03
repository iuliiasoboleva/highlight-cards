import React from 'react';

import CustomTable from '../../components/CustomTable';
import { mailingsHeaders, mockMailings } from '../../mocks/mockMailings';

import './styles.css';

const cards = [
  { value: '0', label: 'Клиентов в базе' },
  { value: 'Бесплатно!', label: 'Push и Web-push', className: 'highlight' },
  { value: 'Скоро', label: 'Баланс SMS', className: 'gray small' },
  { value: 'Скоро', label: 'Баланс Email', className: 'gray small' },
];

const MailingsInfo = () => {
  const columns = mailingsHeaders.map((header) => ({
    key: header.key,
    title: header.label,
    className: 'text-left',
    cellClassName: 'text-left',
  }));

  const statusColumnIndex = columns.findIndex((col) => col.key === 'status');

  if (statusColumnIndex !== -1) {
    columns[statusColumnIndex].render = (row) => {
      let statusClass = '';
      switch (row.status) {
        case 'Запланирована':
          statusClass = 'status-planned';
          break;
        case 'Отправлена':
          statusClass = 'status-sent';
          break;
        case 'Черновик':
          statusClass = 'status-draft';
          break;
        case 'Ошибка':
          statusClass = 'status-error';
          break;
        default:
          statusClass = '';
      }
      return <span className={`status-badge ${statusClass}`}>{row.status}</span>;
    };
    columns[statusColumnIndex].className = 'text-center';
    columns[statusColumnIndex].cellClassName = 'text-center';
  }

  return (
    <div className="mailings-container">
      <h2>Рассылки</h2>
      <p className="page-subtitle">
        Здесь вы управляете своими рассылками: создавайте, планируйте, отправляйте Push клиентам для
        повышения лояльности.
      </p>
      <div className="stats-cards">
        {cards.map((card, index) => (
          <div className="mailing-card" key={index}>
            <div className={`value ${card.className || ''}`}>{card.value}</div>
            <div className={`label ${card.className?.includes('small') ? 'small' : ''}`}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <CustomTable columns={columns} rows={mockMailings} />
      </div>
    </div>
  );
};

export default MailingsInfo;
