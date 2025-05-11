import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './styles.css';

const initialManagers = [
  {
    id: 1,
    name: 'Иван Иванов',
    location: 'Точка 1',
    shift: 'Утренняя',
  },
];

const ManagersPage = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState(initialManagers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newManager, setNewManager] = useState({
    name: '',
    location: '',
    shift: '',
  });
  const [cardNumber, setCardNumber] = useState('');

  const clients = useSelector((state) => state.clients);

  const handleAdd = () => {
    setManagers([...managers, { ...newManager, id: Date.now() }]);
    setNewManager({ name: '', location: '', shift: '' });
    setShowAddModal(false);
  };

  const handleFindCustomer = () => {
    const trimmedCard = cardNumber.trim();
    if (!trimmedCard) return;

    const foundClient = clients.find((client) =>
      client.cards.some((card) => card.cardNumber === trimmedCard),
    );

    if (foundClient) {
      navigate(`/customer/card/${trimmedCard}`);
    } else {
      alert('Клиент с такой картой не найден');
    }
  };

  const handleRemove = (id) => {
    setManagers(managers.filter((m) => m.id !== id));
  };

  const filteredManagers = managers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="managers-page">
      <div className="managers-header">
        <h2>Менеджеры</h2>
      </div>

      <div className="managers-grid">
        <div className="manager-card create-card" onClick={() => setShowAddModal(true)}>
          <h3>Создать менеджера</h3>
          <p>
            Создайте менеджеров для раздельного отслеживания эффективности выдачи карт и начисления
            штампов. Менеджеры могут быть распределены по торговым точкам или же по сменам.
          </p>
          <span className="scanner-icon">🧑‍💼</span>
          <button className="btn-dark" onClick={() => setShowAddModal(true)}>
            Добавить менеджера
          </button>
        </div>
        <div className="manager-card search-card">
          <h3>Поиск по карте</h3>
          <p>
            Введите номер карты лояльности клиента, чтобы перейти к его профилю. Удобно, если нет
            приложения-сканера.
          </p>
          <span className="scanner-icon">🔎</span>
          <input
            type="text"
            placeholder="Номер карты"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <button className="btn-dark" onClick={handleFindCustomer}>
            Найти клиента
          </button>
        </div>

        <div className="manager-card scanner-card">
          <h3>Приложение-сканер</h3>
          <p>
            Установите приложение-сканер карт своим менеджерам в точках продаж. С помощью приложения
            они смогут пробивать штампы клиентам и выдавать награды.
          </p>
          <span className="scanner-icon">📷</span>
          <button className="btn-dark" onClick={() => navigate('/scan')}>
            Открыть
          </button>
        </div>

        {filteredManagers.map((m) => (
          <div className="manager-card" key={m.id}>
            <div className="manager-card-header">
              <h4>{m.name}</h4>
              <button className="remove-btn" onClick={() => handleRemove(m.id)}>
                🗑
              </button>
            </div>
            <p>
              <strong>Локация:</strong> {m.location}
            </p>
            <p>
              <strong>Смена:</strong> {m.shift}
            </p>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Добавить менеджера</h3>
            <input
              type="text"
              placeholder="Имя"
              value={newManager.name}
              onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Локация"
              value={newManager.location}
              onChange={(e) => setNewManager({ ...newManager, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Смена"
              value={newManager.shift}
              onChange={(e) => setNewManager({ ...newManager, shift: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="btn-dark" onClick={handleAdd}>
                Добавить
              </button>
              <button className="btn-light" onClick={() => setShowAddModal(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagersPage;
