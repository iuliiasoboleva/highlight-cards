import React from 'react';

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
  const fields = STATUS_CONFIG[card.status] || [];

  const renderInlineValues = () => {
    const inlineFields = fields.filter(({ valueKey }) =>
      ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey),
    );

    return inlineFields.map(({ label, valueKey, suffix = '', defaultValue = '' }) => {
      const value = card[valueKey] ?? defaultValue;

      const shortLabel = label.length > 15 ? `${label.slice(0, 15)}...` : label;

      return value ? (
        <span key={valueKey} className="card-inline-value" title={label}>
          <span className="inline-label">{shortLabel}:</span> {value}
          {suffix}
        </span>
      ) : null;
    });
  };

  return (
    <div className="card-info">
      <div className="card-info-header">
        <p className="card-name">
          {card.name.length > 15 ? `${card.name.slice(0, 15)}...` : card.name}
        </p>
        <div className="card-inline-values">{renderInlineValues()}</div>
      </div>

      <img className="card-info-main-img" src={card.cardImg} alt="Card background" />

      <div className="card-info-header">
        {fields.map(({ label, valueKey, suffix = '', defaultValue = '' }) => {
          const value = card[valueKey] ?? defaultValue;

          const shortLabel = label.length > 15 ? `${label.slice(0, 15)}...` : label;

          return (
            !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey) &&
            value && (
              <div key={valueKey} className="card-info-row">
                <p className="card-info-row-label" title={label}>
                  {shortLabel}:
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

      <img className="card-info-qr-img" src={card.pdfImg} alt="QR scanner" />
      <p className="card-details">Tap ••• for details</p>
    </div>
  );
};

export default CardInfo;
