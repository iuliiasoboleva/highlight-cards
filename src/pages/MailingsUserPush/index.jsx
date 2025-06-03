import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import PushPreview from '../../components/PushPreview';
import { mockUserPushes } from '../../mocks/mockUserPushes';

import './styles.css';

const MailingsUserPush = () => {
  const [tariff, setTariff] = useState('Start');
  const [pushMessage, setPushMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('settings');

  const hasAccess = tariff !== 'Start';

  const currentCard = useSelector((state) => state.cards.currentCard);

  useEffect(() => {
    if (currentCard) {
      setPushMessage(
        currentCard.pushNotification?.message ||
          `Новое уведомление по вашей карте "${currentCard.title}"`,
      );
    }
  }, [currentCard]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scenariosContent = (
    <div className="edit-type-left">
      <div className="edit-type-page">
        <h2>Пользовательские push</h2>
        <p className="page-subtitle">
          Задайте свои правила отправки PUSH-уведомлений клиенту. Выберите после какого события и
          через сколько времени будет отправлено уведомление
        </p>
        {hasAccess ? (
          <div className="automation-table">
            <h3>Сценарии пользовательских пушей</h3>
            <ul className="automation-list">
              {mockUserPushes.map((item) => (
                <li key={item.id} className="automation-item">
                  <div className="automation-item-title">{item.title}</div>
                  <div className="automation-item-description">{item.description}</div>
                  <div className="automation-item-status">
                    {item.enabled ? 'Включено' : 'Выключено'}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <p className="page-subtitle">
              Данный функционал не доступен на вашем тарифе <strong>«Start»</strong>
            </p>
            <button className="card-form-add-btn">Выбрать тариф</button>
          </>
        )}
      </div>
    </div>
  );

  const previewContent = (
    <div className="edit-type-right">
      <div className="phone-sticky">
        <div className="card-state">
          <span className={`status-indicator ${currentCard.isActive ? 'active' : 'inactive'}`} />
          {currentCard.isActive ? 'Активна' : 'Не активна'}
        </div>
        <div className="phone-frame">
          <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
          <div className="phone-screen">
            <PushPreview card={currentCard} message={pushMessage} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="edit-type-layout">
      {isMobile && (
        <div className="edit-type-tabs">
          {['settings', 'card'].map((tab) => (
            <button
              key={tab}
              className={`edit-type-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'settings' ? 'Сценарии' : 'Превью'}
            </button>
          ))}
        </div>
      )}

      {isMobile ? (
        activeTab === 'settings' ? (
          scenariosContent
        ) : (
          previewContent
        )
      ) : (
        <>
          {scenariosContent}
          {previewContent}
        </>
      )}
    </div>
  );
};

export default MailingsUserPush;
