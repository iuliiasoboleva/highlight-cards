import React, { useEffect, useState } from 'react';

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
              <strong>Дата создания:</strong> {data.dateTime}
            </Field>
            <Field>
              <strong>Получатели:</strong> {data.recipients === 'all' ? 'Всем' : data.recipients}
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
