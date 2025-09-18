import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Copy, Inbox, Trash2 } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import TitleWithHelp from '../../components/TitleWithHelp';
import {
  EmptyMessage,
  EmptyStub,
  PushHistoryControls,
  PushHistoryDates,
  PushHistoryIcon,
  PushHistoryItem,
  PushHistoryList,
  PushHistoryMessage,
  PushHistoryTop,
  PushHistoryWrapper,
} from './styles';

const PushHistory = () => {
  const [history, setHistory] = useState([]);

  const currentCard = useSelector((state) => state.cards.currentCard);
  const user = useSelector((state) => state.user);

  const rawTz = useSelector((state) => state.user?.timezone || 'Europe/Moscow');
  const normalizeTz = (tz) => {
    if (!tz) return 'Europe/Moscow';
    const s = String(tz);
    if (s === 'Europe/Moscow') return s;
    try {
      // eslint-disable-next-line no-new
      new Intl.DateTimeFormat('ru-RU', { timeZone: s });
      return s;
    } catch {
      const lower = s.toLowerCase();
      if (lower.includes('moscow') || lower.includes('моск')) return 'Europe/Moscow';
      return 'Europe/Moscow';
    }
  };
  const tz = normalizeTz(rawTz);

  const fetchHistory = useCallback(async () => {
    if (!user.organization_id) return;
    try {
      const params = { organization_id: user.organization_id };
      if (currentCard?.id) params.card_id = currentCard.id;
      const res = await axiosInstance.get('/mailings', { params });
      const items = (Array.isArray(res.data) ? res.data : [])
        .filter((m) => m.mailingType === 'Push')
        .map((m) => {
          try {
            const iso = m.dateTime || '';
            const fixed = iso.replace(/(\.\d{3})\d+/, '$1');
            const d = new Date(fixed);
            const parts = new Intl.DateTimeFormat('ru-RU', {
              timeZone: tz,
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
              .formatToParts(d)
              .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
            return {
              ...m,
              dateTime: `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}`,
            };
          } catch {
            return m;
          }
        });
      setHistory(items);
    } catch (e) {
      console.error(e);
    }
  }, [currentCard?.id, tz, user.organization_id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onDelete = async (id) => {
    try {
      await axiosInstance.delete(`/mailings/${id}`);
      setHistory((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message || '');
  };

  return (
    <PushHistoryWrapper>
      <TitleWithHelp
        title="История отправки"
        tooltipId="history-help"
        tooltipHtml
        tooltipContent={`История отправки пуш-уведомлений`}
      />

      <PushHistoryList>
        {history.length === 0 ? (
          <EmptyStub>
            <Inbox size={22} />
            <div>История пустая</div>
            <p>Отправьте первое push-уведомление — здесь появится запись.</p>
          </EmptyStub>
        ) : (
          history.map(({ id, dateTime, message, status }) => (
            <PushHistoryItem key={id}>
              <PushHistoryTop>
                <PushHistoryDates>{dateTime}</PushHistoryDates>

                <PushHistoryControls>
                  <span>{status}</span>
                  <PushHistoryIcon
                    onClick={() => handleCopy(message)}
                    title="Скопировать сообщение"
                  >
                    <Copy size={16} />
                  </PushHistoryIcon>
                  <PushHistoryIcon className="danger" onClick={() => onDelete(id)} title="Удалить">
                    <Trash2 size={16} />
                  </PushHistoryIcon>
                </PushHistoryControls>
              </PushHistoryTop>

              <PushHistoryMessage>
                {message?.trim() ? message : <EmptyMessage>Нет текста</EmptyMessage>}
              </PushHistoryMessage>
            </PushHistoryItem>
          ))
        )}
      </PushHistoryList>
    </PushHistoryWrapper>
  );
};

export default PushHistory;
