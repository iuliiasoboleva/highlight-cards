import React from 'react';
import { useSelector } from 'react-redux';

import './styles.css';

const STATUS_CONFIG = {
  certificate: [
    { label: 'Баланс', valueKey: 'balanceMoney', suffix: '₽' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  cashback: [
    { label: 'Баллы', valueKey: 'credits', suffix: '₽' },
    {
      label: 'Текущий процент кешбэка',
      valueKey: 'cashbackPercent',
      suffix: '%',
    },
    { label: 'Текущий статус кешбэка', valueKey: 'cashbackStatus' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  subscription: [
    { label: 'Текущее количество баллов', valueKey: 'score' },
    { label: 'Общее количество визитов', valueKey: 'visitsCount' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  club: [
    { label: 'Уровень клубной карты', valueKey: 'cardLevel', suffix: '' },
    { label: 'Доступный лимит', valueKey: 'visitsCount', suffix: ' визиты' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  reward: [
    { label: 'Баланс', valueKey: 'balance' },
    {
      label: 'Текущий уровень',
      valueKey: 'currentLevel',
      defaultValue: 'Нет данных',
    },
    { label: 'До следующей награды', valueKey: 'untilNextReward' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  stamp: [
    {
      label: 'До получения награды',
      valueKey: 'restStamps',
      suffix: ' штампов',
    },
    { label: 'Доступно наград', valueKey: 'stamps', suffix: ' награды' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
  coupon: [
    { label: 'Скидка на первый визит', valueKey: 'firstVisitDiscount' },
    { label: 'Срок действия', valueKey: 'expirationDate' },
  ],
};

const CardInfo = ({ card }) => {
  const design = useSelector((state) => state.cards.currentCard?.design);
  const fields = STATUS_CONFIG[card.status] || [];

  const mergedCard = {
    ...card,
    cardImg: design?.background || card.cardImg,
    ...design?.colors,
  };

  const renderInlineValues = () => {
    const inlineFields = fields.filter(({ valueKey }) =>
      ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey),
    );

    return inlineFields.map(({ label, valueKey, suffix = '', defaultValue = '' }) => {
      const value = mergedCard[valueKey] ?? defaultValue;

      return value ? (
        <span key={valueKey} className="card-inline-value" title={label}>
          <span className="inline-label">{label}:</span> {value}
          {suffix}
        </span>
      ) : null;
    });
  };

  return (
    <div
      className="card-info"
      style={{
        backgroundColor: mergedCard.cardBackground,
        color: mergedCard.textColor,
      }}
    >
      <div
        className="card-info-header"
        style={{
          backgroundColor: mergedCard.centerBackground,
        }}
      >
        <p className="card-name">
          {mergedCard.name.length > 15 ? `${mergedCard.name.slice(0, 15)}...` : mergedCard.name}
        </p>
        <div className="card-inline-values">{renderInlineValues()}</div>
      </div>

      <img
        className="card-info-main-img"
        src={mergedCard.cardImg}
        alt="Card background"
        style={{
          backgroundColor: mergedCard.centerBackground,
        }}
      />

      <div
        className="card-info-header"
        style={{
          backgroundColor: mergedCard.centerBackground,
        }}
      >
        {fields.map(({ label, valueKey, suffix = '', defaultValue = '' }) => {
          const value = mergedCard[valueKey] ?? defaultValue;

          return (
            !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey) &&
            value && (
              <div key={valueKey} className="card-info-row">
                <p className="card-info-row-label" title={label}>
                  {label}:
                </p>
                <p>
                  {value}
                  {suffix}
                </p>
              </div>
            )
          );
        })}
      </div>

      <img className="card-info-qr-img" src={mergedCard.pdfImg} alt="QR scanner" />
      <p className="card-details">Tap ••• for details</p>
    </div>
  );
};

export default CardInfo;
