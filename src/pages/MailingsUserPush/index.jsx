import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomSelect from '../../components/CustomSelect';
import GeoBadge from '../../components/GeoBadge';
import PushPreview from '../../components/PushPreview';
import { mockUserPushes } from '../../mocks/mockUserPushes';
import { setCurrentCard } from '../../store/cardsSlice';
import {
  Actions,
  BlackButton,
  Button,
  CardState,
  FormDescription,
  FormTitle,
  FormWrapper,
  Input,
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
  Tag,
  TagWrapper,
  WhiteButton,
} from './styles';

const MailingsUserPush = () => {
  const dispatch = useDispatch();

  const [tariff, setTariff] = useState('Start');
  const [pushMessage, setPushMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedTriggerKey, setSelectedTriggerKey] = useState(null);

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

  const handleTriggerSelect = (key) => {
    setSelectedTriggerKey(key);
  };

  const handleCancel = () => {
    setSelectedTriggerKey(null);
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
          <>
            {selectedTriggerKey === null ? (
              <CustomSelect
                value={selectedTriggerKey}
                onChange={handleTriggerSelect}
                placeholder="Выберите триггер для запуска авто-push"
                options={mockUserPushes.map((item) => ({
                  value: item.key,
                  label: item.title,
                }))}
              />
            ) : (
              <FormWrapper>
                <FormTitle>Добавить авто-push</FormTitle>
                <FormDescription>
                  Настройте сценарий отправки автоматического push-уведомления
                </FormDescription>

                <CustomSelect
                  value={selectedTriggerKey}
                  onChange={handleTriggerSelect}
                  placeholder="Для условия"
                  options={mockUserPushes.map((item) => ({
                    value: item.key,
                    label: item.title,
                  }))}
                />

                <Input placeholder="Введите текст" />
                <Input placeholder="Сообщение будет выслано по истечении" />
                <Input placeholder="Время" />

                <TagWrapper>
                  <Tag>SPA салон ✕</Tag>
                </TagWrapper>

                <Actions>
                  <BlackButton>Сохранить</BlackButton>
                  <WhiteButton onClick={handleCancel}>Отменить</WhiteButton>
                </Actions>
              </FormWrapper>
            )}
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

export default MailingsUserPush;
