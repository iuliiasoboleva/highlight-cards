import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GeoBadge from '../../components/GeoBadge';
import PushPreview from '../../components/PushPreview';
import UserPushBlock from '../../components/UserPushBlock';
import { setCurrentCard } from '../../store/cardsSlice';
import {
  Button,
  CardState,
  Layout,
  Left,
  Line,
  PhoneFrame,
  PhoneImage,
  PhoneScreen,
  PhoneSticky,
  Right,
  Subtitle,
  Tab,
  Tabs,
} from './styles';

const MailingsUserPush = () => {
  const dispatch = useDispatch();

  const [tariff, setTariff] = useState('Start');
  const [pushMessage, setPushMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('settings');

  const currentCard = useSelector((state) => state.cards.currentCard);

  useEffect(() => {
    if (currentCard) {
      setPushMessage(
        currentCard.pushNotification?.message ||
          `Новое уведомление по вашей карте "${currentCard.title}"`,
      );
    }
  }, [currentCard]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasAccess = tariff !== 'Start';

  const scenariosContent = (
    <Left>
      <div>
        <GeoBadge title="Пользовательские авто-push" badgeText="Бесплатно!" />
        <Subtitle>
          Задайте свои правила отправки PUSH-уведомлений клиенту. Выберите после какого события и
          через сколько времени будет отправлено уведомление
        </Subtitle>

        <Line />

        {hasAccess ? (
          <UserPushBlock />
        ) : (
          <>
            <Subtitle>
              Данный функционал не доступен на вашем тарифе <strong>«Start»</strong>
            </Subtitle>
            <Button>Выбрать тариф</Button>
          </>
        )}
      </div>
    </Left>
  );

  const previewContent = (
    <Right>
      <PhoneSticky>
        <CardState>
          <span className={`status-indicator ${currentCard.isActive ? 'active' : 'inactive'}`} />
          {currentCard.isActive ? 'Активна' : 'Не активна'}
        </CardState>
        <PhoneFrame>
          <PhoneImage src={currentCard.frameUrl} alt={currentCard.name} />
          <PhoneScreen>
            <PushPreview card={currentCard} message={pushMessage} />
          </PhoneScreen>
        </PhoneFrame>
      </PhoneSticky>
    </Right>
  );

  return (
    <Layout>
      {isMobile && (
        <Tabs>
          {['settings', 'card'].map((tab) => (
            <Tab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab === 'settings' ? 'Сценарии' : 'Превью'}
            </Tab>
          ))}
        </Tabs>
      )}

      {isMobile ? (
        activeTab === 'settings' ? (
          scenariosContent
        ) : (
          previewContent
        )
      ) : (
        <>
          {scenariosContent}
          {previewContent}
        </>
      )}
    </Layout>
  );
};

export default MailingsUserPush;
