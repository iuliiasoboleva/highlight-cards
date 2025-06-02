import React from 'react';
import { useSelector } from 'react-redux';

import { Star } from 'lucide-react';

import { getStampIconComponent } from '../../utils/stampIcons';
import StampGrid from './StampGrid';

import './styles.css';

const CardInfo = ({ card }) => {
  const currentFields = useSelector((state) => state.cards.currentCard?.fieldsName) || [];
  const currentDesign = useSelector((state) => state.cards.currentCard?.design) || {};
  const design = card.design || currentDesign || {};
  const fields = card.fieldsName || currentFields || [];

  const stampsQuantity = design?.stampsQuantity || 0;
  const activeStamp = design?.activeStamp || Star;
  const inactiveStamp = design?.inactiveStamp || Star;
  const activeStampImage = design?.activeStampImage || null;
  const inactiveStampImage = design?.inactiveStampImage || null;

  const ActiveIcon = getStampIconComponent(activeStamp);
  const InactiveIcon = getStampIconComponent(inactiveStamp);

  const restStamps =
    card.status === 'stamp' ? (design?.stampsQuantity || 10) - (card.stamps || 0) : 0;

  const mergedCard = {
    ...card,
    restStamps,
    cardImg: design?.background || card.cardImg,
    ...design?.colors,
    stampsQuantity,
  };

  const renderFieldValue = (value, { type }) => {
    if (value === undefined || value === null) return 'НЕТ ДАННЫХ';
    if (type === 'restStamps' && value <= 0) return 'НЕТ ДАННЫХ';
    return value;
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
        {design.logo ? (
          <img src={design.logo} alt="Лого" className="card-info-logo" />
        ) : (
          <p className="card-name">{mergedCard.name}</p>
        )}
        <span className="card-inline-value">
          {fields
            .filter(({ type }) =>
              ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(type),
            )
            .map(({ name, type }) => {
              const value = mergedCard[type];
              return (
                <span key={type} className="card-inline-value" title={name}>
                  <span className="inline-label">{name}:</span> {renderFieldValue(value, { type })}
                </span>
              );
            })}
        </span>
      </div>

      <div className="card-info-main-img-wrapper">
        {mergedCard.cardImg || design.stampBackground ? (
          <img
            className="card-info-main-img"
            src={mergedCard.cardImg || design.stampBackground}
            alt="Card background"
          />
        ) : (
          <div
            className="card-background"
            style={{
              backgroundColor: mergedCard.stampBackgroundColor,
            }}
          />
        )}

        {(card.status === 'subscription' || card.status === 'stamp') && (
          <div
            className="stamp-overlay"
            style={{ backgroundImage: `url(${design.stampBackground})` }}
          >
            <StampGrid
              totalStamps={mergedCard.stampsQuantity}
              activeStamps={card.stamps || 0}
              ActiveIcon={ActiveIcon}
              InactiveIcon={InactiveIcon}
              activeImage={activeStampImage}
              inactiveImage={inactiveStampImage}
              activeColor={mergedCard.activeStampColor}
              inactiveColor={mergedCard.inactiveStampColor}
              borderColor={mergedCard.borderColor}
              stampColor={mergedCard.stampColor}
            />
          </div>
        )}
      </div>

      <div className="card-info-header">
        {fields
          .filter(
            ({ type }) =>
              type && !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(type),
          )
          .map(({ type, name }) => {
            const value = mergedCard[type];
            return (
              <div key={type} className="card-info-row">
                <p className="card-info-row-label" title={name}>
                  {name}:
                </p>
                <span>{renderFieldValue(value, { type })}</span>
              </div>
            );
          })}
      </div>

      {card.qrImg && <img className="card-info-qr-img" src={card.qrImg} alt="QR код" />}
    </div>
  );
};

export default CardInfo;
