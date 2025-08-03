import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';
import { Star } from 'lucide-react';

import { getStampIconComponent } from '../../utils/stampIcons';
import { cardTypeDescriptions, statusConfig } from '../../utils/statusConfig';
import StampGrid from '../CardInfo/StampGrid';

import './styles.css';

const CardInfoAndroid = ({ card, setShowInfo, onFieldClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();
  const cardId = card.id || urlId;
  const currentFields = useSelector((state) => state.cards.currentCard?.fieldsName) || [];
  const currentDesign = useSelector((state) => state.cards.currentCard?.design) || {};

  const handleGenerateWalletImage = async () => {
    const cardElement = document.querySelector('.card-info-main-img-wrapper');
    if (!cardElement) return;

    const canvas = await html2canvas(cardElement, {
      scale: 2,
    });

    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'wallet-card-preview.png';
    link.click();
  };

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

  const defaultInactiveColor = '#CDCDCD';
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
    if (value === undefined || value === null) {
      // Используем walletLabels из настроек карты
      const walletLabels = card.settings?.walletLabels || {};
      return walletLabels.noData || 'НЕТ ДАННЫХ';
    }
    if (type === 'restStamps' && value <= 0) {
      const walletLabels = card.settings?.walletLabels || {};
      return walletLabels.noData || 'НЕТ ДАННЫХ';
    }

    // Используем walletLabels для форматирования
    const walletLabels = card.settings?.walletLabels || {};

    if (type === 'restStamps') {
      const stampsWord = walletLabels.stampsWord || 'штампов';
      return `${value} ${stampsWord}`;
    }

    if (type === 'rewards') {
      return `${value} наград`;
    }

    const cfg = (statusConfig[card.status] || []).find((c) => c.valueKey === type);
    if (cfg) {
      if (cfg.format) return cfg.format(value);
      if (cfg.suffix) return `${value} ${cfg.suffix}`.trim();
    }

    return value;
  };

  const getFieldLabel = (type, defaultName) => {
    const walletLabels = card.settings?.walletLabels || {};

    // Маппинг типов полей на walletLabels
    const labelMap = {
      restStamps: walletLabels.toReward || 'До награды',
      rewards: walletLabels.rewards || 'Доступные награды',
      expirationDate: walletLabels.expire || 'Срок действия',
    };

    return labelMap[type] || defaultName;
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
        <div className="card-info-title-row android">
          <div>
            {design.logo ? (
              <img src={design.logo} alt="Лого" className="card-info-logo" draggable="false" />
            ) : (
              <p className="card-name">{mergedCard.name}</p>
            )}
          </div>
          <div className="top-fields-block">
            {fields
              .filter(({ type }) =>
                [
                  'balanceMoney',
                  'credits',
                  'balance',
                  'discountPercent',
                  'discountStatus',
                  'restStamps',
                  'score',
                ].includes(type),
              )
              .map(({ name, type }) => {
                const value = mergedCard[type];
                const fieldLabel = getFieldLabel(type, name);
                return (
                  <span
                    key={type}
                    className="card-inline-value top"
                    title={fieldLabel}
                    style={{ cursor: onFieldClick ? 'pointer' : 'default' }}
                    onClick={() => handleFieldClick(type)}
                  >
                    <span className="inline-label">{fieldLabel}:</span>{' '}
                    {renderFieldValue(value, { type })}
                  </span>
                );
              })}
          </div>
        </div>
        {cardTypeDescriptions[card.status] && (
          <p className="card-type-description">{cardTypeDescriptions[card.status]}</p>
        )}
      </div>
      <div className="card-info-footer">
        {fields
          .filter(
            ({ type }) =>
              type &&
              ![
                'balanceMoney',
                'credits',
                'balance',
                'expirationDate',
                'restStamps',
                'discountStatus',
                'discountPercent',
                'score',
              ].includes(type),
          )
          .map(({ type, name }) => {
            const value = mergedCard[type];
            const fieldLabel = getFieldLabel(type, name);
            return (
              <div
                key={type}
                className="card-info-row"
                style={{ cursor: onFieldClick ? 'pointer' : 'default' }}
                onClick={() => handleFieldClick(type)}
              >
                <p className="card-info-row-label" title={fieldLabel}>
                  {fieldLabel}
                </p>
                <span>{renderFieldValue(value, { type })}</span>
              </div>
            );
          })}
      </div>

      {card.qrImg && (
        <>
          <img className="card-info-qr-img" src={card.qrImg} alt="QR код" />
        </>
      )}

      {/* Номер карты (макет) */}
      {(() => {
        const rawNumber = card.serialNumber || '000001';
        const formatted = String(rawNumber).replace(/(\d{3})(\d{3})/, '$1 $2');
        return <p className="card-number">{formatted}</p>;
      })()}

      <div className="card-info-main-img-wrapper">
        {design.stampBackground || mergedCard.cardImg ? (
          <img
            className="card-info-main-img"
            src={design.stampBackground || mergedCard.cardImg}
            alt="Card background"
            draggable="false"
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
      <button className="info-text-button" onClick={toggleInfo}>
        Сведения
      </button>
    </div>
  );
};

export default CardInfoAndroid;
