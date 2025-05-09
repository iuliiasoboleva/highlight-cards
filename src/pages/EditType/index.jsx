import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  faCircleQuestion,
  faDollarSign,
  faPercent,
  faStamp,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CardInfo from '../../components/CardInfo';
import { addCard, initializeCurrentCard, updateCurrentCard } from '../../store/cardsSlice';

import './styles.css';

const cardTypes = [
  { id: 'stamps', name: 'Штамп', icon: faStamp, tag: 'high' },
  { id: 'discount', name: 'Скидка', icon: faPercent, tag: 'high' },
  { id: 'cashback', name: 'Кешбэк', icon: faDollarSign, tag: 'high' },
  { id: 'subscription', name: 'Абонемент', icon: faTicket, tag: 'shop' },
];

const EditType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, cards } = useSelector((state) => state.cards);
  const [selectedType, setSelectedType] = useState(currentCard.status || 'stamp');
  const [activeTab, setActiveTab] = useState('description');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Инициализация currentCard при монтировании
  useEffect(() => {
    if (!currentCard.id) {
      const newId = cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
      dispatch(initializeCurrentCard({ id: newId }));
    }
  }, [dispatch, cards, currentCard.id]);

  useEffect(() => {
    if (currentCard.status) {
      setSelectedType(currentCard.status);
    }
  }, [currentCard.status]);

  const handleResize = () => {
    setIsMobile(window.innerWidth >= 1024);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    const cardName = cardTypes.find((type) => type.id === typeId)?.name || 'Карта';
    dispatch(
      updateCurrentCard({
        status: typeId,
        name: cardName,
      }),
    );
  };

  const handleCreateCard = () => {
    if (!selectedType) return;

    // Добавляем карту с текущими параметрами
    dispatch(addCard());
    navigate(`/cards/${currentCard.id}/edit/settings`);
  };

  return (
    <div className="edit-type-main-container">
      {isMobile && (
        <div className="edit-type-tabs">
          <button
            className={`edit-type-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Описание
          </button>
          <button
            className={`edit-type-tab ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            Карта
          </button>
        </div>
      )}

      {isMobile ? (
        <div className="edit-type-content">
          {activeTab === 'description' && (
            <div className="edit-type-page">
              <h2>
                Тип карты <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
              </h2>
              <hr />

              <div className="card-types-grid">
                {cardTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`edit-type-card ${selectedType === type.id ? 'selected' : ''}`}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <FontAwesomeIcon icon={type.icon} className="icon" />
                    <div className="edit-type-name">{type.name}</div>
                    <div
                      className={`edit-type-tag ${type.tag === 'high' ? 'edit-type-green' : 'edit-type-purple'}`}
                    >
                      {type.tag === 'high' ? 'Высокий уровень удержания' : 'Лучшее для покупок'}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleCreateCard} disabled={!selectedType} className="create-button">
                Продолжить
              </button>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="type-card-image-container">
              <img className="card-image-add" src={currentCard.frameUrl} alt={currentCard.name} />
              <CardInfo card={currentCard} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="edit-type-page">
            <h2>
              Тип карты <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16 }} />
            </h2>
            <hr />

            <div className="card-types-grid">
              {cardTypes.map((type) => (
                <div
                  key={type.id}
                  className={`edit-type-card ${selectedType === type.id ? 'selected' : ''}`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <FontAwesomeIcon icon={type.icon} className="icon" />
                  <div className="edit-type-name">{type.name}</div>
                  <div
                    className={`edit-type-tag ${type.tag === 'high' ? 'edit-type-green' : 'edit-type-purple'}`}
                  >
                    {type.tag === 'high' ? 'Высокий уровень удержания' : 'Лучшее для покупок'}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleCreateCard} disabled={!selectedType} className="create-button">
              Продолжить
            </button>
          </div>
          <div className="type-card-image-container">
            <img className="card-image-add" src={currentCard.frameUrl} alt={currentCard.name} />
            <CardInfo card={currentCard} />
          </div>
        </>
      )}
    </div>
  );
};

export default EditType;
