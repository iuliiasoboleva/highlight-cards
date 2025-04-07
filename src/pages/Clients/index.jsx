import React, { useState } from 'react';

import './styles.css';

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Иван',
      surname: 'Иванов',
      phone: '+71111111111',
      createdAt: '30/03/2025 21:26',
      birthday: '04/03/1985',
    },
  ]);
  const [newClient, setNewClient] = useState({
    surname: '',
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });

  const handleAddClient = () => {
    setClients([
      ...clients,
      { ...newClient, id: Date.now(), createdAt: new Date().toLocaleString() },
    ]);
    setShowModal(false);
    setNewClient({ surname: '', name: '', phone: '', email: '', birthday: '' });
  };

  return (
    <div className="clients-container">
      <h2 className="clients-title">Клиентская база</h2>

      <div className="clients-stats-grid">
        <div className="clients-stat-card">
          <span className="stat-value">{clients.length}</span>
          <span className="stat-label">Клиентов в базе</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-value">0</span>
          <span className="stat-label">Транзакций по картам</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-value">0</span>
          <span className="stat-label">Карт установлено</span>
        </div>
        <div className="clients-stat-card">
          <span className="stat-label">Уровень лояльности</span>
          <div className="loyalty-stars">{'\u2605'.repeat(3) + '\u2606'.repeat(2)}</div>
        </div>
      </div>

      <div className="clients-actions-bar">
        <button className="clients-add-button" onClick={() => setShowModal(true)}>
          + Добавить клиента
        </button>
      </div>

      <div className="clients-list-container">
        {clients.map((client) => (
          <div key={client.id} className="client-card">
            <div className="client-avatar">
              {client.name[0]}
              {client.surname[0]}
            </div>
            <div className="client-details">
              <h3 className="client-name">
                {client.surname} {client.name}
              </h3>
              <div className="client-meta">
                <span className="client-meta-item">
                  <i className="icon-calendar"></i> {client.createdAt}
                </span>
                <span className="client-meta-item">
                  <i className="icon-phone"></i> {client.phone}
                </span>
                <span className="client-meta-item">
                  <i className="icon-birthday"></i> {client.birthday}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="clients-modal-overlay">
          <div className="clients-modal">
            <h3 className="modal-title">Добавить клиента</h3>
            <div className="modal-form-group">
              <input
                className="modal-input"
                placeholder="Фамилия"
                value={newClient.surname}
                onChange={(e) => setNewClient({ ...newClient, surname: e.target.value })}
              />
            </div>
            <div className="modal-form-group">
              <input
                className="modal-input"
                placeholder="Имя"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </div>
            <div className="modal-form-group">
              <input
                className="modal-input"
                placeholder="Телефон"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              />
            </div>
            <div className="modal-form-group">
              <input
                className="modal-input"
                placeholder="Email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <div className="modal-form-group">
              <input
                className="modal-input"
                type="date"
                value={newClient.birthday}
                onChange={(e) => setNewClient({ ...newClient, birthday: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-button modal-button-primary" onClick={handleAddClient}>
                Добавить клиента
              </button>
              <button
                className="modal-button modal-button-secondary"
                onClick={() => setShowModal(false)}
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="clients-footer-grid">
        <div className="footer-card">
          <h4 className="footer-card-title">Импорт клиентов</h4>
          <p className="footer-card-description">
            Импортируйте клиентов в систему с помощью xlsx шаблона
          </p>
          <div className="footer-card-actions">
            <button className="footer-button">Скачать шаблон импорта</button>
            <button className="footer-button footer-button-secondary">
              Импортировать клиентов
            </button>
          </div>
        </div>
        <div className="footer-card">
          <h4 className="footer-card-title">Рассылка push</h4>
          <p className="footer-card-description">Отправляйте своим клиентам push-уведомления</p>
          <button className="footer-button">Создать рассылку</button>
        </div>
      </div>
    </div>
  );
};

export default Clients;
