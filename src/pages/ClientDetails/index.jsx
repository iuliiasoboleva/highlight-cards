import React, { useEffect, useMemo, useState } from 'react';
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

const PAGE_SIZE_OPTIONS = [3, 5, 10, 20, 50];
const EVENT_LABELS = {
  stamp_add: 'Начисление штампов',
  reward_given: 'Добавление награды',
  reward_received: 'Получение награды',
  cashback_accrued: 'Начисление кешбэка',
  cashback_spent: 'Списание кешбэка',
  certificate_spend: 'Списание сертификата',
  certificate_adjustment: 'Корректировка',
};

const PLACEHOLDER = '—';

const toCleanString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  try {
    return String(value).trim();
  } catch (e) {
    return '';
  }
};

const normalizeKey = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const pickIssueFieldValue = (fields, candidates) => {
  if (!Array.isArray(fields) || !candidates?.length) return '';
  const normalized = candidates.map((item) => normalizeKey(item)).filter(Boolean);
  if (!normalized.length) return '';
  const match = fields.find((field) => {
    const type = normalizeKey(field?.type);
    const name = normalizeKey(field?.name);
    const label = normalizeKey(field?.label);
    return normalized.some((target) => type === target || name === target || label === target);
  });
  return toCleanString(match?.value);
};

const buildOwnerDetails = (clientData) => {
  if (!clientData) {
    return { name: '', phone: '', email: '' };
  }
  const issueFields = clientData.issueFields;
  const phoneFromIssue = pickIssueFieldValue(issueFields, ['phone', 'phone_number', 'телефон']);
  const emailFromIssue = pickIssueFieldValue(issueFields, ['email', 'e-mail', 'почта']);
  const fallbackFirstName = pickIssueFieldValue(issueFields, ['name', 'first_name', 'имя']);
  const resolvedName = toCleanString(clientData.name) || fallbackFirstName;
  const resolvedSurname = toCleanString(clientData.surname);
  const fullName = [resolvedName, resolvedSurname].filter(Boolean).join(' ');
  return {
    name: fullName,
    phone: toCleanString(clientData.phone) || phoneFromIssue || '',
    email: toCleanString(clientData.email) || emailFromIssue || '',
  };
};

const getCardTransactionsId = (card) => {
  if (!card) return '';
  const candidates = [
    card.cardUuid,
    card.card_uuid,
    card.cardUUID,
    card.cardUuidV2,
    card.card_uuid_v2,
    card.uuid_v2,
  ];
  return candidates.map(toCleanString).find(Boolean) || '';
};

const enhanceTransactionWithOwner = (transaction, owner) => {
  const safeOwner = owner || { name: '', phone: '', email: '' };
  return {
    ...transaction,
    userName: transaction.userName || safeOwner.name || PLACEHOLDER,
    phone: transaction.phone || safeOwner.phone || PLACEHOLDER,
    email: transaction.email || safeOwner.email || PLACEHOLDER,
  };
};

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPageSize, setTransactionsPageSize] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const ownerDetails = useMemo(() => buildOwnerDetails(client), [client]);

  const fetchTransactions = async (
    cardId,
    page = transactionsPage,
    limit = transactionsPageSize,
    ownerMeta = ownerDetails,
  ) => {
    if (!cardId) {
      setTransactions([]);
      setTransactionsTotal(0);
      return;
    }
    setTransactionsLoading(true);
    try {
      const txRes = await axiosInstance.get(`/clients/transactions/${cardId}`, { params: { page, limit } });
      const txData = txRes.data?.items || txRes.data || [];
      const mapped = txData.map((tx) =>
        enhanceTransactionWithOwner(
          {
            ...tx,
            event: EVENT_LABELS[tx.event] || tx.event,
          },
          ownerMeta,
        ),
      );
      setTransactions(mapped);
      setTransactionsTotal(txRes.data?.total ?? txData.length);
    } catch (txErr) {
      console.error(txErr);
      setTransactions([]);
      setTransactionsTotal(0);
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/clients/${id}`);
        const clientData = res.data;
        setClient(clientData);

        const ownerMeta = buildOwnerDetails(clientData);
        const firstCard = clientData.cards && clientData.cards.length ? clientData.cards[0] : null;
        const cardIdentifier = getCardTransactionsId(firstCard);
        if (cardIdentifier) {
          await fetchTransactions(cardIdentifier, 1, transactionsPageSize, ownerMeta);
          setTransactionsPage(1);
        } else {
          setTransactions([]);
          setTransactionsTotal(0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, transactionsPageSize]);

  const handlePageSizeChange = async (value) => {
    const numeric = Number(value) || transactionsPageSize;
    setTransactionsPageSize(numeric);
    setTransactionsPage(1);
    const firstCard = client?.cards && client.cards.length ? client.cards[0] : null;
    const cardIdentifier = getCardTransactionsId(firstCard);
    if (cardIdentifier) {
      await fetchTransactions(cardIdentifier, 1, numeric, ownerDetails);
    }
  };

  const handlePageChange = async (nextPage) => {
    const totalPages = Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1);
    if (nextPage < 1 || nextPage > totalPages || nextPage === transactionsPage) return;
    setTransactionsPage(nextPage);
    const firstCard = client?.cards && client.cards.length ? client.cards[0] : null;
    const cardIdentifier = getCardTransactionsId(firstCard);
    if (cardIdentifier) {
      await fetchTransactions(cardIdentifier, nextPage, transactionsPageSize, ownerDetails);
    }
  };

  const renderTxControls = () => {
    const totalPages = Math.max(1, Math.ceil(transactionsTotal / transactionsPageSize) || 1);
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '12px',
        }}
      >
        <label style={{ fontSize: 14, color: '#7f8c8d', display: 'flex', alignItems: 'center', gap: 6 }}>
          Показать:
          <select
            value={transactionsPageSize}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #dcdcdc' }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => handlePageChange(transactionsPage - 1)}
            disabled={transactionsPage <= 1 || transactionsLoading}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #dcdcdc',
              background: transactionsPage <= 1 || transactionsLoading ? '#f1f1f1' : '#fff',
              cursor: transactionsPage <= 1 || transactionsLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Назад
          </button>
          <span style={{ fontSize: 13, color: '#7f8c8d' }}>
            Стр. {Math.min(transactionsPage, totalPages)} из {totalPages}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(transactionsPage + 1)}
            disabled={transactionsPage >= totalPages || transactionsLoading}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #dcdcdc',
              background: transactionsPage >= totalPages || transactionsLoading ? '#f1f1f1' : '#fff',
              cursor: transactionsPage >= totalPages || transactionsLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Вперёд
          </button>
        </div>
      </div>
    );
  };

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
              {card.type === 'certificate' && (card.uuid || card.cardUuid) && (
                <CardTag
                  as="a"
                  href={`/giftcard/${card.uuid || card.cardUuid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ cursor: 'pointer', border: 'none', background: '#c93542' }}
                >
                  🎁 Подарочный сертификат
                </CardTag>
              )}
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
        <CustomTable columns={clientHeaders} rows={transactions} loading={transactionsLoading} />
        {renderTxControls()}
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
          if (client.birthdate) {
            const parts = client.birthdate.split('/');
            if (parts.length === 3) {
              const [day, month, year] = parts;
              value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
          }
          break;
        case 'gender':
          value = client.gender || '';
          break;
        default:
          value = field.value || '';
      }

      return {
        label: field.name || field.label || '',
        type: field.type === 'birthday' ? 'date' : field.type === 'email' ? 'email' : field.type === 'gender' ? 'gender' : 'text',
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
