import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { faCircleQuestion, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CustomSelect from '../../components/CustomSelect';
import PushPreview from '../../components/PushPreview';
import { getMinDateTime } from '../../helpers/date';
import { pluralVerb, pluralize } from '../../helpers/pluralize';
import { updateCurrentCard } from '../../store/cardsSlice';
import PushTargetTabs from './PushTargetTabs';

import './styles.css';

const MailingsPush = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('settings');

  const allCards = useSelector((state) => state.cards.cards);
  const cards = allCards.filter((card) => card.id !== 'fixed');
  const hasActiveCards = cards.length > 0;

  const currentCard = useSelector((state) => state.cards.currentCard);
  const [pushMessage, setPushMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    if ((!currentCard || !cards.find((c) => c.id === currentCard.id)) && cards.length > 0) {
      dispatch(updateCurrentCard(cards[0]));
    }
  }, [currentCard, cards, dispatch]);

  useEffect(() => {
    if (currentCard) {
      setPushMessage(
        currentCard.pushNotification?.message ||
          `Новое уведомление по вашей карте "${currentCard.title}"`,
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
        updateCurrentCard({
          ...selected,
          pushNotification: selected.pushNotification || {
            message: `Новое уведомление по вашей карте "${selected.title}"`,
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

  const handleSavePushSettings = () => {
    dispatch(
      updateCurrentCard({
        ...currentCard,
        pushNotification: {
          message: pushMessage,
          scheduledDate: isScheduled ? scheduledDate : '',
        },
      }),
    );
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pushContent = hasActiveCards ? (
    <div className="edit-type-left">
      <div className="mailings-push-container">
        <h2 className="mailings-push-title">
          Отправить push
          <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 16, marginLeft: 8 }} />
        </h2>

        <div className="mailings-push-box">
          <CustomSelect
            value={currentCard?.id || null}
            onChange={handleCardSelect}
            options={cards.map((card) => ({
              value: card.id,
              label: card.title,
            }))}
            className="tariff-period-select"
            disabled={!hasActiveCards}
          />

          <PushTargetTabs onTabChange={setSelectedTab} onFilteredCountChange={setUsersCount} />

          <p className="push-recipient-count">
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: 14 }} />
            {usersCount} {pluralize(usersCount, ['клиент', 'клиента', 'клиентов'])}{' '}
            {pluralVerb(usersCount, 'получит', 'получат')} ваше сообщение
          </p>

          <div className="push-schedule">
            <label className="custom-checkbox">
              <input type="checkbox" checked={isScheduled} onChange={handleScheduleToggle} />
              <span>Запланировать</span>
            </label>

            {isScheduled && (
              <input
                className="push-date"
                type="datetime-local"
                value={scheduledDate}
                min={getMinDateTime()}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            )}
          </div>

          <textarea
            className="push-textarea"
            value={pushMessage}
            onChange={(e) => setPushMessage(e.target.value)}
            placeholder="Введите текст push-уведомления"
          />

          <button
            className="btn btn-dark"
            onClick={handleSavePushSettings}
            disabled={!pushMessage.trim()}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="edit-type-left">
      <div className="mailings-push-container">
        <h2 className="mailings-push-title">Push-уведомления</h2>
        <p className="no-active-cards-text">
          У вас нет активных карт, чтобы настроить push-уведомление. Пожалуйста, создайте и
          активируйте карту в разделе "Карты".
        </p>
      </div>
    </div>
  );

  const cardPreview = hasActiveCards && (
    <div className="edit-type-right">
      <div className="phone-frame">
        <img className="phone-image" src={currentCard.frameUrl} alt={currentCard.name} />
        <div className="phone-screen">
          <PushPreview
            card={currentCard}
            message={pushMessage}
            scheduledDate={isScheduled ? scheduledDate : null}
          />{' '}
        </div>
      </div>
    </div>
  );

  return (
    <div className="edit-type-layout">
      {isMobile && (
        <div className="edit-type-tabs">
          {['settings', 'card'].map((tab) => (
            <button
              key={tab}
              className={`edit-type-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'settings' ? 'Настройки' : 'Превью'}
            </button>
          ))}
        </div>
      )}

      {isMobile ? (
        <div className="edit-type-content">
          {activeTab === 'settings' ? pushContent : cardPreview}
        </div>
      ) : (
        <>
          {pushContent}
          {cardPreview}
        </>
      )}
    </div>
  );
};

export default MailingsPush;
