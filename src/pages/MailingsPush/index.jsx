import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Users } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import EditLayout from '../../components/EditLayout';
import GeoBadge from '../../components/GeoBadge';
import TitleWithHelp from '../../components/TitleWithHelp';
import { useToast } from '../../components/Toast';
import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomDateTimePicker from '../../customs/CustomDateTimePicker';
import CustomSelect from '../../customs/CustomSelect';
import CustomTooltip from '../../customs/CustomTooltip';
import { getMinDateTime } from '../../helpers/date';
import { pluralVerb, pluralize } from '../../helpers/pluralize';
import { setCurrentCard, updateCurrentCardField } from '../../store/cardsSlice';
import { fetchClients } from '../../store/clientsSlice';
import PushTargetTabs from './PushTargetTabs';
import {
  MailingsPushBox,
  NoActiveCardsText,
  PushRecipientCount,
  PushSchedule,
  PushTextarea,
  SubmitButton,
} from './styles.jsx';

const MailingsPush = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { id: routeId } = useParams();

  const allCards = useSelector((state) => state.cards.cards);
  const cards = allCards.filter((card) => card.id !== 'fixed');
  const hasActiveCards = cards?.length > 0;

  const currentCard = useSelector((state) => state.cards.currentCard);
  const user = useSelector((state) => state.user);

  const [pushMessage, setPushMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedSegmentInfo, setSelectedSegmentInfo] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (!cards.length) return;

    const byRoute = routeId ? cards.find((c) => String(c.id) === String(routeId)) : null;

    if (byRoute && (!currentCard || String(currentCard.id) !== String(byRoute.id))) {
      dispatch(
        setCurrentCard({
          ...byRoute,
          pushNotification: byRoute.pushNotification || {
            message: `Новое уведомление по вашей карте "${byRoute.name}"`,
            scheduledDate: '',
          },
        }),
      );
      return;
    }

    if (
      (!currentCard || !cards.find((c) => String(c.id) === String(currentCard.id))) &&
      cards.length > 0
    ) {
      const first = cards[0];
      dispatch(
        setCurrentCard({
          ...first,
          pushNotification: first.pushNotification || {
            message: `Новое уведомление по вашей карте "${first.name}"`,
            scheduledDate: '',
          },
        }),
      );
    }
  }, [routeId, cards, dispatch]);

  useEffect(() => {
    if (!currentCard) return;

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
  }, [currentCard]);

  const handleCardSelect = (cardId) => {
    const selected = cards.find((c) => String(c.id) === String(cardId));
    if (!selected) return;

    dispatch(
      setCurrentCard({
        ...selected,
        pushNotification: selected.pushNotification || {
          message: `Новое уведомление по вашей карте "${selected.name}"`,
          scheduledDate: '',
        },
      }),
    );
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
    if (!currentCard || isSending) return;

    setIsSending(true);

    dispatch(
      updateCurrentCardField({
        path: 'pushNotification',
        value: {
          message: pushMessage,
          scheduledDate: isScheduled ? scheduledDate : '',
        },
      }),
    );

    try {
      await axiosInstance.post('/mailings', {
        card_id: currentCard.id,
        name:
          selectedTab === 'segment' && selectedSegmentInfo?.segmentLabel
            ? `Сегмент: ${selectedSegmentInfo.segmentLabel}`
            : `Push по карте ${currentCard.name ?? currentCard.title}`,
        date_time: isScheduled ? scheduledDate : new Date().toISOString(),
        recipients:
          selectedTab === 'all'
            ? 'all'
            : selectedSegmentInfo?.segmentLabel || selectedSegmentInfo?.segment || 'segment',
        mailing_type: 'Push',
        status: isScheduled ? 'Запланирована' : 'Отправлена',
        organization_id: user.organization_id,
        author_id: user.id,
        message: pushMessage,
      });

      if (isScheduled) {
        toast.success('Push-уведомление запланировано');
      } else {
        toast.success('Рассылка началась! Push-уведомления отправляются в фоновом режиме');
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e.response?.data?.detail || 'Ошибка при отправке push-уведомления';
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const submitLabel = useMemo(() => {
    if (isSending) return isScheduled ? 'Планируется...' : 'Отправка...';
    if (!pushMessage.trim()) return 'Введите текст сообщения';
    return isScheduled ? 'Запланировать сообщение' : 'Отправить';
  }, [isScheduled, pushMessage, isSending]);

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
            label: card.name,
          }))}
          disabled={!hasActiveCards}
        />

        <PushTargetTabs
          selectedCardId={currentCard?.id}
          onTabChange={(tab, extra) => {
            setSelectedTab(tab);
            setSelectedSegmentInfo(extra);
          }}
          onFilteredCountChange={setUsersCount}
        />

        <PushRecipientCount>
          <Users size={16} />
          {usersCount} {pluralize(usersCount, ['клиент', 'клиента', 'клиентов'])}{' '}
          {pluralVerb(usersCount, 'получит', 'получат')} ваше сообщение
        </PushRecipientCount>

        <PushSchedule>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
          >
            <CustomCheckbox label="Запланировать" checked={false} onChange={() => {}} disabled />
            <CustomTooltip id="schedule-disabled-tooltip" content="Скоро будет доступно" />
          </div>

          {isScheduled && (
            <CustomDateTimePicker
              value={scheduledDate}
              min={getMinDateTime()}
              onChange={(value) => setScheduledDate(value)}
              placeholder="Выберите дату и время"
            />
          )}
        </PushSchedule>

        <PushTextarea
          value={pushMessage}
          onChange={(e) => setPushMessage(e.target.value)}
          placeholder="Введите текст push-уведомления"
        />

        <SubmitButton
          onClick={handleSavePushSettings}
          disabled={!pushMessage.trim() || isSending}
          $full
        >
          {submitLabel}
        </SubmitButton>
      </MailingsPushBox>
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
