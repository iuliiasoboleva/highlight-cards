import React from 'react';
import { useSelector } from 'react-redux';

import { Star } from 'lucide-react';

import { getStampIconComponent } from '../../utils/stampIcons';
import { statusConfig } from '../../utils/statusConfig';
import StampGrid from './StampGrid';

import './styles.css';

const CardInfo = ({ card }) => {
  const currentDesign = useSelector((state) => state.cards.currentCard?.design) || {};
  const design = card.design || currentDesign || {};
  const fields = statusConfig[card.status] || [];

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

  const renderFieldValue = (value, { format, suffix }) => {
    return format ? format(value) : `${value}${suffix || ''}`;
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
        {mergedCard.design.logo ? (
          <img src={mergedCard.design.logo} alt="Лого" className="card-info-logo" />
        ) : (
          <p className="card-name">{mergedCard.name}</p>
        )}
        <span className="card-inline-value">
          {fields
            .filter(({ valueKey }) =>
              ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey),
            )
            .map(({ label, valueKey, suffix, format, defaultValue }) => {
              const value = mergedCard[valueKey] ?? defaultValue;
              return (
                <span key={valueKey} className="card-inline-value" title={label}>
                  <span className="inline-label">{label}:</span>{' '}
                  {renderFieldValue(value, { format, suffix })}
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
          <img className="card-info-main-img" src={mergedCard.cardImg} alt="Card background" />
        ) : (
          <div className="card-background" />
        )}

        {(card.status === 'subscription' || card.status === 'stamp') && (
          <div
            className="stamp-overlay"
            style={{ backgroundImage: `url(${mergedCard.design.stampBackground})` }}
          >
            <StampGrid
              totalStamps={mergedCard.stampsQuantity}
              activeStamps={card.stamps || 0}
              ActiveIcon={ActiveIcon}
              InactiveIcon={InactiveIcon}
              activeImage={activeStampImage}
              inactiveImage={inactiveStampImage}
            />
          </div>
        )}
      </div>

      <div className="card-info-header">
        {fields.map(({ label, valueKey, suffix = '', defaultValue = '', format }) => {
          const value = mergedCard[valueKey] ?? defaultValue;
          const shouldShowNoData = valueKey === 'restStamps' && value <= 0;

          return (
            !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey) && (
              <div key={valueKey} className="card-info-row">
                <p className="card-info-row-label" title={label}>
                  {label}:
                </p>
                <span>
                  {shouldShowNoData ? 'НЕТ ДАННЫХ' : renderFieldValue(value, { format, suffix })}
                </span>
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
