import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CustomTable from '../../components/CustomTable';
import { mockTransactions, transactionHeaders } from '../../mocks/mockTransactions';
import StatCard from './StatCard';

import './styles.css';

const ClientDetails = () => {
  const { id } = useParams();
  const client = useSelector((state) => state.clients.find((client) => String(client.id) === id));

  if (!client) {
    return <p>Клиент не найден</p>;
  }

  return (
    <div className="client-container">
      <h2>Профиль пользователя</h2>
      <div className="tariff-boxes">
        <div className="tariff-box tariff-box-left">
          <div className="avatar-circle">
            {client.name?.[0]?.toUpperCase()}
            {client.surname?.[0]?.toUpperCase()}
          </div>
          <div className="tariff-box-content">
            <div className="tariff-price">
              {client.name} {client.surname}
            </div>
            <div className="tariff-sub">Имя клиента</div>
          </div>
        </div>
        <div className="tariff-box tariff-box-right">
          <div className="tariff-box-content">
            <div className="tariff-price">{client.createdAt}</div>
            <div className="tariff-sub">Дата регистрации </div>
          </div>
        </div>
      </div>
      <p className="client-subtitle">Карты клиента</p>
      <div className="client-cards">
        {client.cards?.length > 0 ? (
          client.cards.map((card, index) => (
            <div className="client-card-tag" key={card.id || index}>
              {card.name}
            </div>
          ))
        ) : (
          <p className="no-cards">Нет привязанных карт</p>
        )}
      </div>
      <div className="stat-grid">
        <StatCard title="Штампов получено" value={client.totalStamps || 0} />
        <StatCard title="Наград начислено" value={client.rewardsGranted || 0} />
        <StatCard title="Наград получено" value={client.rewardsReceived || 0} />
        <StatCard title="Всего визитов" value={client.totalVisits || 0} />
        <StatCard title="Уровень лояльности" value="★★★★★" />
        <StatCard title="Статус" value="Установлена" color="green" />
        <StatCard title="Серийный номер карты" value={client.cardSerial} />
        <StatCard title="Дата выпуска карты" value={client.issueDate || '—'} />
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={transactionHeaders} rows={mockTransactions} />
      </div>
    </div>
  );
};

export default ClientDetails;
