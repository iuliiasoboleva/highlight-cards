import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import LoaderCentered from '../../components/LoaderCentered';
import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
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
  QuickButtons,
  QuickButton,
  LimitInfo,
} from './styles';

const CustomerPage = () => {
  const { cardNumber } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state) => state.user);

  const [client, setClient] = useState(null);
  const [card, setCard] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const loadedCardRef = useRef(null);

  useEffect(() => {
    const loadClient = async () => {
      if (!user?.organization_id) {
        toast.error('Необходима авторизация');
        navigate('/login');
        return;
      }

      // Если уже загрузили эту карту, не грузим снова
      if (hasLoadedRef.current && loadedCardRef.current === cardNumber) {
        return;
      }

      try {
        const response = await axiosInstance.get(`/clients/card/${cardNumber}`);
        const clientData = response.data;
        
        setClient(clientData);
        
        const foundCard = clientData.cards?.find(c => c.cardNumber === cardNumber);
        setCard(foundCard || null);
        hasLoadedRef.current = true;
        loadedCardRef.current = cardNumber;
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Необходима авторизация');
          navigate('/login');
        } else if (error.response?.status === 403) {
          toast.error('Нет доступа к данным этого клиента');
          navigate('/clients');
        } else if (error.response?.status === 404) {
          toast.error('Клиент с таким номером карты не найден');
          navigate('/clients');
        } else {
          toast.error('Ошибка при загрузке данных клиента');
          navigate('/clients');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (cardNumber && user?.organization_id) {
      loadClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardNumber]);

  const reloadClient = async () => {
    try {
      const response = await axiosInstance.get(`/clients/card/${cardNumber}`);
      const clientData = response.data;
      setClient(clientData);
      
      const foundCard = clientData.cards?.find(c => c.cardNumber === cardNumber);
      setCard(foundCard || null);
    } catch (error) {
      console.error('Ошибка загрузки клиента:', error);
    }
  };

  if (loading) {
    return <LoaderCentered />;
  }

  if (!client || !card) {
    return <Container>Карта не найдена</Container>;
  }

  const handleAddStamps = async (amount = null) => {
    const stampsAmount = amount || Number(stampsToAdd);
    if (!stampsAmount || Number.isNaN(stampsAmount) || stampsAmount <= 0) {
      toast.error('Введите корректное количество штампов');
      return;
    }

    // Проверяем лимит на фронтенде
    const stampDailyLimit = card.stampDailyLimit || 999;
    const stampsToday = card.stampsToday || 0;
    
    if (stampsToday + stampsAmount > stampDailyLimit) {
      toast.error(`Превышен дневной лимит штампов. Лимит: ${stampDailyLimit}, уже выдано: ${stampsToday}`);
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          stamps: (card.stamps || 0) + stampsAmount,
          active_storage: (card.activeStorage || 0) + stampsAmount,
        }
      });
      
      setStampsToAdd('');
      toast.success(`Добавлено ${stampsAmount} штампов! Спасибо за обслуживание клиента`);
      await reloadClient();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ошибка при добавлении штампов';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickStamp = (amount) => {
    setStampsToAdd(amount.toString());
  };

  const handleAddReward = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          available_rewards: (card.availableRewards || 0) + 1,
        }
      });
      
      toast.success('Награда добавлена! Спасибо за обслуживание клиента');
      await reloadClient();
    } catch (error) {
      toast.error('Ошибка при добавлении награды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiveReward = async () => {
    if ((card.availableRewards || 0) <= 0) {
      toast.error('Нет доступных наград');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          available_rewards: (card.availableRewards || 0) - 1,
        }
      });
      
      toast.success('Награда успешно получена! Спасибо за обслуживание клиента');
      await reloadClient();
    } catch (error) {
      toast.error(error.message || 'Ошибка при получении награды');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          Клиент: <CustomerName>{client.name} {client.surname}</CustomerName>
        </Title>
      </Header>

      <CustomMainButton 
        onClick={() => navigate(`/clients/${client.id}`)}
        style={{ width: '100%', marginBottom: '16px' }}
      >
        Перейти к профилю клиента
      </CustomMainButton>

      <Actions>
        <CustomMainButton onClick={handleAddReward} disabled={isLoading}>
          {isLoading ? 'Обработка...' : 'Добавить награду'}
        </CustomMainButton>

        <CustomMainButton
          onClick={handleReceiveReward}
          disabled={isLoading || (card.availableRewards || 0) <= 0}
        >
          {isLoading ? 'Обработка...' : 'Получить награду'}
        </CustomMainButton>
      </Actions>

      <SectionCard>
        <SectionTitle>Добавить штампы:</SectionTitle>
        <StampControls>
          {card.stampDailyLimit && card.stampDailyLimit < 999 && (
            <LimitInfo isLimitReached={(card.stampsToday || 0) >= card.stampDailyLimit}>
              Лимит в день: {card.stampDailyLimit} | Выдано сегодня: {card.stampsToday || 0}
              {(card.stampsToday || 0) >= card.stampDailyLimit && ' | Лимит достигнут!'}
            </LimitInfo>
          )}
          
          <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
              Быстрый выбор:
            </div>
            <QuickButtons>
              {[1, 2, 3, 4, 5].map((num) => {
                const isDisabled = isLoading || (card.stampsToday || 0) + num > (card.stampDailyLimit || 999);
                return (
                  <QuickButton
                    key={num}
                    onClick={() => handleQuickStamp(num)}
                    disabled={isDisabled}
                  >
                    {num}
                  </QuickButton>
                );
              })}
            </QuickButtons>
          </div>
          
          <CustomInput
            type="number"
            min="1"
            value={stampsToAdd}
            onChange={(e) => setStampsToAdd(e.target.value)}
            placeholder="Или введите количество штампов"
            disabled={isLoading || (card.stampsToday || 0) >= (card.stampDailyLimit || 999)}
          />
          <CustomMainButton 
            onClick={() => handleAddStamps()} 
            disabled={
              isLoading || 
              !stampsToAdd || 
              (card.stampsToday || 0) >= (card.stampDailyLimit || 999) ||
              (card.stampsToday || 0) + Number(stampsToAdd) > (card.stampDailyLimit || 999)
            }
          >
            {isLoading ? 'Добавление...' : 'Добавить'}
          </CustomMainButton>
        </StampControls>
      </SectionCard>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Текущие штампы:</InfoLabel>
          <InfoValue>{card.stamps || 0}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Активное хранилище:</InfoLabel>
          <InfoValue>{card.activeStorage || 0}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Доступные награды:</InfoLabel>
          <InfoValue>{card.availableRewards || 0}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Последняя награда:</InfoLabel>
          <InfoValue>{card.lastRewardReceived || '—'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Последнее начисление:</InfoLabel>
          <InfoValue>{card.lastAccrual || '—'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Срок действия карты:</InfoLabel>
          <InfoValue>{card.cardExpirationDate || 'Без срока'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Дата выпуска карты:</InfoLabel>
          <InfoValue>{card.cardCreatedAt || '—'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Кешбэк баланс:</InfoLabel>
          <InfoValue>{card.cashbackBalance || 0}</InfoValue>
        </InfoItem>
      </InfoGrid>

      <Row>
        <RowLabel>Номер карты:</RowLabel>
        <RowValue>{card.cardNumber}</RowValue>
      </Row>

      <Row>
        <RowLabel>Телефон:</RowLabel>
        <RowValue>{client.phone || '—'}</RowValue>
      </Row>

      <Row>
        <RowLabel>Email:</RowLabel>
        <RowValue>{client.email || '—'}</RowValue>
      </Row>

      <Hint>Введите количество штампов и нажмите «Добавить» для начисления баллов.</Hint>
    </Container>
  );
};

export default CustomerPage;
