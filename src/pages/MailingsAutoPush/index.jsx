import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import PushPreview from '../../components/PushPreview';
import { mockUserPushes } from '../../mocks/mockUserPushes';

import './styles.css';

const MailingsAutoPush = () => {
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
    <div className="mailings-push-container">
      <h2 className="mailings-push-title">Автоматизация push</h2>
      <p className="mailings-push-description">
        Настройте автоматические PUSH-уведомления по собственному сценарию. Поздравляйте клиента с
        днём рождения, собирайте обратную связь, напоминайте зайти к вам снова
      </p>

      <hr />

      {hasAccess ? (
        <div className="automation-table">
          <h3>Сценарии автопушей</h3>
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
        <div className="tariff-lock-box">
          <p>
            Данный функционал не доступен на вашем тарифе <strong>«Start»</strong>
          </p>
          <button className="btn btn-dark">Выбрать тариф</button>
        </div>
      )}
    </div>
  );

  const previewContent = (
    <div className="type-card-image-container">
      <img className="card-image-add" src="/phone.svg" alt="preview" />
      <PushPreview card={currentCard} message={pushMessage} />
    </div>
  );

  return (
    <div className="edit-type-main-container">
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
        <div className="edit-type-content">
          <div className="edit-type-page">
            {activeTab === 'settings' ? scenariosContent : previewContent}
          </div>
        </div>
      ) : (
        <>
          <div className="edit-type-page">{scenariosContent}</div>
          {previewContent}
        </>
      )}
    </div>
  );
};

export default MailingsAutoPush;
