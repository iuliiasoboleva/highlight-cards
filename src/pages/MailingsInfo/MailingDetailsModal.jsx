import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import {
  Center,
  CloseBtn,
  Empty,
  Field,
  Header,
  Message,
  MessageWrap,
  Modal,
  Overlay,
  Spinner,
  Title,
} from './styles';

const MailingDetailsModal = ({ isOpen, mailingId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // подгрузка данных при открытии
  useEffect(() => {
    if (!isOpen || !mailingId) return;

    let alive = true;
    setLoading(true);
    setData(null);

    (async () => {
      try {
        const res = await axiosInstance.get(`/mailings/${mailingId}`);
        if (alive) setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isOpen, mailingId]);

  const rawTz = useSelector((state) => state.user?.timezone || 'Europe/Moscow');
  const normalizeTz = (tz) => {
    if (!tz) return 'Europe/Moscow';
    const s = String(tz);
    if (s === 'Europe/Moscow') return s;
    try {
      // eslint-disable-next-line no-new
      new Intl.DateTimeFormat('ru-RU', { timeZone: s });
      return s;
    } catch (e) {
      const lower = s.toLowerCase();
      if (lower.includes('moscow') || lower.includes('моск')) return 'Europe/Moscow';
      return 'Europe/Moscow';
    }
  };
  const tz = normalizeTz(rawTz);

  const formattedDate = useMemo(() => {
    if (!data?.dateTime) return '';
    try {
      const iso = data.dateTime || '';
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
      return `${parts.day}-${parts.month}-${parts.year} ${parts.hour}:${parts.minute}`;
    } catch (e) {
      return data.dateTime;
    }
  }, [data?.dateTime, tz]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <Center>
            <Spinner size={48} strokeWidth={1.4} />
          </Center>
        ) : !data ? (
          <Empty>Рассылка не найдена</Empty>
        ) : (
          <>
            <Header>
              <Title>{data.name}</Title>
              <CloseBtn onClick={onClose}>×</CloseBtn>
            </Header>

            <Field>
              <strong>Дата создания:</strong> {formattedDate}
            </Field>
            <Field>
              <strong>Получатели:</strong>{' '}
              {/^Сегмент:\s*(.+)$/i.test(data?.name || '')
                ? `Сегмент: ${(/^Сегмент:\s*(.+)$/i.exec(data?.name || '')?.[1] || '').trim()}`
                : data.recipients === 'all'
                  ? 'Всем'
                  : `Сегмент: ${(data.recipients || '').trim()}`}
            </Field>
            <Field>
              <strong>Тип рассылки:</strong> {data.mailingType}
            </Field>
            <Field>
              <strong>Статус:</strong> {data.status}
            </Field>

            {data.message && (
              <MessageWrap>
                <strong>Сообщение:</strong>
                <Message>{data.message}</Message>
              </MessageWrap>
            )}
          </>
        )}
      </Modal>
    </Overlay>
  );
};

export default MailingDetailsModal;
