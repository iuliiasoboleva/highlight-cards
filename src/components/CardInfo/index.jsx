import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { STATUS_CONFIG } from './defaultCardInfo';
import './styles.css';

const CardInfo = ({ card }) => {
  const design = useSelector((state) => state.cards.currentCard?.design) || {};
  const fields = STATUS_CONFIG[card.status] || [];

  const stampsQuantity = design?.stampsQuantity || 0;
  const stampIcon = design?.stampIcon || faStar;
  const restStamps = card.status === 'stamp' ? (design?.stampsQuantity || 10) - (card.stamps || 0) : 0;

  const barcodeImage = card.settings?.barcodeType === 'pdf417' ? card.pdfImg : card.qrImg;

  const mergedCard = {
    ...card,
    restStamps,
    cardImg: design?.background || card.cardImg,
    ...design?.colors,
    stampsQuantity,
    stampIcon
  };

  const renderFieldValue = (value, { format, suffix }) => {
    return format ? format(value) : `${value}${suffix || ''}`;
  };

  const renderStamps = () => {
    const totalStamps = mergedCard.stampsQuantity || 10;
    const activeStamps = card.stamps || 0;
    const rows = Math.ceil(totalStamps / 5);
    
    return (
      <div className="stamp-container">
        {[...Array(rows)].map((_, rowIndex) => (
          <div className="stamp-row" key={`row-${rowIndex}`}>
            {[...Array(5)].map((_, stampIndex) => {
              const stampNumber = rowIndex * 5 + stampIndex;
              if (stampNumber >= totalStamps) return null;
              
              return (
                <FontAwesomeIcon
                  key={`stamp-${stampNumber}`}
                  icon={stampIcon}
                  style={{
                    color: stampNumber < activeStamps ? "black" : "gray",
                  }}
                />
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
      <div
        className="card-info-header"
        style={{
          backgroundColor: mergedCard.centerBackground,
        }}
      >
        <p className="card-name">
          {mergedCard.name}
        </p>
        {fields
          .filter(({ valueKey }) =>
            ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey)
          )
          .map(({ label, valueKey, suffix, format, defaultValue }) => {
            const value = mergedCard[valueKey] ?? defaultValue;
            return value ? (
              <span key={valueKey} className="card-inline-value" title={label}>
                <span className="inline-label">{label}:</span>{' '}
                {renderFieldValue(value, { format, suffix })}
              </span>
            ) : null;
          })}
      </div>

      {(card.status === 'subscription' || card.status === 'stamp') ? (
        renderStamps()
      ) : (
        mergedCard.cardImg
          ? <img
            className="card-info-main-img"
            src={mergedCard.cardImg}
            alt="Card background"
            style={{
              backgroundColor: mergedCard.centerBackground,
            }}
          />
          : <div className='card-background'>
            Фоновое изображение
          </div>
      )}

      <div
        className="card-info-header"
        style={{
          backgroundColor: mergedCard.centerBackground,
        }}
      >
        {fields.map(({ label, valueKey, suffix = '', defaultValue = '', format }) => {
          const value = mergedCard[valueKey] ?? defaultValue;

          return (
            !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(valueKey) &&
            value && (
              <div key={valueKey} className="card-info-row">
                <p className="card-info-row-label" title={label}>
                  {label}:
                </p>
                <p>
                  {renderFieldValue(value, { format, suffix })}
                </p>
              </div>
            )
          );
        })}
      </div>

      <img
        className="card-info-qr-img"
        src={barcodeImage}
        alt={card.barcodeType === 'pdf417' ? 'PDF код' : 'QR код'}
      />
      <p className="card-details">Tap ••• for details</p>
    </div>
  );
};

export default CardInfo;