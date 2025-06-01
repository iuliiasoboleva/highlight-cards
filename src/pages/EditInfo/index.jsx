import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EditLayout from '../../components/EditLayout';
import QRPopup from '../../components/QRPopup';
import { updateCurrentCardField } from '../../store/cardsSlice';

import './styles.css';

const EditInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [showQRPopup, setShowQRPopup] = useState(false);

  const handleChange = useCallback(
    (field) => (e) => {
      dispatch(updateCurrentCardField({ path: field, value: e.target.value }));
    },
    [dispatch],
  );

  const formFields = [
    {
      key: 'description',
      label: 'Описание карты',
      type: 'textarea',
      defaultValue: currentCard.description || 'Собирайте штампы для получения наград',
    },
    {
      key: 'howToGetStamp',
      label: 'Как клиенту получить штамп',
      defaultValue: currentCard.howToGetStamp || 'Сделайте покупку, чтобы получить штамп',
    },
    { key: 'companyName', label: 'Название компании', defaultValue: currentCard.companyName || '' },
    {
      key: 'rewardDescription',
      label: 'Описание награды',
      type: 'textarea',
      defaultValue: currentCard.rewardDescription || '',
    },
    {
      key: 'stampMessage',
      label: 'Сообщение о начисленном штампе',
      defaultValue: currentCard.stampMessage || '',
    },
    {
      key: 'claimRewardMessage',
      label: 'Сообщение о начисленной награде',
      defaultValue:
        currentCard.claimRewardMessage || 'Ваша награда ждет вас! Приходите за получением подарка',
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

  return (
    <>
      <EditLayout>{infoContent}</EditLayout>
      {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
    </>
  );
};

export default EditInfo;
