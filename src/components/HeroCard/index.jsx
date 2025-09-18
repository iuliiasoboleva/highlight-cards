import React, { useEffect, useRef, useState } from 'react';

import { CTAButton, Certificate, ClosedLayer, HeroContainer, OpenedLayer } from './styles';

const HeroCard = ({
  opened = false,
  onOpen,
  onClose,
  onCTA,
  giftCardImg,
  giftCardTop,
  name,
  text,
  amount,
  expiry,
  serial,
}) => {
  const closedImgRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(null);

  useEffect(() => {
    const measure = () => {
      if (!closedImgRef.current) return;
      setCardWidth(Math.round(closedImgRef.current.getBoundingClientRect().width));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

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
      <OpenedLayer $opened={opened} $w={cardWidth} onClick={(e) => e.stopPropagation()}>
        <Certificate $w={cardWidth}>
          <div className="logo">PRO M8</div>

          <h1 className="title">Подарочный сертификат</h1>
          <div className="name">{name}</div>

          <p className="text">{text}</p>

          <div className="amount">
            {amount}
            <span className="rub">₽</span>
          </div>

          <CTAButton className="cta" onClick={() => onCTA?.()}>
            Записаться онлайн
          </CTAButton>

          <div className="meta">
            <div>Срок действия: до {expiry}</div>
            <div>Акции и скидки не применяются к сертификату</div>
            <div className="serial">{serial}</div>
          </div>
        </Certificate>

        {!!giftCardTop && <img src={giftCardTop} alt="Карман конверта" className="pocket" />}
      </OpenedLayer>
    </HeroContainer>
  );
};

export default HeroCard;
