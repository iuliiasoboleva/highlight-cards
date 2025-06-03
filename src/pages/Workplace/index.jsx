import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BarChart2, Camera, Search, User as UserIcon } from 'lucide-react';

import RoleSwitcher from '../../components/RoleSwitcher';

const Workplace = () => {
  const user = useSelector((state) => state.user);
  const locations = useSelector((state) => state.locations);
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState('');

  const handleFindCustomer = () => {
    if (cardNumber.trim()) {
      navigate(`/customer/card/${cardNumber.trim()}`);
    }
  };

  const userLocation = locations.find((loc) =>
    loc.employees.includes(`${user.name} ${user.surname}`),
  );

  if (!userLocation) {
    return <p>Точка продаж не найдена</p>;
  }

  return (
    <div className="managers-page">
      <div className="managers-header">
        <h2>Рабочее место</h2>
        <p>
          Добро пожаловать в рабочее место,{' '}
          <strong>
            {user.name} <strong>{user.surname}</strong>
          </strong>
          ! Вы находитесь в точке <strong>{userLocation.name}</strong>. Начните работу —
          отсканируйте карту клиента или введите номер карты и начислите баллы.
        </p>
      </div>

      <div className="managers-grid">
        <div className="manager-card">
          <h3>Информация о сотруднике</h3>
          <div>
            <p>
              Ваши точки продаж: <strong>{userLocation.name}</strong>
            </p>
            <p>Адрес: {userLocation.address || 'не указан'}</p>
            <p>Смена: —</p>
            <p>Статус: {user.status || 'неизвестен'}</p>
          </div>
          <UserIcon size={32} className="scanner-icon" />
        </div>

        <div className="manager-card">
          <h3>Мини-отчёт по смене</h3>
          <p>
            - Обслужено клиентов: {user.clientsServed}
            <br />- Начислено баллов: {user.pointsIssued}
            <br />- Выдано подарков: {user.giftsGiven}
          </p>
          <BarChart2 size={32} className="scanner-icon" />
        </div>

        <div className="manager-card search-card">
          <h3>Поиск по карте</h3>
          <p>
            Введите номер карты лояльности клиента, чтобы перейти к его профилю. Удобно, если нет
            приложения-сканера.
          </p>
          <Search size={32} className="scanner-icon" />
          <input
            type="text"
            placeholder="Номер карты"
            value={cardNumber}
            className="location-modal-input"
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <button className="custom-main-button" onClick={handleFindCustomer}>
            Найти клиента
          </button>
        </div>

        <div className="manager-card scanner-card">
          <h3>Приложение-сканер</h3>
          <p>
            Установите приложение-сканер карт своим менеджерам в точках продаж. С помощью приложения
            они смогут пробивать штампы клиентам и выдавать награды.
          </p>
          <Camera size={32} className="scanner-icon" />
          <button className="custom-main-button" onClick={() => navigate('/scan')}>
            Открыть
          </button>
        </div>
      </div>
      <RoleSwitcher />
    </div>
  );
};

export default Workplace;
