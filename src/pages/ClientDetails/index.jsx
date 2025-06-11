import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ClientDetails = () => {
  const { id } = useParams();
  const client = useSelector((state) => state.clients.find((client) => String(client.id) === id));

  if (!client) {
    return <p>Клиент не найден</p>;
  }

  return (
    <div className="clients-container">
      <h2>Профиль пользователя </h2>
      <div className="tariff-boxes">
        <div className="tariff-box">
          <div className="tariff-box-content">
            <div className="tariff-price">
              {client.name} {client.surname}
            </div>
            <div className="tariff-sub">Имя клиента</div>
          </div>
        </div>
        <div className="tariff-box">
          <div className="tariff-box-content">
            <div className="tariff-price">{client.createdAt}</div>
            <div className="tariff-sub">Дата регистрации </div>
          </div>
        </div>
      </div>

      <h2>
        {client.name} {client.surname}
      </h2>
      <p>
        <strong>Email:</strong> {client.email}
      </p>
      <p>
        <strong>Телефон:</strong> {client.phone}
      </p>
      <p>
        <strong>Дата рождения:</strong> {client.birthday}
      </p>
      <p>
        <strong>ID:</strong> {client.id}
      </p>
    </div>
  );
};

export default ClientDetails;
