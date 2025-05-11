import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import './styles.css';

const CustomerPage = () => {
  const { cardNumber } = useParams();
  const clients = useSelector((state) => state.clients);

  const customerWithCard = clients.find((client) =>
    client.cards.some((card) => card.cardNumber === cardNumber),
  );
  console.log('customerWithCard', customerWithCard);
  const selectedCard = customerWithCard?.cards.find((card) => card.cardNumber === cardNumber);
  const selectedCardIndex = customerWithCard?.cards.findIndex(
    (card) => card.cardNumber === cardNumber,
  );
  console.log('selectedCard', selectedCard);

  const [customer, setCustomer] = useState(customerWithCard);
  const [stampsToAdd, setStampsToAdd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!customer || !selectedCard || selectedCardIndex === -1) {
    return <div>Карта не найдена</div>;
  }

  const mockApiCall = (action, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedCustomer = { ...customer };
          const updatedCard = { ...selectedCard };

          switch (action) {
            case 'addStamps':
              updatedCard.activeStorage += data.amount;
              updatedCard.stamps = (updatedCard.stamps || 0) + data.amount;
              break;
            case 'addReward':
              updatedCard.availableRewards += 1;
              updatedCard.lastRewardReceived = new Date().toLocaleDateString();
              break;
            case 'receiveReward':
              if (updatedCard.availableRewards <= 0) {
                throw new Error('Нет доступных наград');
              }
              updatedCard.availableRewards -= 1;
              updatedCard.lastRewardReceived = new Date().toLocaleDateString();
              if (updatedCard.activeStorage >= 10) {
                updatedCard.activeStorage -= 10;
              }
              break;
            default:
              break;
          }

          updatedCustomer.cards[selectedCardIndex] = updatedCard;
          resolve(updatedCustomer);
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
          disabled={isLoading || selectedCard.availableRewards <= 0}
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
          <span className="info-value">{selectedCard.activeStorage}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Доступные награды:</span>
          <span className="info-value">{selectedCard.availableRewards}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Последняя награда:</span>
          <span className="info-value">{selectedCard.lastRewardReceived || '—'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Последнее начисление:</span>
          <span className="info-value">{selectedCard.lastAccrual || '—'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Срок действия карты:</span>
          <span className="info-value">{selectedCard.cardExpirationDate || '—'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Дата регистрации:</span>
          <span className="info-value">{selectedCard.cardInstallationDate || '—'}</span>
        </div>
      </div>

      <div className="serial-number">
        <span className="serial-label">Номер карты:</span>
        <span className="serial-value">{selectedCard.serialNumber}</span>
      </div>

      <div className="age-info">
        <span className="age-label">Статус:</span>
        <span className="age-value">{selectedCard.ageInfo || '—'}</span>
      </div>

      <div className="instruction">
        <p>Введите количество штампов и нажмите "Добавить" для начисления баллов.</p>
      </div>
    </div>
  );
};

export default CustomerPage;
