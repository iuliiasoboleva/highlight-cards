import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Users } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import EditLayout from '../../components/EditLayout';
import GeoBadge from '../../components/GeoBadge';
import TitleWithHelp from '../../components/TitleWithHelp';
import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomSelect from '../../customs/CustomSelect';
import { getMinDateTime } from '../../helpers/date';
import { pluralVerb, pluralize } from '../../helpers/pluralize';
import { setCurrentCard, updateCurrentCardField } from '../../store/cardsSlice';
import PushHistory from './PushHistory';
import PushTargetTabs from './PushTargetTabs';
import {
  MailingsPushBox,
  NoActiveCardsText,
  PushDate,
  PushRecipientCount,
  PushSchedule,
  PushTextarea,
  SubmitButton,
} from './styles.jsx';

const MailingsPush = () => {
  const dispatch = useDispatch();

  const allCards = useSelector((state) => state.cards.cards);
  const cards = allCards.filter((card) => card.id !== 'fixed');
  const hasActiveCards = cards?.length > 0;

  const currentCard = useSelector((state) => state.cards.currentCard);
  const user = useSelector((state) => state.user);

  const [pushMessage, setPushMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [usersCount, setUsersCount] = useState(0);
  const [history, setHistory] = useState([]);

  const fetchHistory = useCallback(async () => {
    if (!currentCard) return;
    try {
      const res = await axiosInstance.get('/mailings', {
        params: { organization_id: user.organization_id, card_id: currentCard.id },
      });
      setHistory(res.data.filter((m) => m.mailingType === 'Push'));
    } catch (e) {
      console.error(e);
    }
  }, [currentCard, user.organization_id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if ((!currentCard || !cards.find((c) => c.id === currentCard.id)) && cards.length > 0) {
      dispatch(setCurrentCard(cards[0]));
    }
  }, [currentCard, cards, dispatch]);

  useEffect(() => {
    if (currentCard) {
      setPushMessage(
        currentCard.pushNotification?.message ||
          `Новое уведомление по вашей карте "${currentCard.name}"`,
      );

      const hasSchedule = Boolean(currentCard.pushNotification?.scheduledDate);
      setIsScheduled(hasSchedule);

      if (hasSchedule) {
        setScheduledDate(currentCard.pushNotification.scheduledDate);
      } else {
        setScheduledDate(getMinDateTime());
      }
    }
  }, [currentCard]);

  const handleCardSelect = (cardId) => {
    const selected = cards.find((c) => c.id === cardId);
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

  const handleScheduleToggle = (e) => {
    const shouldSchedule = e.target.checked;
    setIsScheduled(shouldSchedule);

    if (!shouldSchedule) {
      setScheduledDate('');
    } else if (!scheduledDate) {
      setScheduledDate(getMinDateTime());
    }
  };

  const handleSavePushSettings = async () => {
    if (!currentCard) return;

    // Сохраняем в карту для UI/превью
    dispatch(
      updateCurrentCardField({
        path: 'pushNotification',
        value: {
          message: pushMessage,
          scheduledDate: isScheduled ? scheduledDate : '',
        },
      }),
    );

    // Создаём запись рассылки
    try {
      await axiosInstance.post('/mailings', {
        card_id: currentCard.id,
        name: `Push по карте ${currentCard.title}`,
        date_time: isScheduled ? scheduledDate : new Date().toISOString(),
        recipients: selectedTab === 'all' ? 'all' : 'segment',
        mailing_type: 'Push',
        status: isScheduled ? 'Запланирована' : 'Отправлена',
        organization_id: user.organization_id,
        author_id: user.id,
        message: pushMessage,
      });
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  // --- контент левой колонки (children для EditLayout) ---
  const leftContent = hasActiveCards ? (
    <>
      <TitleWithHelp
        title="Отправить push"
        tooltipId="push-help"
        tooltipHtml
        tooltipContent={`Хотите отправить пуши только нужным клиентам?<br/><br/>
Выберите один или несколько сегментов — например, «Растущие» или «В зоне риска».<br/><br/>
Настроить сегменты можно во вкладке  «Сегментация клиентов» в разделе «Клиенты».`}
      />

      <MailingsPushBox>
        <CustomSelect
          value={currentCard?.id || null}
          onChange={handleCardSelect}
          options={cards.map((card) => ({
            value: card.id,
            label: card.title,
          }))}
          disabled={!hasActiveCards}
        />

        <PushTargetTabs onTabChange={setSelectedTab} onFilteredCountChange={setUsersCount} />

        <PushRecipientCount>
          <Users size={16} />
          {usersCount} {pluralize(usersCount, ['клиент', 'клиента', 'клиентов'])}{' '}
          {pluralVerb(usersCount, 'получит', 'получат')} ваше сообщение
        </PushRecipientCount>

        <PushSchedule>
          <CustomCheckbox
            label="Запланировать"
            checked={isScheduled}
            onChange={handleScheduleToggle}
          />

          {isScheduled && (
            <PushDate
              type="datetime-local"
              value={scheduledDate}
              min={getMinDateTime()}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          )}
        </PushSchedule>

        <PushTextarea
          value={pushMessage}
          onChange={(e) => setPushMessage(e.target.value)}
          placeholder="Введите текст push-уведомления"
        />

        <SubmitButton onClick={handleSavePushSettings} disabled={!pushMessage.trim()}>
          Отправить
        </SubmitButton>
      </MailingsPushBox>

      <PushHistory
        history={history}
        onDelete={async (id) => {
          try {
            await axiosInstance.delete(`/mailings/${id}`);
            setHistory((prev) => prev.filter((m) => m.id !== id));
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </>
  ) : (
    <>
      <div className="mailings-push-container">
        <GeoBadge title="Push-уведомления" />
        <NoActiveCardsText>
          У вас нет активных карт, чтобы настроить push-уведомление. Пожалуйста, создайте и
          активируйте карту в разделе "Карты".
        </NoActiveCardsText>
      </div>
    </>
  );

  return (
    <EditLayout
      defaultPlatform="chat"
      chatMessage={pushMessage}
      chatScheduledDate={isScheduled ? scheduledDate : undefined}
    >
      {leftContent}
    </EditLayout>
  );
};

export default MailingsPush;
