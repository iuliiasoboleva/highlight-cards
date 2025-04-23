import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { faCircleQuestion, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CustomSelect from '../../components/CustomSelect';
import PushPreview from '../../components/PushPreview';
import { pluralize } from '../../helpers/pluralize';
import { updateCurrentCard } from '../../store/cardsSlice';

import './styles.css';

const MailingsPush = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeTab, setActiveTab] = useState('settings');

  const currentCard = useSelector((state) => state.cards.currentCard);
  const cards = useSelector((state) => state.cards.cards.filter((card) => card.id !== 'fixed'));

  const [pushMessage, setPushMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const usersCount = currentCard?.subscribersCount || 0;

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

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

  const pushContent = (
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
          disabled={cards.length === 0}
        />

        <div className="push-toggle-buttons">
          <button className="btn btn-light">Всем клиентам</button>
        </div>

        <p className="push-recipient-count">
          <FontAwesomeIcon icon={faUsers} style={{ fontSize: 14 }} />
          {usersCount} {pluralize(usersCount, ['клиент', 'клиента', 'клиентов'])} получат ваше
          сообщение
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
  );

  const cardPreview = (
    <div className="type-card-image-container">
      <img className="card-image-add" src="/phone.svg" alt="preview" />
      <PushPreview
        card={currentCard}
        message={pushMessage}
        scheduledDate={isScheduled ? scheduledDate : null}
      />
    </div>
  );

  return (
    <div className="edit-type-main-container">
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
          <div className="edit-type-page">
            {activeTab === 'settings' ? pushContent : cardPreview}
          </div>
        </div>
      ) : (
        <>
          <div className="edit-type-page">{pushContent}</div>
          {cardPreview}
        </>
      )}
    </div>
  );
};

export default MailingsPush;
