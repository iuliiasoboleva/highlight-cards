import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import QRPopup from '../../components/QRPopup';

import './styles.css';

const EditInfo = () => {
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [showQRPopup, setShowQRPopup] = useState(false);

  const currentCard = useSelector((state) => state.cards.currentCard);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = useCallback((field) => (e) => console.log('done'), []);

  const formFields = [
    {
      key: 'description',
      label: 'Описание карты',
      type: 'textarea',
      defaultValue: 'Собирайте штампы для получения наград',
    },
    {
      key: 'howToGetStamp',
      label: 'Как клиенту получить штамп',
      defaultValue: 'Сделайте покупку, чтобы получить штамп',
    },
    { key: 'companyName', label: 'Название компании' },
    { key: 'rewardDescription', label: 'Описание награды', type: 'textarea' },
    { key: 'stampMessage', label: 'Сообщение о начисленном штампе' },
    {
      key: 'claimRewardMessage',
      label: 'Сообщение о начисленной награде',
      defaultValue: 'Ваша награда ждет вас! Приходите за получением подарка',
    },
  ];

  const renderField = ({ key, label, type, defaultValue = '' }) => {
    const InputComponent = type === 'textarea' ? 'textarea' : 'input';
    return (
      <div key={key}>
        <h3>{label}</h3>
        <InputComponent
          value={defaultValue}
          onChange={handleChange(key)}
          className={`info-${type || 'input'}`}
        />
      </div>
    );
  };

  const infoContent = (
    <div className="design-section">
      <h2>
        Настройки <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
      </h2>
      <hr />
      {formFields.map(renderField)}
      <button onClick={() => setShowQRPopup(true)} className="create-button">
        Завершить
      </button>
    </div>
  );

  const cardPreview = (
    <div className="phone-frame">
      <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
      <div className="phone-screen">
        <CardInfo card={currentCard} />
      </div>
    </div>
  );

  return (
    <div className="edit-type-main-container">
      {isMobile && (
        <div className="edit-type-tabs">
          {['description', 'card'].map((tab) => (
            <button
              key={tab}
              className={`edit-type-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'description' ? 'Описание' : 'Карта'}
            </button>
          ))}
        </div>
      )}

      {isMobile ? (
        <div className="edit-type-layout">
          <div className="edit-type-page">
            {activeTab === 'description' ? (
              <div className="edit-type-right">{infoContent}</div>
            ) : (
              <div className="edit-type-right">{cardPreview}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="edit-type-layout">
          <div className="edit-type-left">
            <div className="edit-type-page">{infoContent}</div>
          </div>
          <div className="edit-type-right">{cardPreview}</div>
        </div>
      )}
      {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
    </div>
  );
};

export default EditInfo;
