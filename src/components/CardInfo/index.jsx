import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { HelpCircle, Star } from 'lucide-react';

import { getStampIconComponent } from '../../utils/stampIcons';
import { statusConfig } from '../../utils/statusConfig';
import StampGrid from './StampGrid';

import './styles.css';

const CardInfo = ({ card, setShowInfo, onFieldClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();
  const cardId = card.id || urlId;
  const currentFields = useSelector((state) => state.cards.currentCard?.fieldsName) || [];
  const currentDesign = useSelector((state) => state.cards.currentCard?.design) || {};

  const toggleInfo = () => {
    if (typeof setShowInfo === 'function') {
      setShowInfo((prev) => !prev);
    }
  };

  const handleFieldClick = (type) => {
    // карта маршрутов
    const navMap = {
      expirationDate: { step: 'settings', flashKey: 'cardFixedDate' },
      restStamps: { step: 'design', flashKey: 'stampsQuantity' },
    };

    const target = navMap[type];

    if (target && cardId) {
      const stepPath = `/cards/${cardId}/edit/${target.step}`;
      // если уже на нужном шаге и есть onFieldClick -> подсветка
      if (location.pathname.startsWith(stepPath) && onFieldClick) {
        onFieldClick(target.flashKey);
      } else {
        navigate(stepPath, { state: { flashKey: target.flashKey } });
      }
      return;
    }

    // если явной навигации нет, но есть локальный onFieldClick
    if (onFieldClick) {
      const fallbackKey = { restStamps: 'stampsQuantity' }[type] || type;
      onFieldClick(fallbackKey);
    }
  };

  const design = card.design || currentDesign || {};
  const fields = card.fieldsName || currentFields || [];

  const stampsQuantity = typeof design?.stampsQuantity === 'number' ? design.stampsQuantity : 10;

  const activeStampImage = design?.activeStampImage || null;
  const inactiveStampImage = design?.inactiveStampImage || null;

  const normalizeIcon = (icon) => {
    const component = typeof icon === 'string' ? getStampIconComponent(icon) : icon;
    return component ?? Star;
  };

  const ActiveIcon = normalizeIcon(design?.activeStamp || 'Star');
  const InactiveIcon = normalizeIcon(design?.inactiveStamp || 'Star');

  const defaultInactiveColor = '#C4C4C4';
  const effectiveInactiveColor =
    !design?.inactiveStampColor || /^#?fff?f?f?$/i.test(design?.inactiveStampColor)
      ? defaultInactiveColor
      : design?.inactiveStampColor;

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

    const cfg = (statusConfig[card.status] || []).find((c) => c.valueKey === type);
    if (cfg) {
      if (cfg.format) return cfg.format(value);
      if (cfg.suffix) return `${value} ${cfg.suffix}`.trim();
    }

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
        <div className="card-info-title-row">
          {design.logo ? (
            <img src={design.logo} alt="Лого" className="card-info-logo" />
          ) : (
            <p className="card-name">{mergedCard.name}</p>
          )}
          <HelpCircle
            size={20}
            onClick={toggleInfo}
            className="info-button"
            style={{ cursor: 'pointer' }}
          />
        </div>
        <span className="card-inline-value">
          {fields
            .filter(({ type }) =>
              ['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(type),
            )
            .map(({ name, type }) => {
              const value = mergedCard[type];
              return (
                <span
                  key={type}
                  className="card-inline-value"
                  title={name}
                  style={{ cursor: onFieldClick ? 'pointer' : 'default' }}
                  onClick={() => handleFieldClick(type)}
                >
                  <span className="inline-label">{name}:</span> {renderFieldValue(value, { type })}
                </span>
              );
            })}
        </span>
      </div>

      <div className="card-info-main-img-wrapper">
        {design.stampBackground || mergedCard.cardImg ? (
          <img
            className="card-info-main-img"
            src={design.stampBackground || mergedCard.cardImg}
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
              activeStamps={typeof card.stamps === 'number' ? card.stamps : 0}
              ActiveIcon={ActiveIcon}
              InactiveIcon={InactiveIcon}
              activeImage={activeStampImage}
              inactiveImage={inactiveStampImage}
              activeColor={mergedCard.activeStampColor}
              inactiveColor={effectiveInactiveColor}
              borderColor={mergedCard.borderColor}
              activeStampBgColor={mergedCard.activeStampBgColor}
              inactiveStampBgColor={mergedCard.inactiveStampBgColor}
            />
          </div>
        )}
      </div>

      <div className="card-info-footer">
        {fields
          .filter(
            ({ type }) =>
              type && !['balanceMoney', 'credits', 'balance', 'expirationDate'].includes(type),
          )
          .map(({ type, name }) => {
            const value = mergedCard[type];
            return (
              <div
                key={type}
                className="card-info-row"
                style={{ cursor: onFieldClick ? 'pointer' : 'default' }}
                onClick={() => handleFieldClick(type)}
              >
                <p className="card-info-row-label" title={name}>
                  {name}
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
