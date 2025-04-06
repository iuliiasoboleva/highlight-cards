import React, { useState } from 'react';

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
  const [managers, setManagers] = useState(initialManagers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newManager, setNewManager] = useState({
    name: '',
    location: '',
    shift: '',
  });

  const handleAdd = () => {
    setManagers([...managers, { ...newManager, id: Date.now() }]);
    setNewManager({ name: '', location: '', shift: '' });
    setShowAddModal(false);
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
        <button className="download-btn">📥</button>
      </div>

      <div className="managers-controls">
        <button className="btn-dark" onClick={() => setShowAddModal(true)}>
          Добавить менеджера
        </button>
        <input
          className="search-input"
          placeholder="Введите имя менеджера"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="managers-grid">
        <div className="manager-card create-card" onClick={() => setShowAddModal(true)}>
          <h3>Создать менеджера</h3>
          <p>
            Создайте менеджеров для раздельного отслеживания эффективности выдачи карт и начисления
            штампов. Менеджеры могут быть распределены по торговым точкам или же по сменам.
          </p>
          <span className="emoji">🧑‍💼</span>
        </div>

        <div className="manager-card scanner-card">
          <h3>Приложение-сканер</h3>
          <p>
            Установите приложение-сканер карт своим менеджерам в точках продаж. С помощью приложения
            они смогут пробивать штампы клиентам и выдавать награды.
          </p>
          <img className="scanner-icon" src="/scanner.png" alt="scanner" />
          <button className="btn-dark">Открыть</button>
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
