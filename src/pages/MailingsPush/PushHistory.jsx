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
