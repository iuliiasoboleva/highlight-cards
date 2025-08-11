import React from 'react';

import { Copy, HelpCircle, Trash2 } from 'lucide-react';

import {
  EmptyMessage,
  PushHistoryControls,
  PushHistoryDates,
  PushHistoryIcon,
  PushHistoryItem,
  PushHistoryList,
  PushHistoryMessage,
  PushHistoryTitle,
  PushHistoryTop,
  PushHistoryWrapper,
} from './styles';

const PushHistory = ({ history = [], onDelete }) => {
  const handleCopy = (message) => {
    navigator.clipboard.writeText(message || '');
  };

  return (
    <PushHistoryWrapper>
      <PushHistoryTitle>
        История отправки <HelpCircle size={16} />
      </PushHistoryTitle>

      <PushHistoryList>
        {history.map(({ id, dateTime, message, status }) => (
          <PushHistoryItem key={id}>
            <PushHistoryTop>
              <PushHistoryDates>{dateTime}</PushHistoryDates>

              <PushHistoryControls>
                <span>{status}</span>
                <PushHistoryIcon onClick={() => handleCopy(message)} title="Скопировать сообщение">
                  <Copy size={16} />
                </PushHistoryIcon>
                <PushHistoryIcon
                  className="danger"
                  onClick={() => onDelete && onDelete(id)}
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </PushHistoryIcon>
              </PushHistoryControls>
            </PushHistoryTop>

            <PushHistoryMessage>
              {message?.trim() ? message : <EmptyMessage>Нет текста</EmptyMessage>}
            </PushHistoryMessage>
          </PushHistoryItem>
        ))}
      </PushHistoryList>
    </PushHistoryWrapper>
  );
};

export default PushHistory;
