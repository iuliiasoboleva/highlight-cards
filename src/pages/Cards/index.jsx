import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Loader2 } from 'lucide-react';

import CardButtons from '../../components/CardButtons';
import CardInfo from '../../components/CardInfo';

import './styles.css';

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

  const cardsState = useSelector((state) => state.cards);
  const { cards, loading } = cardsState;
  const isTemplatePage = location.pathname === '/cards/template';

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
      <h2>Создайте свою карту лояльности</h2>
      <p className="page-subtitle">
        Выберите тип карты, который лучше всего подходит вашему бизнесу и настройте её за несколько
        минут. После выбора вы сможете настроить логотип, цвета и правила начисления баллов.
      </p>
      <div className="cards">
        {cards.map((card) => (
          <div key={card.id} className={`card ${card.isActive ? 'active' : 'inactive'}`}>
            {!isTemplatePage && (
              <div className="card-state">
                <span className={`status-indicator ${card.isActive ? 'active' : 'inactive'}`} />
                {card.title}
              </div>
            )}
            <div className="card-image-block">
              <img className="card-image" src={card.frameUrl} alt={card.name} />
              {card.id !== 'fixed' && <CardInfo card={card} />}
            </div>
            <div className="card-bottom">
              <div className="card-bottom-text">
                <h3>{card.name}</h3>
                {/* <p>Вы можете отредактировать настройки карты или обновить дизайн</p> */}
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
