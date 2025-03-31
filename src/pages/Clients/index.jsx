import React, { useState } from 'react';
import './styles.css';

const Clients = () => {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'ss',
      surname: 'ss',
      phone: '+71111111111',
      createdAt: '30/03/2025 21:26',
      birthday: '04/03/2025'
    }
  ]);
  const [newClient, setNewClient] = useState({ surname: '', name: '', phone: '', email: '', birthday: '' });

  const handleAddClient = () => {
    setClients([...clients, { ...newClient, id: Date.now(), createdAt: new Date().toLocaleString() }]);
    setShowModal(false);
    setNewClient({ surname: '', name: '', phone: '', email: '', birthday: '' });
  };

  return (
    <div className="clients-page">
      <h2>Клиентская база</h2>

      <div className="clients-statistics">
        <div className="stat-box"><strong>{clients.length}</strong><p>Клиентов в базе</p></div>
        <div className="stat-box"><strong>0</strong><p>Транзакций по картам</p></div>
        <div className="stat-box"><strong>0</strong><p>Карт установлено</p></div>
        <div className="stat-box">
          <p>Уровень лояльности</p>
          <div className="stars">{'\u2606'.repeat(5)}</div>
        </div>
      </div>

      <div className="clients-actions">
        <button onClick={() => setShowModal(true)}>Добавить клиента</button>
      </div>

      <div className="clients-list">
        {clients.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-initials">{client.name[0]}{client.surname[0]}</div>
            <div className="client-info">
              <div><strong>{client.name} {client.surname}</strong></div>
              <div>📅 {client.createdAt}</div>
              <div>📞 {client.phone}</div>
              <div>🎂 {client.birthday} - Дата рождения</div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Добавить клиента</h3>
            <input placeholder="Фамилия" value={newClient.surname} onChange={e => setNewClient({ ...newClient, surname: e.target.value })} />
            <input placeholder="Имя" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} />
            <input placeholder="Телефон" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
            <input placeholder="Email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
            <input type="date" value={newClient.birthday} onChange={e => setNewClient({ ...newClient, birthday: e.target.value })} />
            <button onClick={handleAddClient}>Добавить клиента</button>
            <button onClick={() => setShowModal(false)}>Отменить</button>
          </div>
        </div>
      )}

      <div className="clients-footer">
        <div className="import-box">
          <h4>Импорт клиентов</h4>
          <p>Импортируйте клиентов в систему с помощью xlsx шаблона</p>
          <button>Скачать шаблон импорта</button>
          <button>Импортировать клиентов</button>
        </div>
        <div className="push-box">
          <h4>Рассылка push</h4>
          <p>Отправляйте своим клиентам push-уведомления</p>
          <button>Создать рассылку</button>
        </div>
      </div>
    </div>
  );
};

export default Clients;
