import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
import { mockClients } from '../../mocks/clientsInfo';
import { setClients, updateCard } from '../../store/clientsSlice';
import {
  Actions,
  Container,
  CustomerName,
  Header,
  Hint,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  Row,
  RowLabel,
  RowValue,
  SectionCard,
  SectionTitle,
  StampControls,
  Title,
} from './styles';

const CustomerPage = () => {
  const { cardNumber } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();

  const clients = useSelector((state) => state.clients);

  const [stampsToAdd, setStampsToAdd] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(setClients(mockClients));
  }, [dispatch]);

  const customerWithCard = mockClients.find((client) =>
    client?.cards?.some((card) => card.cardNumber === cardNumber),
  );

  const selectedCard = customerWithCard?.cards?.find((card) => card.cardNumber === cardNumber);
  const selectedCardIndex = customerWithCard?.cards?.findIndex(
    (card) => card.cardNumber === cardNumber,
  );

  if (!customerWithCard || !selectedCard || selectedCardIndex === -1) {
    return <Container>Карта не найдена</Container>;
  }

  const mockApiCall = (action, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updates = {};

          switch (action) {
            case 'addStamps':
              updates.activeStorage = (selectedCard.activeStorage || 0) + data.amount;
              updates.stamps = (selectedCard.stamps || 0) + data.amount;
              updates.lastAccrual = new Date().toLocaleDateString();
              break;

            case 'addReward':
              updates.availableRewards = (selectedCard.availableRewards || 0) + 1;
              updates.lastRewardReceived = new Date().toLocaleDateString();
              break;

            case 'receiveReward':
              if ((selectedCard.availableRewards || 0) <= 0) {
                throw new Error('Нет доступных наград');
              }
              updates.availableRewards = (selectedCard.availableRewards || 0) - 1;
              updates.lastRewardReceived = new Date().toLocaleDateString();
              updates.activeStorage =
                (selectedCard.activeStorage || 0) >= 10
                  ? (selectedCard.activeStorage || 0) - 10
                  : selectedCard.activeStorage || 0;
              break;

            default:
              break;
          }

          dispatch(updateCard({ cardNumber, updates }));
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 800);
    });
  };

  const handleReceiveReward = async () => {
    setIsLoading(true);
    try {
      await mockApiCall('receiveReward');
      toast.success('Награда успешно получена! Спасибо за обслуживание клиента');
    } catch (error) {
      toast.error(error.message || 'Ошибка при получении награды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStamps = async () => {
    const amount = Number(stampsToAdd);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      toast.error('Введите корректное количество штампов');
      return;
    }

    setIsLoading(true);
    try {
      await mockApiCall('addStamps', { amount: parseInt(amount, 10) });
      setStampsToAdd('');
      toast.success(`Добавлено ${amount} штампов! Спасибо за обслуживание клиента`);
    } catch (error) {
      toast.error('Ошибка при добавлении штампов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReward = async () => {
    setIsLoading(true);
    try {
      await mockApiCall('addReward');
      toast.success('Награда добавлена! Спасибо за обслуживание клиента');
    } catch (error) {
      toast.error('Ошибка при добавлении награды');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          Клиент: <CustomerName>{customerWithCard.name}</CustomerName>
        </Title>
      </Header>

      <Actions>
        <CustomMainButton onClick={handleAddReward} disabled={isLoading}>
          {isLoading ? 'Обработка...' : 'Добавить награду'}
        </CustomMainButton>

        <CustomMainButton
          onClick={handleReceiveReward}
          disabled={isLoading || (selectedCard.availableRewards || 0) <= 0}
        >
          {isLoading ? 'Обработка...' : 'Получить награду'}
        </CustomMainButton>
      </Actions>

      <SectionCard>
        <SectionTitle>Добавить штампы:</SectionTitle>
        <StampControls>
          <CustomInput
            type="number"
            min="1"
            value={stampsToAdd}
            onChange={(e) => setStampsToAdd(e.target.value)}
            placeholder="Количество штампов"
            disabled={isLoading}
          />
          <CustomMainButton onClick={handleAddStamps} disabled={isLoading || !stampsToAdd}>
            {isLoading ? 'Добавление...' : 'Добавить'}
          </CustomMainButton>
        </StampControls>
      </SectionCard>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Текущие баллы:</InfoLabel>
          <InfoValue>{selectedCard.activeStorage}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Доступные награды:</InfoLabel>
          <InfoValue>{selectedCard.availableRewards}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Последняя награда:</InfoLabel>
          <InfoValue>{selectedCard.lastRewardReceived || '—'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Последнее начисление:</InfoLabel>
          <InfoValue>{selectedCard.lastAccrual || '—'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Срок действия карты:</InfoLabel>
          <InfoValue>{selectedCard.cardExpirationDate || '—'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Дата регистрации:</InfoLabel>
          <InfoValue>{selectedCard.cardInstallationDate || '—'}</InfoValue>
        </InfoItem>
      </InfoGrid>

      <Row>
        <RowLabel>Номер карты:</RowLabel>
        <RowValue>{selectedCard.serialNumber}</RowValue>
      </Row>

      <Row>
        <RowLabel>Статус:</RowLabel>
        <RowValue>{selectedCard.ageInfo || '—'}</RowValue>
      </Row>

      <Hint>Введите количество штампов и нажмите «Добавить» для начисления баллов.</Hint>
    </Container>
  );
};

export default CustomerPage;
