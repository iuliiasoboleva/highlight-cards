import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../../axiosInstance';

const MailingDetailsModal = ({ isOpen, mailingId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !mailingId) return;

    (async () => {
      try {
        const res = await axiosInstance.get(`/mailings/${mailingId}`);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, mailingId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Loader2 className="spinner" size={48} strokeWidth={1.4} />
          </div>
        ) : !data ? (
          <p style={{ textAlign: 'center' }}>Рассылка не найдена</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{data.name}</h3>
              <button className="btn-light" onClick={onClose}>
                ×
              </button>
            </div>
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
              <div style={{ marginTop: 12 }}>
                <strong>Сообщение:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{data.message}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MailingDetailsModal; 