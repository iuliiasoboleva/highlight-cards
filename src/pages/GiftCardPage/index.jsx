import React, { useRef, useState } from 'react';

import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

import giftCardTop from '../../assets/gift-card-top.png';
import giftCardImg from '../../assets/gift-card.png';
import iconCalendar from '../../assets/icons/diploma.svg';
import iconGift from '../../assets/icons/expensive.svg';
import iconNote from '../../assets/icons/sale.svg';
import iconServices from '../../assets/icons/services.svg';
import HeroCard from '../../components/HeroCard';
import { ADDRESSES, GIFT_CARD_HERO } from '../../mocks/giftCardMocks';
import {
  AddressItem,
  Addresses,
  Badge,
  CityCol,
  CityTitle,
  ContactRow,
  Container,
  Footer,
  HowGrid,
  HowItem,
  HowTo,
  MapBlock,
} from './styles';

const HOW_TO = [
  { id: 1, icon: iconServices, title: 'Выбор услуги', text: 'Доступ к любому филиалу и мастеру' },
  { id: 2, icon: iconGift, title: 'Указать номер', text: 'Сообщите номер сертификата при записи' },
  {
    id: 3,
    icon: iconCalendar,
    title: 'Подарок частями',
    text: 'Можно расходовать по необходимости',
  },
  { id: 4, icon: iconNote, title: 'Без акций', text: 'Акции и скидки не суммируются' },
];

const GiftCardPage = () => {
  const [opened, setOpened] = useState(false);
  const mapRef = useRef(null);

  return (
    <Container>
      <HeroCard
        opened={opened}
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        onCTA={() => alert('Здесь будет переход к записи')}
        giftCardImg={giftCardImg}
        giftCardTop={giftCardTop}
        name={GIFT_CARD_HERO.name}
        text={GIFT_CARD_HERO.text}
        amount={GIFT_CARD_HERO.amount}
        expiry={GIFT_CARD_HERO.expiry}
        serial={GIFT_CARD_HERO.serial}
      />
      <HowTo>
        <h2>
          Как воспользоваться <span>сертификатом</span>
        </h2>

        <HowGrid>
          {HOW_TO.map((item) => (
            <HowItem key={item.id}>
              <img src={item.icon} alt="" />
              <div className="title">{item.title}</div>
              <div className="text">{item.text}</div>
            </HowItem>
          ))}
        </HowGrid>
      </HowTo>

      <MapBlock>
        <h3>Адреса, где можно использовать сертификат</h3>

        <YMaps query={{ lang: 'ru_RU' /*, apikey: 'ВАШ_API_KEY'*/ }}>
          <div
            style={{
              height: 360,
              width: '100%',
              maxWidth: 1080,
              margin: '0 auto 16px',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <Map
              defaultState={{
                center: [55.7558, 37.6176],
                zoom: 5,
                controls: ['zoomControl', 'fullscreenControl'],
              }}
              modules={['control.ZoomControl', 'control.FullscreenControl']}
              style={{ height: '360px', width: '100%' }}
              instanceRef={mapRef}
              onLoad={() => {
                const all = ADDRESSES.flatMap((g) => g.items.map((i) => i.coords));
                if (!mapRef.current || !all.length) return;

                if (all.length === 1) {
                  mapRef.current.setCenter(all[0], 13);
                  return;
                }
                const lats = all.map((p) => p[0]);
                const lngs = all.map((p) => p[1]);
                const bounds = [
                  [Math.min(...lats), Math.min(...lngs)],
                  [Math.max(...lats), Math.max(...lngs)],
                ];
                mapRef.current.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
              }}
            >
              <Clusterer
                options={{ preset: 'islands#invertedRedClusterIcons', groupByCoordinates: false }}
              >
                {ADDRESSES.flatMap((group) =>
                  group.items.map((a) => (
                    <Placemark
                      key={a.id}
                      geometry={a.coords}
                      options={{ preset: 'islands#redDotIcon' }}
                      properties={{
                        balloonContentHeader: group.city,
                        balloonContentBody: `<div>${a.line1}</div><div style="color:#8a94a6">${a.line2 || ''}</div>`,
                      }}
                      modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                    />
                  )),
                )}
              </Clusterer>
            </Map>
          </div>
        </YMaps>

        <Addresses>
          {ADDRESSES.map((group) => (
            <CityCol key={group.city}>
              <CityTitle>{group.city}</CityTitle>
              {group.items.map((a) => (
                <AddressItem key={a.id}>
                  <div className="line1">{a.line1}</div>
                  <div className="line2">{a.line2}</div>
                </AddressItem>
              ))}
            </CityCol>
          ))}
        </Addresses>
      </MapBlock>

      <ContactRow>
        <div>
          <Badge>Телефон</Badge>
          <a href="tel:+74992262931">+7 (499) 226-29-31</a>
        </div>
        <div>
          <Badge>E-mail</Badge>
          <a href="mailto:boss@feedback-massage.ru">boss@feedback-massage.ru</a>
        </div>
      </ContactRow>
      <Footer>
        <div className="left">
          <span>© PRO M8</span> · <a href="#">Оплата</a> · <a href="#">Доставка</a> ·{' '}
          <a href="#">Скидки</a> · <a href="#">О нас</a>
        </div>
        <div className="right">
          <span>ИП Роман Иванов</span> · <a href="#">Политика конфиденциальности</a>
        </div>
      </Footer>
    </Container>
  );
};

export default GiftCardPage;
