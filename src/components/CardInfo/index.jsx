import React from 'react';
import { useSelector } from 'react-redux';

import { Star } from 'lucide-react';

import { STATUS_CONFIG } from '../defaultCardInfo';

import './styles.css';

const CardInfo = ({ card }) => {
  const currentDesign = useSelector((state) => state.cards.currentCard?.design) || {};
  const design = card.design || currentDesign || {};
  const fields = STATUS_CONFIG[card.status] || [];

  const stampsQuantity = design?.stampsQuantity || 0;
  const stampIcon = design?.stampIcon || card.stampIcon || Star;
  const restStamps =
    card.status === 'stamp' ? (design?.stampsQuantity || 10) - (card.stamps || 0) : 0;

  const mergedCard = {
    ...card,
    restStamps,
    cardImg: design?.background || card.cardImg,
    ...design?.colors,
    stampsQuantity,
    stampIcon,
  };

  const renderFieldValue = (value, { format, suffix }) => {
    return format ? format(value) : `${value}${suffix || ''}`;
  };

  const renderStamps = () => {
    const activeStamps = card.stamps || 0;
    const IconComponent = stampIcon;

    return (
      <div className="stamp-container">
        {[0, 1].map((rowIndex) => (
          <div className="stamp-row" key={`row-${rowIndex}`}>
            {[0, 1, 2, 3, 4].map((colIndex) => {
              const stampNumber = rowIndex * 5 + colIndex;

              return (
                <div key={`stamp-${stampNumber}`} style={{ backgroundColor: mergedCard.stampIconBackground }}>
                  <IconComponent
                    size={24}
                    strokeWidth={2}
                    color={stampNumber < activeStamps ? 'black' : mergedCard.iconColor || 'gray'}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="card-info"
      style={{
        backgroundColor: mergedCard.cardBackground,
        color: mergedCard.textColor,
      }}
    >
      <div className="card-info-header">
        <p className="card-name">{mergedCard.name}</p>
        <span className="card-inline-value">

          {fields
            .filter(({ valueKey }) =>
              ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey),
            )
            .map(({ label, valueKey, suffix, format, defaultValue }) => {
              const value = mergedCard[valueKey] ?? defaultValue;
              return (
                <span key={valueKey} className="card-inline-value" title={label}>
                <span className="inline-label">{label}:</span>{ ' ' }
              { renderFieldValue(value, { format, suffix }) }
              </span>
            );
          })}
        </span>

      </div>

      <div
        className="card-info-main-img-wrapper"
        style={{ backgroundColor: mergedCard.centerBackground }}
      >
        {mergedCard.cardImg ? (
          <img
            className="card-info-main-img"
            src={mergedCard.cardImg}
            alt="Card background"
          />
        ) : (
          <div className="card-background" />
        )}

        {(card.status === 'subscription' || card.status === 'stamp') && (
          <div className="stamp-overlay">
            {renderStamps()}
          </div>
        )}
      </div>

      <div className="card-info-header">
        {fields.map(({ label, valueKey, suffix = '', defaultValue = '', format }) => {
          const value = mergedCard[valueKey] ?? defaultValue;
          const shouldShowNoData = valueKey === 'restStamps' && value <= 0;

          return (
            !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey) &&
            (
              <div key={valueKey} className="card-info-row">
                <p className="card-info-row-label" title={label}>
                  {label}:
                </p>
                <span>{shouldShowNoData ? 'НЕТ ДАННЫХ' : renderFieldValue(value, { format, suffix })}</span>
              </div>
            )
          );
        })}
      </div>

      {card.qrImg && <img className="card-info-qr-img" src={card.qrImg} alt={'QR код'} />}
    </div>
  );
};

export default CardInfo;
