import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import QRPopup from '../../components/QRPopup';
import { updateCardInfo } from '../../store/cardInfoSlice';

import './styles.css';

const EditInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cardInfo = useSelector((state) => state.cardInfo);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [showQRPopup, setShowQRPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = useCallback(
    (field) => (e) =>
      dispatch(
        updateCardInfo({
          ...cardInfo,
          [field]: e.target.value,
        }),
      ),
    [cardInfo, dispatch],
  );

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
          value={cardInfo[key] || defaultValue}
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
    <div className="type-card-image-container">
      <img className="card-image-add" src="/phone.svg" alt="preview" />
      <CardInfo
        card={{
          id,
          title: 'Карта',
          name: cardInfo.companyName || 'Накопительная карта',
          description: cardInfo.description,
          status: 'stamp',
          ...cardInfo,
        }}
      />
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
        <div className="edit-type-content">
          <div className="edit-type-page">
            {activeTab === 'description' ? infoContent : cardPreview}
          </div>
        </div>
      ) : (
        <>
          <div className="edit-type-page">{infoContent}</div>
          {cardPreview}
        </>
      )}
      {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
    </div>
  );
};

export default EditInfo;
