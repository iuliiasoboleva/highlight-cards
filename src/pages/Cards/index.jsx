import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import CardButtons from '../../components/CardButtons';
import CardInfo from '../../components/CardInfo';
import { initializeCards } from '../../store/cardsSlice';

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
  const dispatch = useDispatch();
  const location = useLocation();

  const cards = useSelector((state) => state.cards.cards);

  const isTemplatePage = location.pathname === '/cards/template';

  useEffect(() => {
    let useTemplates = false;

    if (isTemplatePage) {
      useTemplates = true;
    }

    dispatch(initializeCards({ useTemplates }));
  }, [dispatch, isTemplatePage]);

  return (
    <div className="mailings-container">
      <h2 className="page-title">Создайте свою карту лояльности</h2>
      <p>
        Выберите тип карты, который лучше всего подходит вашему бизнесу и настройте её за несколько
        минут. После выбора вы сможете настроить логотип, цвета и правила начисления баллов.
      </p>
      <div className="cards">
        {cards.map((card) => (
          <div key={card.id}>
            <div className="card-image-block">
              <img className="card-image" src={card.frameUrl} alt={card.name} />
              {card.id !== 'fixed' && <CardInfo card={card} />}
            </div>
            <div className="card-bottom">
              <div className="card-bottom-text">
                <h2>{card.name}</h2>
                <p>Вы можете отредактировать настройки карты или обновить дизайн</p>
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
