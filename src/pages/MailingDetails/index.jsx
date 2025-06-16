import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../axiosInstance';

import './styles.css';

const MailingDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/mailings/${id}`);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="center-spinner">
        <Loader2 className="spinner" size={48} strokeWidth={1.4} />
      </div>
    );
  }

  if (!data) return <p style={{ textAlign: 'center' }}>Рассылка не найдена</p>;

  return (
    <div className="mailing-details-page">
      <h2>{data.name}</h2>
      <p>
        <strong>Дата создания:</strong> {data.dateTime}
      </p>
      <p>
        <strong>Получатели:</strong> {data.recipients === 'all' ? 'Всем' : data.recipients}
      </p>
      <p>
        <strong>Тип рассылки:</strong> {data.mailingType}
      </p>
      <p>
        <strong>Статус:</strong> {data.status}
      </p>
      {data.message && (
        <div className="mailing-message-block">
          <strong>Сообщение:</strong>
          <pre>{data.message}</pre>
        </div>
      )}
    </div>
  );
};

export default MailingDetails; 