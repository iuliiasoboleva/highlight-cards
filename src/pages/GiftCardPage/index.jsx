import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

import iconDiploma from '../../assets/icons/diploma.svg';
import iconExpensive from '../../assets/icons/expensive.svg';
import iconSale from '../../assets/icons/sale.svg';
import iconServices from '../../assets/icons/services.svg';
import HeroCard from '../../components/HeroCard';
import Footer from '../Footer';
import axiosInstance from '../../axiosInstance';
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
  { id: 5, icon: iconSale, text: 'Сертификат не подлежит возврату или обмену на наличные' },
];

const GiftCardPage = () => {
  const { uuid } = useParams();
  const [opened, setOpened] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const { data } = await axiosInstance.get(`/cards/gift/${uuid}`);
        setCardData(data);
      } catch (e) {
        console.error('Failed to fetch gift card', e);
        setError('Сертификат не найден');
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchCard();
    } else {
      setLoading(false);
      setError('Не указан номер сертификата');
    }
  }, [uuid]);

  if (loading) {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Загрузка...
      </Container>
    );
  }

  if (error || !cardData) {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {error || 'Сертификат не найден'}
      </Container>
    );
  }

  const branches = cardData.branches || [];
  const branchesWithCoords = branches.filter(b => b.coords);

  return (
    <Container>
      <HeroCard
        opened={opened}
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        onCTA={() => {
          if (cardData.buttonLink) {
            window.location.href = cardData.buttonLink;
          } else {
            alert('Здесь будет переход к записи');
          }
        }}
        name={cardData.name}
        text={cardData.text}
        amount={cardData.amount}
        expiry={cardData.expiry}
        serial={cardData.serial}
        buttonText={cardData.buttonText}
        termsText={cardData.termsText}
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

      {branchesWithCoords.length > 0 && (
        <MapBlock>
          <YMaps query={{ lang: 'ru_RU' }}>
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
                  const coords = branchesWithCoords.map(b => b.coords);
                  if (!mapRef.current || !coords.length) return;

                  if (coords.length === 1) {
                    mapRef.current.setCenter(coords[0], 13);
                    return;
                  }
                  const lats = coords.map((p) => p[0]);
                  const lngs = coords.map((p) => p[1]);
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
                  {branchesWithCoords.map((branch) => (
                    <Placemark
                      key={branch.id}
                      geometry={branch.coords}
                      options={{ preset: 'islands#redDotIcon' }}
                      properties={{
                        balloonContentHeader: branch.name,
                        balloonContentBody: `<div>${branch.address || ''}</div>`,
                      }}
                      modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                    />
                  ))}
                </Clusterer>
              </Map>
            </div>
          </YMaps>
        </MapBlock>
      )}
      
      {branches.length > 0 && (
        <BottomBlock>
          <h3 className="addr-title">
            <em>Адреса,</em> где можно <br />
            <span>использовать сертификат</span>
          </h3>

          <Addresses>
            <CityCol>
              {branches.map((branch) => (
                <AddressItem key={branch.id}>
                  <div className="line1">{branch.name}</div>
                  {branch.address && <div className="line2">{branch.address}</div>}
                </AddressItem>
              ))}
            </CityCol>
          </Addresses>

          {(cardData.phone || cardData.email) && (
            <ContactRow>
              {cardData.phone && (
                <div className="contact">
                  <div className="label">Телефон:</div>
                  <a className="value" href={`tel:${cardData.phone}`}>
                    {cardData.phone}
                  </a>
                </div>
              )}
              {cardData.email && (
                <div className="contact">
                  <div className="label">E-mail:</div>
                  <a className="value" href={`mailto:${cardData.email}`}>
                    {cardData.email}
                  </a>
                </div>
              )}
            </ContactRow>
          )}
        </BottomBlock>
      )}
      <Footer />
    </Container>
  );
};

export default GiftCardPage;
