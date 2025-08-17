import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AutoPushCard from '../../components/AutoPushCard';
import EditLayout from '../../components/EditLayout';
import GeoBadge from '../../components/GeoBadge';
import UserPushBlock from '../../components/UserPushBlock';
import { removeUserPush, setDelay, setMessage } from '../../store/userPushSlice';
import { Button, Line, NotificationsBlock, Subtitle } from './styles';

const MailingsUserPush = () => {
  const dispatch = useDispatch();

  const [tariff, setTariff] = useState('Start');
  const [pushMessage, setPushMessage] = useState('');

  const currentCard = useSelector((state) => state.cards.currentCard);
  const cards = useSelector((state) => state.cards.cards);
  const userPushNotifications = useSelector((state) => state.userPush.items);

  useEffect(() => {
    if (currentCard) {
      setPushMessage(
        currentCard.pushNotification?.message ||
          `Новое уведомление по вашей карте "${currentCard.name}"`,
      );
    }
  }, [currentCard]);

  const hasAccess = tariff !== 'Start';

  return (
    <EditLayout
      defaultPlatform="chat"
      chatMessage={pushMessage}
      chatScheduledDate={currentCard?.pushNotification?.scheduledDate}
    >
      <GeoBadge title="Пользовательские авто-push" badgeText="Бесплатно!" />
      <Subtitle>
        Задайте свои правила отправки PUSH-уведомлений клиенту. Выберите после какого события и
        через сколько времени будет отправлено уведомление
      </Subtitle>

      <Line />

      {hasAccess ? (
        <>
          <UserPushBlock />
          {userPushNotifications.length > 0 && (
            <NotificationsBlock>
              {userPushNotifications.map((item) => (
                <AutoPushCard
                  key={item.id}
                  itemId={item.id}
                  title={item.title}
                  message={item.message ?? item.defaultMessage ?? ''}
                  delay={item.delay}
                  enabled={true}
                  onChangeMessage={(val) => dispatch(setMessage({ id: item.id, message: val }))}
                  onChangeDelay={(val) => dispatch(setDelay({ id: item.id, delay: Number(val) }))}
                  lockToggle
                  removable
                  onRemove={() => dispatch(removeUserPush(item.id))}
                  selectedCardIds={item.selectedCards}
                  allCards={cards}
                  onSave={() => console.log('Save logic (optional, can be removed)')}
                />
              ))}
            </NotificationsBlock>
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

export default MailingsUserPush;
