import React, { useRef } from 'react';

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
}) => {
  const closedImgRef = useRef(null);

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
        <img ref={closedImgRef} src={giftCardImg} alt="Конверт" />
      </ClosedLayer>

      {/* Открытый сертификат */}
      <OpenedLayer $opened={opened} onClick={(e) => e.stopPropagation()}>
        <Certificate>
          <img src={logoImg} alt="Лого" className="logo" />
          <h1 className="title">Подарочный сертификат</h1>
          <div className="name">{name}</div>

          <p className="text">{text}</p>

          <div className="amount">
            <span className="sum">{amount}</span>
            <span className="rub">₽</span>
          </div>

          <CTAButton className="cta" onClick={() => onCTA?.()}>
            Записаться онлайн
          </CTAButton>

          <div className="meta">
            <div>Срок действия: до {expiry}</div>
            <div>
              Акции и скидки не применяются
              <br /> к подарочному сертификату
            </div>
            <div className="serial">{serial}</div>
          </div>
        </Certificate>

        {!!giftCardTop && <img src={giftCardTop} alt="Карман конверта" className="pocket" />}
      </OpenedLayer>
    </HeroContainer>
  );
};

export default HeroCard;
