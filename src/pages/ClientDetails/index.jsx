import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import CustomTable from '../../components/CustomTable';
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
              <CardTag>{card.name}</CardTag>

              {card.id && (
                <CardTag
                  as="a"
                  href={`${axiosInstance.defaults.baseURL || ''}/passes/${card.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apple&nbsp;Wallet
                </CardTag>
              )}
            </React.Fragment>
          ))
        ) : (
          <NoCards>Нет привязанных карт</NoCards>
        )}
      </Cards>

      <StatGrid>
        <StatCard stats={prepareStats(client)} />
      </StatGrid>

      <div>
        <TableName>Последние транзакции по карте</TableName>
        <CustomTable columns={clientHeaders} rows={transactions} />
      </div>
    </Container>
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
