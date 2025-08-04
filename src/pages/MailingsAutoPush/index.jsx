import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AutoPushCard from '../../components/AutoPushCard';
import CustomSelect from '../../components/CustomSelect';
import GeoBadge from '../../components/GeoBadge';
import PushPreview from '../../components/PushPreview';
import { mockAutoPushes } from '../../mocks/mockUserPushes';
import { setCurrentCard } from '../../store/cardsSlice';
import {
  Button,
  CardState,
  Cards,
  Layout,
  Left,
  Line,
  MainButton,
  PhoneFrame,
  PhoneImage,
  PhoneScreen,
  PhoneSticky,
  Right,
  Subtitle,
  Tab,
  Tabs,
} from './styles';

const MailingsAutoPush = () => {
  const dispatch = useDispatch();

  const [tariff, setTariff] = useState('Start');
  const [pushMessage, setPushMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('settings');

  const [settings, setSettings] = useState(
    mockAutoPushes.reduce((acc, seg) => {
      acc[seg.key] = {
        message: seg.defaultMessage,
        delay: 2,
        enabled: false,
      };
      return acc;
    }, {}),
  );

  const updateSegment = (key, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSave = (key) => {
    const { message, delay, enabled } = settings[key];
    console.log('Сохраняем:', { key, message, delay, enabled });
  };

  const hasAccess = tariff !== 'Start';
  const currentCard = useSelector((state) => state.cards.currentCard);
  const allCards = useSelector((state) => state.cards.cards);

  const handleCardSelect = (cardId) => {
    const selected = allCards.find((c) => c.id === cardId);
    if (selected) {
      dispatch(
        setCurrentCard({
          ...selected,
          pushNotification: selected.pushNotification || {
            message: `Новое уведомление по вашей карте "${selected.title}"`,
            scheduledDate: '',
          },
        }),
      );
    }
  };

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

  const onSaveAllOff = () => {
    setSettings((prev) => {
      const updated = {};
      for (const key in prev) {
        updated[key] = { ...prev[key], enabled: false };
      }
      return updated;
    });
  };

  const hasAnyEnabled = Object.values(settings).some((seg) => seg.enabled);

  const scenariosContent = (
    <Left>
      <div>
        <GeoBadge title="Автоматизация push" badgeText="Бесплатно!" />
        <Subtitle>
          Настройте автоматические PUSH-уведомления по собственному сценарию. Поздравляйте клиента с
          днём рождения, собирайте обратную связь, напоминайте зайти к вам снова
        </Subtitle>

        <Line />
        <MainButton onClick={onSaveAllOff} disabled={!hasAnyEnabled}>
          Выключить все авто-пуши
        </MainButton>

        {hasAccess ? (
          <>
            <CustomSelect
              value={currentCard?.id || allCards[0]?.id || null}
              onChange={handleCardSelect}
              placeholder={'Карта'}
              options={allCards.map((card) => ({
                value: card.id,
                label: card.name || card.title,
              }))}
            />
            <Cards>
              {mockAutoPushes.map((seg) => (
                <AutoPushCard
                  key={seg.key}
                  title={seg.title}
                  message={settings[seg.key].message}
                  delay={settings[seg.key].delay}
                  enabled={settings[seg.key].enabled}
                  onChangeMessage={(val) => updateSegment(seg.key, 'message', val)}
                  onChangeDelay={(val) => updateSegment(seg.key, 'delay', val)}
                  onToggle={() => updateSegment(seg.key, 'enabled', !settings[seg.key].enabled)}
                  onSave={() => handleSave(seg.key)}
                />
              ))}
            </Cards>
          </>
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

export default MailingsAutoPush;
