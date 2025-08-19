import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import html2canvas from 'html2canvas';
import { HelpCircle, Star } from 'lucide-react';

import { getStampIconComponent } from '../../utils/stampIcons';
import { statusConfig } from '../../utils/statusConfig';
import StampGrid from './StampGrid';
import {
  CardBackground,
  CardInfo as CardBox,
  CardInfoFooter,
  CardInfoHeader,
  CardInfoLogo,
  CardInfoMainImg,
  CardInfoMainImgWrapper,
  CardInfoQrImg,
  CardInfoRow,
  CardInfoRowLabel,
  CardInfoRowValue,
  CardInfoTitleRow,
  CardInlineValue,
  CardName,
  CardNumber,
  HiZone,
  InfoButton,
  StampOverlay,
  TopFieldsBlock,
} from './styles';

const CardInfo = ({ card, setShowInfo, onFieldClick, hoverDesignKey, mainImgRef }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlId } = useParams();
  const cardId = card.id || urlId;

  const currentFields = useSelector((s) => s.cards.currentCard?.fieldsName) || [];
  const currentDesign = useSelector((s) => s.cards.currentCard?.design) || {};

  const isHover = (k) => hoverDesignKey === k;

  const toggleInfo = () => {
    if (typeof setShowInfo === 'function') setShowInfo((p) => !p);
  };

  const handleFieldClick = (type) => {
    const navMap = {
      expirationDate: { step: 'settings', flashKey: 'cardFixedDate' },
      restStamps: { step: 'design', flashKey: 'stampsQuantity' },
      stampIcons: { step: 'design', flashKey: 'activeStamp' },
    };
    const target = navMap[type];

    if (target && cardId) {
      const stepPath = `/cards/${cardId}/edit/${target.step}`;
      if (location.pathname.startsWith(stepPath) && onFieldClick) {
        onFieldClick(target.flashKey);
      } else {
        navigate(stepPath, { state: { flashKey: target.flashKey } });
      }
      return;
    }
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
    const Cmp = typeof icon === 'string' ? getStampIconComponent(icon) : icon;
    return Cmp ?? Star;
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
      const wl = card.settings?.walletLabels || {};
      return wl.noData || 'НЕТ ДАННЫХ';
    }
    if (type === 'restStamps' && value <= 0) {
      const wl = card.settings?.walletLabels || {};
      return wl.noData || 'НЕТ ДАННЫХ';
    }

    const wl = card.settings?.walletLabels || {};

    if (type === 'restStamps') {
      const word = wl.stampsWord || 'штампов';
      return `${value} ${word}`;
    }

    if (type === 'rewards') return `${value} наград`;

    const cfg = (statusConfig[card.status] || []).find((c) => c.valueKey === type);
    if (cfg) {
      if (cfg.format) return cfg.format(value);
      if (cfg.suffix) return `${value} ${cfg.suffix}`.trim();
    }
    return value;
  };

  const getFieldLabel = (type, defaultName) => {
    const wl = card.settings?.walletLabels || {};
    const map = {
      restStamps: wl.toReward || 'До награды',
      rewards: wl.rewards || 'Доступные награды',
      expirationDate: wl.expire || 'Срок действия',
    };
    return map[type] || defaultName;
  };

  // --- RENDER ---
  const HeaderBlock = (
    <CardInfoHeader>
      <CardInfoTitleRow>
        <div>
          {design.logo ? (
            <CardInfoLogo src={design.logo} alt="Лого" draggable="false" />
          ) : (
            <CardName>{mergedCard.name}</CardName>
          )}
        </div>

        <TopFieldsBlock>
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
                <CardInlineValue
                  key={type}
                  className="top"
                  title={fieldLabel}
                  style={{ cursor: onFieldClick ? 'pointer' : 'default' }}
                  onClick={() => handleFieldClick(type)}
                >
                  <span>{fieldLabel}:</span> {renderFieldValue(value, { type })}
                </CardInlineValue>
              );
            })}
        </TopFieldsBlock>
      </CardInfoTitleRow>
    </CardInfoHeader>
  );

  const FooterBlock = (
    <CardInfoFooter>
      {fields
        .filter(
          ({ type }) =>
            type &&
            ![
              'balanceMoney',
              'credits',
              'balance',
              'discountPercent',
              'discountStatus',
              'restStamps',
              'score',
            ].includes(type),
        )
        .map(({ type, name }) => {
          const value = mergedCard[type];
          const fieldLabel = getFieldLabel(type, name);
          return (
            <CardInfoRow
              key={type}
              style={{ cursor: onFieldClick ? 'pointer' : 'default' }}
              onClick={() => handleFieldClick(type)}
            >
              <CardInfoRowLabel title={fieldLabel}>{fieldLabel}</CardInfoRowLabel>
              <CardInfoRowValue>{renderFieldValue(value, { type })}</CardInfoRowValue>
            </CardInfoRow>
          );
        })}
    </CardInfoFooter>
  );

  const MiddleImgBlock = (
    <CardInfoMainImgWrapper ref={mainImgRef}>
      {design.stampBackground || mergedCard.cardImg ? (
        <CardInfoMainImg
          src={design.stampBackground || mergedCard.cardImg}
          alt="Card background"
          draggable="false"
        />
      ) : (
        <CardBackground style={{ backgroundColor: mergedCard.stampBackgroundColor }} />
      )}

      {(card.status === 'subscription' || card.status === 'stamp') && (
        <StampOverlay style={{ backgroundImage: `url(${design.stampBackground})` }}>
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
            onStampClick={(isActive) =>
              handleFieldClick(isActive ? 'activeStamp' : 'inactiveStamp')
            }
            hoverActive={isHover('activeStampColor') || isHover('activeStampBgColor')}
            hoverInactive={isHover('inactiveStampColor') || isHover('inactiveStampBgColor')}
            hoverBorder={isHover('borderColor')}
          />
        </StampOverlay>
      )}
    </CardInfoMainImgWrapper>
  );

  const HeaderWrapped = isHover('textColor') ? <HiZone>{HeaderBlock}</HiZone> : HeaderBlock;
  const FooterWrapped = isHover('textColor') ? <HiZone>{FooterBlock}</HiZone> : FooterBlock;
  const MiddleWrapped = isHover('stampBackgroundColor') ? (
    <HiZone>{MiddleImgBlock}</HiZone>
  ) : (
    MiddleImgBlock
  );

  return (
    <CardBox
      style={{
        backgroundColor: mergedCard.cardBackground,
        color: mergedCard.textColor,
      }}
      as={isHover('cardBackground') ? HiZone : 'div'}
    >
      {HeaderWrapped}

      {MiddleWrapped}

      {FooterWrapped}

      {card.qrImg && <CardInfoQrImg src={card.qrImg} alt="QR код" draggable="false" />}

      {(() => {
        const rawNumber = card.serialNumber || '000001';
        const formatted = String(rawNumber).replace(/(\d{3})(\d{3})/, '$1 $2');
        return <CardNumber>{formatted}</CardNumber>;
      })()}

      <InfoButton onClick={toggleInfo} aria-label="Сведения">
        <HelpCircle size={20} />
      </InfoButton>
    </CardBox>
  );
};

export default CardInfo;
