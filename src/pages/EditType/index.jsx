import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGift,
  faStamp,
  faUserGroup,
  faPercent,
  faDollarSign,
  faTag,
  faTicket,
  faMoneyCheckDollar,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { mockCards } from '../../mocks/cardData';
import CardInfo from '../../components/CardInfo';
import './styles.css';

const cardTypes = [
  { id: 'stamp', name: 'Штамп', icon: faStamp, tag: 'high' },
  { id: 'reward', name: 'Награда', icon: faGift, tag: 'high' },
  { id: 'club', name: 'Клубная карта', icon: faUserGroup, tag: 'high' },
  { id: 'discount', name: 'Скидка', icon: faPercent, tag: 'high' },
  { id: 'cashback', name: 'Кешбэк', icon: faDollarSign, tag: 'high' },
  { id: 'coupon', name: 'Купон', icon: faTag, tag: 'shop' },
  { id: 'subscription', name: 'Абонемент', icon: faTicket, tag: 'shop' },
  { id: 'certificate', name: 'Сертификат', icon: faMoneyCheckDollar, tag: 'shop' }
];

const EditType = ({ setType }) => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const newCard = {
    id: Math.max(...mockCards.map(c => c.id)) + 1,
    status: selectedType,
    name: 'Накопительная карта',
    isActive: false,
    urlCopy: 'https://take.cards/cMla3',
    pdfImg: '/pdf-example.svg',
    qrImg: '/qr-code.svg',
    frameUrl: '/phone.svg',
    balanceMoney: 1800,
    cardImg: '/strip.png',
    title: 'Сертификат',
  };

  const handleCreateCard = () => {
    setType(selectedType);
    mockCards.push(newCard);
    navigate(`/cards/${newCard.id}/edit/settings`);
  };

  return (
    <div className='edit-type-main-container'>
      <div className="edit-type-page">
        <h2>
          Тип карты{' '}
          <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
        </h2>
        <hr />

        <div className="card-types-grid">
          {cardTypes.map((type) => (
            <div
              key={type.id}
              className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <FontAwesomeIcon icon={type.icon} className="icon" />
              <div className="type-name">{type.name}</div>
              <div className={`tag ${type.tag === 'high' ? 'green' : 'purple'}`}>
                {type.tag === 'high' ? 'Высокий уровень удержания' : 'Лучшее для покупок'}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreateCard}
          disabled={!selectedType}
          className="create-button"
        >
          Продолжить
        </button>
      </div>
      <div className='type-card-image-container'>
        <img className='card-image-add' src={newCard.frameUrl} alt={newCard.name} />
        <CardInfo card={newCard} />
      </div>
    </div>
  );
};

export default EditType;
