import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AutoPushCard from '../../components/AutoPushCard';
import EditLayout from '../../components/EditLayout';
import GeoBadge from '../../components/GeoBadge';
import CustomSelect from '../../customs/CustomSelect';
import { mockAutoPushes } from '../../mocks/mockUserPushes';
import { setCurrentCard, updateCurrentCardField } from '../../store/cardsSlice';
import { Button, Cards, Line, MainButton, Subtitle } from './styles';

const MailingsAutoPush = () => {
  const dispatch = useDispatch();

  const [tariff, setTariff] = useState('Start');
  const [pushMessage, setPushMessage] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(null);

  const hasAccess = tariff !== 'Start';
  const currentCard = useSelector((state) => state.cards.currentCard);
  const allCards = useSelector((state) => state.cards.cards);

  const handleCardSelect = (cardId) => {
    setSelectedCardId(cardId);
    const selected = allCards.find((c) => c.id === cardId);
    if (selected) {
      dispatch(
        setCurrentCard({
          ...selected,
          pushNotification: selected.pushNotification || {
            message: `Новое уведомление по вашей карте "${selected.name}"`,
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
          `Новое уведомление по вашей карте "${currentCard.name}"`,
      );
    }
  }, [currentCard]);

  const onSaveAllOff = () => {
    mockAutoPushes.forEach((seg) => {
      dispatch(
        updateCurrentCardField({
          path: `pushNotification.auto.${seg.key}.enabled`,
          value: false,
        }),
      );
    });
  };

  const handleSegmentChange = (key, field, value) => {
    dispatch(
      updateCurrentCardField({
        path: `pushNotification.auto.${key}.${field}`,
        value,
      }),
    );
  };

  const hasAnyEnabled = Object.values(currentCard?.pushNotification?.auto || {}).some(
    (seg) => seg?.enabled,
  );

  return (
    <EditLayout
      defaultPlatform="chat"
      chatMessage={pushMessage}
      chatScheduledDate={currentCard?.pushNotification?.scheduledDate}
    >
      <GeoBadge title="Автоматизация push" badgeText="Бесплатно!" />
      <Subtitle>
        Настройте автоматические PUSH-уведомления по собственному сценарию. Поздравляйте клиента с
        днём рождения, собирайте обратную связь, напоминайте зайти к вам снова
      </Subtitle>

      <Line />

      {hasAccess ? (
        <>
          <MainButton onClick={onSaveAllOff} disabled={!hasAnyEnabled}>
            Выключить все авто-пуши
          </MainButton>

          <CustomSelect
            value={selectedCardId}
            onChange={handleCardSelect}
            placeholder="Карта"
            options={allCards.map((card) => ({
              value: card.id,
              label: card.name || card.title,
            }))}
          />

          {selectedCardId && (
            <Cards>
              {mockAutoPushes.map((seg) => (
                <AutoPushCard
                  key={seg.key}
                  title={seg.title}
                  message={
                    currentCard?.pushNotification?.auto?.[seg.key]?.message || seg.defaultMessage
                  }
                  delay={currentCard?.pushNotification?.auto?.[seg.key]?.delay || 2}
                  enabled={currentCard?.pushNotification?.auto?.[seg.key]?.enabled || false}
                  onChangeMessage={(val) => handleSegmentChange(seg.key, 'message', val)}
                  onChangeDelay={(val) => handleSegmentChange(seg.key, 'delay', Number(val))}
                  onToggle={() =>
                    handleSegmentChange(
                      seg.key,
                      'enabled',
                      !currentCard?.pushNotification?.auto?.[seg.key]?.enabled,
                    )
                  }
                  onSave={() => console.log('Save logic (optional, can be removed)')}
                />
              ))}
            </Cards>
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
    </EditLayout>
  );
};

export default MailingsAutoPush;
