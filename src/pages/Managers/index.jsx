import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomTable from '../../components/CustomTable';
import { managersHeaders } from '../../mocks/managersInfo';
import { addManager, removeManager } from '../../store/managersSlice';

import './styles.css';

const ManagersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [newManager, setNewManager] = useState({
    name: '',
    surname: '',
    location: '',
    shift: '',
  });

  const managers = useSelector((state) => state.managers);
  const clients = useSelector((state) => state.clients);

  const columns = [
    ...managersHeaders.map((header) => ({
      key: header.key,
      title: header.label,
      className: 'text-left',
      cellClassName: 'text-left',
    })),
    {
      key: 'actions',
      title: 'Действия',
      render: (row) => (
        <button className="remove-btn" onClick={() => dispatch(removeManager(row.id))}>
          🗑
        </button>
      ),
    },
  ];

  const handleAdd = () => {
    dispatch(addManager(newManager));
    setNewManager({ name: '', surname: '', location: '', shift: '' });
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
            className="location-modal-input"
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
      </div>
      <div className="table-wrapper">
        <CustomTable columns={columns} rows={managers} />
      </div>
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Добавить менеджера</h3>
            <input
              type="text"
              placeholder="Имя"
              value={newManager.name}
              onChange={(e) =>
                setNewManager((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Фамилия"
              value={newManager.surname}
              onChange={(e) =>
                setNewManager((prev) => ({ ...prev, surname: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Локация"
              value={newManager.location}
              onChange={(e) =>
                setNewManager((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Смена"
              value={newManager.shift}
              onChange={(e) =>
                setNewManager((prev) => ({ ...prev, shift: e.target.value }))
              }
            />
            <div className="modal-buttons">
              <button
                className="btn btn-dark"
                onClick={handleAdd}
                disabled={
                  !newManager.name ||
                  !newManager.surname ||
                  !newManager.location ||
                  !newManager.shift
                }
              >
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
