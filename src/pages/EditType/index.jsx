import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { BadgePercent, DollarSign, Gift, HelpCircle, Stamp, Ticket } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import { createCard, setCurrentCard, updateCurrentCardField } from '../../store/cardsSlice';

import './styles.css';

const cardTypes = [
  {
    id: 'stamp',
    name: 'Штамп',
    icon: Stamp,
    tag: 'high',
    desc: 'Собирайте визиты — и дарите бонус',
  },
  {
    id: 'discount',
    name: 'Скидка',
    icon: BadgePercent,
    tag: 'high',
    desc: 'Автоматическая скидка по карте',
  },
  {
    id: 'cashback',
    name: 'Кэшбэк',
    icon: DollarSign,
    tag: 'high',
    desc: 'Накопление % от суммы чека',
  },
  {
    id: 'subscription',
    name: 'Абонемент',
    icon: Ticket,
    tag: 'shop',
    desc: 'Фиксированное число посещений',
  },
  {
    id: 'certificate',
    name: 'Подарочный сертификат',
    icon: Gift,
    tag: 'shop',
    desc: 'Карта с фиксированной суммой',
  },
];

const EditType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCard, cards } = useSelector((state) => state.cards);
  const [selectedType, setSelectedType] = useState(currentCard.status || 'stamp');

  useEffect(() => {
    if (!currentCard.id) {
      const newId = cards?.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
      dispatch(setCurrentCard({ id: newId, status: 'stamp', name: 'Штамп' }));
    }
  }, [dispatch, cards, currentCard.id]);

  useEffect(() => {
    if (currentCard.status) {
      setSelectedType(currentCard.status);
    }
  }, [currentCard.status]);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    const cardName = cardTypes.find((type) => type.id === typeId)?.name || 'Карта';
    dispatch(updateCurrentCardField({ path: 'status', value: typeId }));
    dispatch(updateCurrentCardField({ path: 'name', value: cardName }));
  };

  const handleCreateCard = () => {
    if (!selectedType) return;
    navigate(`/cards/${currentCard.id}/edit/settings`);
  };

  const typeContent = (
    <div>
      <h2 className="subtitle">
        Тип карты
        <HelpCircle
          size={16}
          style={{ cursor: 'pointer' }}
          data-tooltip-id="managers-help"
          data-tooltip-html=" Выберите тип карты для дальнейшей настройки"
        />
      </h2>
      <Tooltip id="managers-help" className="custom-tooltip" />
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
              <div className="edit-type-desc">{type.desc}</div>
              <div
                className={`edit-type-tag ${
                  type.tag === 'high' ? 'edit-type-green' : 'edit-type-purple'
                }`}
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
  );

  return <EditLayout>{typeContent}</EditLayout>;
};

export default EditType;
