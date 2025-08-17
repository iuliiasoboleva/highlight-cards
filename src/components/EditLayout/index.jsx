import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import CardInfoAndroid from '../../components/CardInfoAndroid';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { statusConfig } from '../../utils/statusConfig';
import CardInfo from '../CardInfo';
import InfoOverlay from '../InfoOverlay';
import PushPreview from '../PushPreview';
import {
  CardState,
  CardTextDefault,
  Layout,
  Left,
  Page,
  PhoneContainer,
  PhoneFrame,
  PhoneImage,
  PhoneScreen,
  PhoneSticky,
  PlatformButton,
  PlatformIcons,
  Right,
  Tab,
  Tabs,
} from './styles';

const EditLayout = ({
  children,
  onFieldClick,
  defaultPlatform = 'ios',
  chatMessage,
  chatScheduledDate,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('description');
  const [platform, setPlatform] = useState(defaultPlatform);
  const previousPlatform = useRef(defaultPlatform);

  const currentCard = useSelector((state) => state.cards.currentCard);
  const isDesignStep = location.pathname.includes('/edit/design');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentCard.status) {
      const defaultFields = (statusConfig[currentCard.status] || []).map((item) => ({
        type: item.valueKey,
        name: item.label,
      }));

      dispatch(
        updateCurrentCardField({
          path: 'fieldsName',
          value: defaultFields,
        }),
      );
    }
  }, [currentCard.status, dispatch]);

  useEffect(() => {
    if (location.pathname.includes('/edit/info')) {
      previousPlatform.current = platform;
      setPlatform('info');
    } else if (platform === 'info') {
      setPlatform(previousPlatform.current);
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetShowInfo = (value) => {
    if (value) {
      previousPlatform.current = platform;
      setPlatform('info');
    } else {
      setPlatform(previousPlatform.current);
    }
  };

  return (
    <>
      {isMobile && (
        <Tabs>
          <Tab $active={activeTab === 'description'} onClick={() => setActiveTab('description')}>
            Описание
          </Tab>
          <Tab $active={activeTab === 'card'} onClick={() => setActiveTab('card')}>
            Карта
          </Tab>
        </Tabs>
      )}

      <Layout>
        {(!isMobile || activeTab === 'description') && (
          <Left>
            <Page>{children}</Page>
          </Left>
        )}

        {(!isMobile || activeTab === 'card') && (
          <Right>
            <PhoneContainer>
              <PhoneSticky>
                <CardState>
                  <CardTextDefault>Так карта будет выглядеть в телефоне клиента</CardTextDefault>
                </CardState>

                <PhoneFrame>
                  <PhoneImage
                    src={platform === 'android' ? '/frame-android.svg' : currentCard.frameUrl}
                    alt={currentCard.name}
                  />
                  <PhoneScreen>
                    {platform === 'ios' && (
                      <CardInfo
                        card={currentCard}
                        setShowInfo={handleSetShowInfo}
                        onFieldClick={onFieldClick}
                      />
                    )}

                    {platform === 'android' && (
                      <CardInfoAndroid
                        card={currentCard}
                        setShowInfo={handleSetShowInfo}
                        onFieldClick={onFieldClick}
                      />
                    )}

                    {platform === 'chat' && (
                      <PushPreview
                        card={currentCard}
                        message={
                          chatMessage ??
                          currentCard.pushNotification?.message ??
                          `Новое уведомление по вашей карте "${currentCard.name}"`
                        }
                        scheduledDate={
                          chatScheduledDate ?? currentCard.pushNotification?.scheduledDate
                        }
                      />
                    )}

                    {platform === 'info' && (
                      <InfoOverlay
                        infoFields={
                          isDesignStep
                            ? {
                                stampsQuantity: currentCard.design?.stampsQuantity,
                                activeStamp: currentCard.design?.activeStamp,
                                inactiveStamp: currentCard.design?.inactiveStamp,
                                logo: currentCard.design?.logo,
                                icon: currentCard.design?.icon,
                                stampBackground: currentCard.design?.stampBackground,
                              }
                            : currentCard.infoFields
                        }
                        onClose={() => setPlatform(previousPlatform.current)}
                        onFieldClick={onFieldClick}
                      />
                    )}
                  </PhoneScreen>
                </PhoneFrame>
              </PhoneSticky>

              <PlatformIcons>
                <PlatformButton
                  aria-label="iOS"
                  $active={platform === 'ios'}
                  onClick={() => setPlatform('ios')}
                >
                  <img src="/icons/apple-icon.svg" alt="iOS" />
                </PlatformButton>
                <PlatformButton
                  aria-label="Android"
                  $active={platform === 'android'}
                  onClick={() => setPlatform('android')}
                >
                  <img src="/icons/android-icon.svg" alt="Android" />
                </PlatformButton>
                <PlatformButton
                  aria-label="Chat"
                  $active={platform === 'chat'}
                  onClick={() => setPlatform('chat')}
                >
                  <img src="/icons/chat-icon.svg" alt="Chat" />
                </PlatformButton>
              </PlatformIcons>
            </PhoneContainer>
          </Right>
        )}
      </Layout>
    </>
  );
};

export default EditLayout;
