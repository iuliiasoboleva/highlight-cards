import React, { useState } from 'react';

import { mockCustomerData } from '../../mocks/mockCustomerData';

import './styles.css';

const CustomerPage = () => {
  const [customer, setCustomer] = useState(mockCustomerData);
  const [stampsToAdd, setStampsToAdd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Имитация API-запроса
  const mockApiCall = (action, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let response = { ...customer };

          switch (action) {
            case 'addStamps':
              response.activeStorage += data.amount;
              response.stamps += data.amount;
              break;

            case 'addReward':
              response.availableRewards += 1;
              response.lastRewardReceived = new Date().toLocaleDateString();
              break;

            case 'receiveReward':
              if (response.availableRewards <= 0) {
                throw new Error('Нет доступных наград');
              }
              response.availableRewards -= 1;
              response.lastRewardReceived = new Date().toLocaleDateString();

              if (response.activeStorage >= 10) {
                response.activeStorage -= 10; // Пример: 10 баллов = 1 награда
              }
              break;

            default:
              break;
          }
          resolve(response);
        } catch (error) {
          reject(error);
        }
      }, 800);
    });
  };

  const handleReceiveReward = async () => {
    setIsLoading(true);
    try {
      const updatedCustomer = await mockApiCall('receiveReward');
      setCustomer(updatedCustomer);
      showNotification('Награда успешно получена!');
    } catch (error) {
      showNotification(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStamps = async () => {
    if (!stampsToAdd || isNaN(stampsToAdd) || stampsToAdd <= 0) {
      showNotification('Введите корректное количество штампов');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCustomer = await mockApiCall('addStamps', {
        amount: parseInt(stampsToAdd),
      });
      setCustomer(updatedCustomer);
      setStampsToAdd('');
      showNotification(`Добавлено ${stampsToAdd} штампов!`);
    } catch (error) {
      showNotification('Ошибка при добавлении штампов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReward = async () => {
    setIsLoading(true);
    try {
      const updatedCustomer = await mockApiCall('addReward');
      setCustomer(updatedCustomer);
      showNotification('Награда добавлена!');
    } catch (error) {
      showNotification('Ошибка при добавлении награды');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="customer-page">
      {notification && <div className="notification">{notification}</div>}

      <div className="customer-header">
        <h1>
          Клиент: <span className="customer-name">{customer.name}</span>
        </h1>
      </div>

      <div className="customer-actions">
        <button className="btn btn-primary" onClick={handleAddReward} disabled={isLoading}>
          {isLoading ? 'Обработка...' : 'Добавить награду'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleReceiveReward}
          disabled={isLoading || customer.availableRewards <= 0}
        >
          {isLoading ? 'Обработка...' : 'Получить награду'}
        </button>
      </div>

      <div className="stamp-section">
        <h2>Добавить штампы:</h2>
        <div className="stamp-controls">
          <input
            type="number"
            min="1"
            value={stampsToAdd}
            onChange={(e) => setStampsToAdd(e.target.value)}
            placeholder="Количество штампов"
            className="stamp-input"
            disabled={isLoading}
          />
          <button
            className="btn btn-add-stamp"
            onClick={handleAddStamps}
            disabled={isLoading || !stampsToAdd}
          >
            {isLoading ? 'Добавление...' : 'Добавить'}
          </button>
        </div>
      </div>

      <div className="customer-info-grid">
        <div className="info-item">
          <span className="info-label">Текущие баллы:</span>
          <span className="info-value">{customer.activeStorage}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Доступные награды:</span>
          <span className="info-value">{customer.availableRewards}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Последняя награда:</span>
          <span className="info-value">{customer.lastRewardReceived || '—'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Последнее начисление:</span>
          <span className="info-value">{customer.lastAccrual}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Срок действия карты:</span>
          <span className="info-value">{customer.cardExpirationDate || '—'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Дата регистрации:</span>
          <span className="info-value">{customer.cardInstallationDate}</span>
        </div>
      </div>

      <div className="serial-number">
        <span className="serial-label">Номер карты:</span>
        <span className="serial-value">{customer.serialNumber}</span>
      </div>

      <div className="age-info">
        <span className="age-label">Статус:</span>
        <span className="age-value">{customer.ageInfo}</span>
      </div>

      <div className="instruction">
        <p>Введите количество штампов и нажмите "Добавить" для начисления баллов.</p>
      </div>
    </div>
  );
};

export default CustomerPage;
