import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import CustomTable from '../../components/CustomTable';
import DeleteClientModal from '../../components/DeleteClientModal';
import LoaderCentered from '../../components/LoaderCentered';
import { clientHeaders } from '../../mocks/mockClientTable';
import StatCard from './StatCard';
import './styles.jsx';
import {
  AvatarCircle,
  BoxContent,
  CardTag,
  Cards,
  Container,
  NoCards,
  Price,
  StatGrid,
  Sub,
  Subtitle,
  TableName,
  TariffBoxLeft,
  TariffBoxRight,
  TariffBoxes,
  Title,
} from './styles.jsx';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClient = async () => {
    try {
      await axiosInstance.delete(`/clients/${id}`);
      navigate('/clients'); // Возвращаемся к списку клиентов
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error);
      // Здесь можно добавить toast уведомление об ошибке
    }
  };

  if (loading) {
    return <LoaderCentered />;
  }

  if (!client)
    return (
      <Container>
        <p style={{ textAlign: 'center' }}>Клиент не найден</p>
      </Container>
    );

  return (
    <Container>
      <Title>Профиль пользователя</Title>

      <TariffBoxes>
        <TariffBoxLeft>
          <AvatarCircle>
            {client.name?.[0]?.toUpperCase()}
            {client.surname?.[0]?.toUpperCase()}
          </AvatarCircle>
          <BoxContent>
            <Price>
              {client.name} {client.surname}
            </Price>
            <Sub>Имя клиента</Sub>
          </BoxContent>
        </TariffBoxLeft>

        <TariffBoxRight>
          <BoxContent>
            <Price>{client.createdAt}</Price>
            <Sub>Дата регистрации </Sub>
          </BoxContent>
        </TariffBoxRight>
      </TariffBoxes>

      <Subtitle>Карты клиента</Subtitle>
      <Cards>
        {client.cards?.length > 0 ? (
          client.cards.map((card, index) => (
            <React.Fragment key={card.id || index}>
              {card.cardNumber && (
                <CardTag
                  as="button"
                  onClick={() => navigate(`/customer/card/${card.cardNumber}`)}
                  style={{ cursor: 'pointer', border: 'none', background: '#228be6' }}
                >
                  Управление картой
                </CardTag>
              )}
              {(card.uuid || card.cardNumber) && (
                <>
                  <CardTag
                    as="a"
                    href={`${(axiosInstance.defaults.baseURL || '').replace(/\/$/, '')}/passes/${card.uuid || card.cardNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apple Wallet
                  </CardTag>
                  <CardTag
                    as="a"
                    href={`${(axiosInstance.defaults.baseURL || '').replace(/\/$/, '')}/google-wallet/save/${card.uuid || card.cardNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: '8px' }}
                  >
                    Google Wallet
                  </CardTag>
                </>
              )}
            </React.Fragment>
          ))
        ) : (
          <NoCards>Нет привязанных карт</NoCards>
        )}
      </Cards>

      <StatGrid>
        <StatCard stats={prepareStats(client)} links={prepareLinks(client)} />
      </StatGrid>

      <div>
        <TableName>Последние транзакции по карте</TableName>
        <CustomTable columns={clientHeaders} rows={transactions} />
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            background: '#e03131',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Удалить клиента
        </button>
      </div>

      <DeleteClientModal
        open={showDeleteModal}
        clientName={client ? `${client.name} ${client.surname || ''}`.trim() : ''}
        onConfirm={() => {
          setShowDeleteModal(false);
          handleDeleteClient();
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Container>
  );
};

const prepareLinks = (client) => {
  const firstCard = client.cards && client.cards.length ? client.cards[0] : null;
  if (!firstCard) return [];

  // Используем urlCopy из данных карты, если он есть
  const cardUrl =
    firstCard.urlCopy || `https://app.loyalclub.ru/getpass/${firstCard.uuid || client.id}`;

  return [
    {
      label: 'Ссылка для установки / восстановления карты',
      url: cardUrl,
    },
    {
      label: 'Реферальная ссылка',
      url: `${cardUrl}?ref=${client.id}`,
    },
  ];
};

const prepareStats = (client) => {
  // Если статистики нет, отрисуем карточку с базовыми данными
  const stats = client?.stats || {
    ltv: client?.LTV || 0,
    totalStampsReceived: client?.stampQuantity || 0,
    rewardsIssued: client?.rewardsGiven || 0,
    rewardsAvailable: client?.availableRewards || 0,
    visits: client?.totalVisits || 0,
    currentStamps: client?.currentStamps || 0,
  };
  const firstCard = client.cards && client.cards.length ? client.cards[0] : null;
  const issueFields = client.issueFields;

  // Преобразуем issueFields в нужный формат
  const formatIssueFields = (fields) => {
    if (!fields || !Array.isArray(fields)) return null;

    return fields.map((field) => {
      let value = '';

      // Заполняем значения из данных клиента
      switch (field.type) {
        case 'name':
          value = client.name || '';
          break;
        case 'phone':
          value = client.phone || '';
          break;
        case 'email':
          value = client.email || '';
          break;
        case 'surname':
          value = client.surname || '';
          break;
        case 'birthday':
          value = client.birthday ? new Date(client.birthday).toISOString().split('T')[0] : '';
          break;
        default:
          value = field.value || '';
      }

      return {
        label: field.name || field.label || '',
        type: field.type === 'birthday' ? 'date' : field.type === 'email' ? 'email' : 'text',
        value: value,
      };
    });
  };
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
      value: firstCard?.walletInstalled ? 'Установлена' : 'Не установлена',
      valueColor: firstCard?.walletInstalled ? 'limegreen' : 'red',
      showRightCircle: false,
      small: true,
    },
    {
      key: 'card_number',
      label: 'Номер карты',
      value: firstCard?.cardNumber || '',
      copyable: true,
      showRightCircle: false,
    },
    {
      key: 'device_installed',
      label: 'Установлено в приложении',
      value: (() => {
        if (!firstCard?.walletInstalled) return '';
        if (firstCard.walletInstalled === 'apple') return 'Apple Wallet';
        if (firstCard.walletInstalled === 'google') return 'Google Wallet';
        if (firstCard.walletInstalled === 'both') return 'Apple Wallet, Google Wallet';
        return '';
      })(),
      showRightCircle: false,
    },
    {
      key: 'valid_until',
      label: 'Дата окончания действия карты',
      value: firstCard?.cardExpirationDate === '00.00.0000' ? 'Неограниченно' : (firstCard?.cardExpirationDate || 'Без срока'),
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
      value: firstCard?.cardCreatedAt || '',
      showRightCircle: false,
    },
    ...(issueFields
      ? [
          {
            key: 'issue_fields',
            label: 'Поля формы выдачи',
            isFormPopup: true,
            value: formatIssueFields(issueFields),
            showRightCircle: false,
          },
        ]
      : []),
  ];
};

export default ClientDetails;
