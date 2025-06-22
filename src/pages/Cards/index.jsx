import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { GripVertical } from 'lucide-react';

import { HelpCircle, Loader2, Check } from 'lucide-react';

import CardButtons from '../../components/CardButtons';
import CardInfo from '../../components/CardInfo';

import './styles.css';
import { renameCardAsync, reorderCards, saveOrder } from '../../store/cardsSlice';

const cardDescriptions = {
  discount: {
    title: 'Скидочная карта',
    text: 'Постоянная скидка для ваших клиентов. Клиент предъявляет карту — получает фиксированную скидку на каждый заказ.',
  },
  stamp: {
    title: 'Штампы',
    text: 'Клиент собирает виртуальные штампы за покупки и получает подарок. При регистрации он сразу получает 2 штампа: за регистрацию и первый визит — чтобы быстрее почувствовать прогресс.',
  },
  cashback: {
    title: 'Кэшбэк',
    text: 'Часть суммы каждой покупки возвращается клиенту в виде баллов. Баллами можно оплатить будущие заказы.',
  },
  subscription: {
    title: 'Абонемент (клубная карта)',
    text: 'Карта с доступом к специальным условиям или ограниченным числом посещений. Можно настроить "пакеты услуг" или "уровни клиента".',
  },
  certificate: {
    title: 'Подарочный сертификат',
    text: '',
  },
};

const Cards = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [editingId, setEditingId] = React.useState(null);
  const [newName, setNewName] = React.useState('');
  const [dragIndex, setDragIndex] = React.useState(null);

  const cardsState = useSelector((state) => state.cards);
  const { cards, loading } = cardsState;
  const isTemplatePage = location.pathname === '/cards/template';

  const cardsRef = React.useRef(cards);
  React.useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  React.useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('cards_order') || '[]');
    if (savedOrder.length) {
      const ordered = [cards[0], ...savedOrder
        .map((id) => cards.find((c) => c.id === id))
        .filter(Boolean)
        .filter((c) => c.id !== 'fixed')];
      if (ordered.length === cards.length - 1) {
        dispatch(reorderCards([cards[0], ...ordered]));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 200px)',
        }}
      >
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <div className="mailings-container">
      <h2 className="subtitle">
        Создайте свою карту лояльности
        <HelpCircle
          size={16}
          style={{ cursor: 'pointer' }}
          data-tooltip-id="managers-help"
          data-tooltip-html=" Выберите тип карты, который лучше всего подходит вашему бизнесу и настройте её за несколько
        минут. После выбора вы сможете настроить логотип, цвета и правила начисления баллов."
        />
      </h2>
      <Tooltip id="managers-help" className="custom-tooltip" />
      <div className="cards">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`card ${card.isActive ? 'active' : 'inactive'}`}
            draggable={card.id !== 'fixed'}
            onDragStart={(e) => {
              setDragIndex(idx);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnter={(e) => e.preventDefault()}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIndex === null || dragIndex === idx) return;
              const updated = [...cardsRef.current];
              const item = updated[dragIndex];
              updated.splice(dragIndex, 1);
              updated.splice(idx, 0, item);
              dispatch(reorderCards(updated));
              setDragIndex(idx);
            }}
            onDrop={() => {
              const ids = cardsRef.current.slice(1).map((c) => c.id);
              localStorage.setItem('cards_order', JSON.stringify(ids));
              dispatch(saveOrder(ids));
              setDragIndex(null);
            }}
          >
            {!isTemplatePage && (
              <div className="card-state">
                <span className={`status-indicator ${card.isActive ? 'active' : 'inactive'}`} />
                {card.title}
              </div>
            )}
            <div className="card-image-block">
              {card.id !== 'fixed' && <GripVertical className="card-drag-handle" />}
              <img className="card-image" src={card.frameUrl} alt={card.name} />
              {card.id !== 'fixed' && <CardInfo card={card} />}
            </div>
            <div className="card-bottom">
              <div className="card-bottom-text">
                {editingId === card.id ? (
                  <div className="card-name-edit">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => {
                        if (newName.trim() && newName !== card.name) {
                          dispatch(renameCardAsync({ id: card.id, name: newName.trim() }));
                        }
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (newName.trim() && newName !== card.name) {
                            dispatch(renameCardAsync({ id: card.id, name: newName.trim() }));
                          }
                          setEditingId(null);
                        }
                      }}
                      autoFocus
                      className="card-name-input"
                    />
                    <button
                      className="card-name-save-btn"
                      onClick={() => {
                        if (newName.trim() && newName !== card.name) {
                          dispatch(renameCardAsync({ id: card.id, name: newName.trim() }));
                        }
                        setEditingId(null);
                      }}
                    >
                      <Check size={18} />
                    </button>
                  </div>
                ) : (
                  <h3 onClick={() => {
                    setEditingId(card.id);
                    setNewName(card.name);
                  }} style={{ cursor: 'pointer' }}>
                    {card.name}
                  </h3>
                )}
              </div>
              <CardButtons isFixed={card.id === 'fixed'} cardId={card.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
