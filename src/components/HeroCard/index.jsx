import React from 'react';

import giftCardTop from '../../assets/gift-card-top.png';
import giftCardImg from '../../assets/gift-card.png';
import logoImg from '../../assets/logo_m8.png';
import { CTAButton, Certificate, ClosedLayer, HeroContainer, OpenedLayer } from './styles';

const HeroCard = ({
  opened = false,
  onOpen,
  onClose,
  onCTA,
  name,
  text,
  amount,
  expiry,
  serial,
  buttonText,
  termsText,
  certificateLogo,
}) => {
  const formatExpiry = (expiryDate) => {
    if (!expiryDate || expiryDate === '00.00.0000' || expiryDate === '0000-00-00') {
      return 'Бессрочно';
    }
    return `до ${expiryDate}`;
  };

  return (
    <HeroContainer onClick={() => opened && onClose?.()}>
      {/* Закрытый конверт */}
      <ClosedLayer
        $opened={opened}
        onClick={(e) => {
          e.stopPropagation();
          onOpen?.();
        }}
      >
        <img src={giftCardImg} alt="Конверт" />
      </ClosedLayer>

      {/* Открытый сертификат */}
      <OpenedLayer $opened={opened} onClick={(e) => e.stopPropagation()}>
        <Certificate>
          {certificateLogo ? (
            <img src={certificateLogo} alt="Лого" className="logo" />
          ) : (
            <img src={logoImg} alt="Лого" className="logo" />
          )}
          <h1 className="title">Подарочный сертификат</h1>
          <div className="name">{name}</div>

          <p className="text">{text}</p>

          <div className="amount">
            <span className="sum">{amount}</span>
            <span className="rub">₽</span>
          </div>

          <CTAButton className="cta" onClick={() => onCTA?.()}>
            {buttonText || 'Записаться онлайн'}
          </CTAButton>

          <div className="meta">
            <div>Срок действия: {formatExpiry(expiry)}</div>
            <div
              dangerouslySetInnerHTML={{
                __html: termsText || 'Акции и скидки не применяются<br /> к подарочному сертификату',
              }}
            />
            <div className="serial">{serial}</div>
          </div>
        </Certificate>

        {!!giftCardTop && <img src={giftCardTop} alt="Карман конверта" className="pocket" />}
      </OpenedLayer>
    </HeroContainer>
  );
};

export default HeroCard;
