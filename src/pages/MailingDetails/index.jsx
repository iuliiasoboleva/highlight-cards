import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import {
  CenterSpinner,
  Empty,
  FieldRow,
  MessageBlock,
  MessagePre,
  Page,
  SpinnerIcon,
  Title,
} from './styles';

const MailingDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await axiosInstance.get(`/mailings/${id}`);
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
  }, [id]);

  if (loading) {
    return (
      <CenterSpinner>
        <SpinnerIcon size={48} strokeWidth={1.4} />
      </CenterSpinner>
    );
  }

  if (!data) {
    return (
      <Page>
        <Empty>Рассылка не найдена</Empty>
      </Page>
    );
  }

  return (
    <Page>
      <Title>{data.name}</Title>

      <FieldRow>
        <strong>Дата создания:</strong> {data.dateTime}
      </FieldRow>
      <FieldRow>
        <strong>Получатели:</strong> {data.recipients === 'all' ? 'Всем' : data.recipients}
      </FieldRow>
      <FieldRow>
        <strong>Тип рассылки:</strong> {data.mailingType}
      </FieldRow>
      <FieldRow>
        <strong>Статус:</strong> {data.status}
      </FieldRow>

      {data.message && (
        <MessageBlock>
          <strong>Сообщение:</strong>
          <MessagePre>{data.message}</MessagePre>
        </MessageBlock>
      )}
    </Page>
  );
};

export default MailingDetails;
