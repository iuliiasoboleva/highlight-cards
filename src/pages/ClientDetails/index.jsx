import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import CustomTable from '../../components/CustomTable';
import { clientHeaders, mockClients } from '../../mocks/mockClientTable';
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
      <h2 className="client-container-title">Профиль пользователя</h2>
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
        <StatCard />
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={clientHeaders} rows={mockClients} />
      </div>
    </div>
  );
};

export default ClientDetails;
