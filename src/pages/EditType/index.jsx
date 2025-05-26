import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BadgePercent, DollarSign, Gift, HelpCircle, Stamp, Ticket } from 'lucide-react';

import CardInfo from '../../components/CardInfo';
import { addCard, initializeCurrentCard, updateCurrentCard } from '../../store/cardsSlice';

import './styles.css';

const cardTypes = [
  { id: 'stamp', name: 'Штамп', icon: Stamp, tag: 'high' },
  { id: 'discount', name: 'Скидка', icon: BadgePercent, tag: 'high' },
  { id: 'cashback', name: 'Кешбэк', icon: DollarSign, tag: 'high' },
  { id: 'subscription', name: 'Абонемент', icon: Ticket, tag: 'shop' },
  { id: 'certificate', name: 'Подарочный сертификат', icon: Gift, tag: 'shop' },
];

const EditType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, cards } = useSelector((state) => state.cards);
  const [selectedType, setSelectedType] = useState(currentCard.status || 'stamp');
  const [activeTab, setActiveTab] = useState('description');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 999);

  useEffect(() => {
    if (!currentCard.id) {
      const newId = cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
      dispatch(initializeCurrentCard({ id: newId, status: 'stamp', name: 'Штамп' }));
    }
  }, [dispatch, cards, currentCard.id]);

  useEffect(() => {
    if (currentCard.status) {
      setSelectedType(currentCard.status);
    }
  }, [currentCard.status]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1024);
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
    dispatch(addCard());
    navigate(`/cards/${currentCard.id}/edit/settings`);
  };

  return (
    <div className="edit-type-layout">
      <div className="edit-type-left">
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

        {(!isMobile || activeTab === 'description') && (
          <div className="edit-type-page">
            <h2>
              Тип карты <HelpCircle size={16} />
            </h2>
            <hr />

            <div className="card-types-grid">
              {cardTypes.map((type) => {
                const isSelected = selectedType === type.id;
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`edit-type-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <Icon className="icon" size={24} />
                    <div className="edit-type-name">{type.name}</div>
                    <div
                      className={`edit-type-tag ${type.tag === 'high' ? 'edit-type-green' : 'edit-type-purple'}`}
                    >
                      {type.tag === 'high' ? 'Высокий уровень удержания' : 'Лучшее для покупок'}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={handleCreateCard} disabled={!selectedType} className="create-button">
              Продолжить
            </button>
          </div>
        )}
      </div>

      {(!isMobile || activeTab === 'card') && (
        <div className="edit-type-right">
          <div className="phone-frame">
            <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
            <div className="phone-screen">
              <CardInfo card={currentCard} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditType;
