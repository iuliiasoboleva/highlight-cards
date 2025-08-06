import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import CustomTable from '../../components/CustomTable';
import LoaderCentered from '../../components/LoaderCentered';
import { clientHeaders } from '../../mocks/mockClientTable';
import StatCard from './StatCard';

import './styles.css';

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/clients/${id}`);
        const clientData = res.data;
        setClient(clientData);

        const firstCard = clientData.cards && clientData.cards.length ? clientData.cards[0] : null;
        if (firstCard && firstCard.id) {
          try {
            const txRes = await axiosInstance.get(`/clients/transactions/${firstCard.id}`);
            setTransactions(txRes.data || []);
          } catch (txErr) {
            console.error(txErr);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <LoaderCentered />;
  }

  if (!client) return <p style={{ textAlign: 'center' }}>Клиент не найден</p>;

  return (
    <div className="client-container">
      <h2 className="client-container-title">Профиль пользователя</h2>
      <div className="tariff-boxes">
        <div className="tariff-box tariff-box-left">
          <div className="avatar-circle">
            {client.name?.[0]?.toUpperCase()}
            {client.surname?.[0]?.toUpperCase()}
          </div>
          <div className="tariff-box-content">
            <div className="tariff-price">
              {client.name} {client.surname}
            </div>
            <div className="tariff-sub">Имя клиента</div>
          </div>
        </div>
        <div className="tariff-box tariff-box-right">
          <div className="tariff-box-content">
            <div className="tariff-price">{client.createdAt}</div>
            <div className="tariff-sub">Дата регистрации </div>
          </div>
        </div>
      </div>
      <p className="client-subtitle">Карты клиента</p>
      <div className="client-cards">
        {client.cards?.length > 0 ? (
          client.cards.map((card, index) => (
            <div className="client-card-tag" key={card.id || index}>
              {card.name}
              {card.id && (
                <a
                  href={`${axiosInstance.defaults.baseURL || ''}/passes/${card.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 8, fontSize: 12 }}
                >
                  Apple&nbsp;Wallet
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="no-cards">Нет привязанных карт</p>
        )}
      </div>
      <div className="stat-grid">
        <StatCard stats={prepareStats(client)} />
      </div>
      <div className="table-wrapper">
        <h3 className="table-name">Последние транзакции по карте</h3>
        <CustomTable columns={clientHeaders} rows={transactions} />
      </div>
    </div>
  );
};

const prepareStats = (client) => {
  if (!client?.stats) return [];
  const { stats } = client;
  const firstCard = client.cards && client.cards.length ? client.cards[0] : null;
  return [
    { key: 'ltv', label: 'LTV', value: stats.ltv, showRightCircle: false },
    {
      key: 'stamps_total',
      label: 'Штампов получено',
      value: stats.totalStampsReceived,
      showRightCircle: true,
    },
    {
      key: 'rewards_issued',
      label: 'Наград начислено',
      value: stats.rewardsIssued,
      showRightCircle: true,
    },
    {
      key: 'rewards_available',
      label: 'Наград доступно',
      value: stats.rewardsAvailable,
      showRightCircle: true,
    },
    {
      key: 'total_visits',
      label: 'Всего визитов',
      value: stats.visits,
      showRightCircle: true,
    },
    {
      key: 'current_stamps_quantity',
      label: 'Текущее количество штампов',
      value: stats.currentStamps,
      showRightCircle: true,
    },
    {
      key: 'last_stamp_received',
      label: 'Последний штамп зачислен',
      value: firstCard?.lastAccrual || '',
      showRightCircle: false,
    },
    {
      key: 'last_reward_received',
      label: 'Последняя награда получена',
      value: firstCard?.lastRewardReceived || '',
      showRightCircle: false,
    },
    {
      key: 'status',
      label: 'Статус',
      value: firstCard?.cardInstallationDate ? 'Установлена' : 'Не установлена',
      valueColor: firstCard?.cardInstallationDate ? 'limegreen' : 'red',
      showRightCircle: false,
      small: true,
    },
    {
      key: 'card_number',
      label: 'Серийный номер карты',
      value: firstCard?.serialNumber || '',
      copyable: true,
      showRightCircle: false,
    },
    {
      key: 'device_installed',
      label: 'Установлено в приложении',
      value: firstCard?.cardInstallationDate ? 'Apple Wallet' : '',
      showRightCircle: false,
    },
    {
      key: 'valid_until',
      label: 'Дата окончания действия карты',
      value: firstCard?.cardExpirationDate || null,
      isDatePicker: true,
      showRightCircle: false,
    },
    {
      key: 'utm',
      label: 'UTM метка',
      value: firstCard?.utm || 'Нет данных',
      isTag: true,
      showRightCircle: false,
    },
    {
      key: 'card_issue_date',
      label: 'Дата выпуска карты',
      value: firstCard?.cardInstallationDate || '',
      showRightCircle: false,
    },
  ];
};

export default ClientDetails;
