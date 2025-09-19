import React, { useRef, useState } from 'react';

import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

import iconDiploma from '../../assets/icons/diploma.svg';
import iconExpensive from '../../assets/icons/expensive.svg';
import iconSale from '../../assets/icons/sale.svg';
import iconServices from '../../assets/icons/services.svg';
import HeroCard from '../../components/HeroCard';
import { ADDRESSES, GIFT_CARD_HERO } from '../../mocks/giftCardMocks';
import Footer from '../Footer';
import {
  AddressItem,
  Addresses,
  BottomBlock,
  CityCol,
  CityTitle,
  ContactRow,
  Container,
  HowGrid,
  HowItem,
  HowTo,
  MapBlock,
} from './styles';

const HOW_TO = [
  {
    id: 1,
    icon: iconDiploma,
    text: 'Сертификат доступен в любом филиале, выбор услуги и мастера',
  },
  { id: 2, icon: iconServices, text: 'Указать номер сертификата при записи' },
  { id: 3, icon: iconExpensive, text: 'Можно доплатить, если сумма превышает номинал' },
  { id: 4, icon: iconSale, text: 'Акции и скидки не действуют на сертификат' },
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
              <span className="icon">
                <img src={item.icon} alt="" />
              </span>
              <div className="text">{item.text}</div>
            </HowItem>
          ))}
        </HowGrid>
      </HowTo>

      <MapBlock>
        <YMaps query={{ lang: 'ru_RU' /*, apikey: 'ВАШ_API_KEY'*/ }}>
          <div
            style={{
              height: 360,
              width: '100%',
              maxWidth: '100%',
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
      </MapBlock>
      <BottomBlock>
        <h3 className="addr-title">
          <em>Адреса,</em> где можно <br />
          <span>использовать сертификат</span>
        </h3>

        <Addresses>
          {ADDRESSES.map((group) => (
            <CityCol key={group.city}>
              <CityTitle>{group.city}</CityTitle>
              {group.items.map((a) => (
                <AddressItem key={a.id}>
                  <div className="line1">{a.line}</div>
                </AddressItem>
              ))}
            </CityCol>
          ))}
        </Addresses>

        <ContactRow>
          <div className="contact">
            <div className="label">Колл-центр:</div>
            <a className="value" href="tel:+74992262931">
              +7 (499) 226-29-31
            </a>
          </div>
          <div className="contact">
            <div className="label">E-mail:</div>
            <a className="value" href="mailto:boss@feedback-massage.ru">
              boss@feedback-massage.ru
            </a>
          </div>
        </ContactRow>
      </BottomBlock>
      <Footer />
    </Container>
  );
};

export default GiftCardPage;
