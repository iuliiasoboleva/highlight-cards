import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../../axiosInstance';
import LoaderCentered from '../../components/LoaderCentered';
import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
import CustomModal from '../../customs/CustomModal';
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
  LimitInfo,
  QuickButton,
  QuickButtons,
  Row,
  RowLabel,
  RowValue,
  SectionCard,
  SectionTitle,
  StampControls,
  SecondaryButton,
  TransactionsTable,
  TransactionsEmpty,
  Title,
} from './styles';

const CustomerPage = () => {
  const { cardNumber } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state) => state.user);

  const [client, setClient] = useState(null);
  const [card, setCard] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [cardDetailsLoading, setCardDetailsLoading] = useState(false);
  const [stampsToAdd, setStampsToAdd] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [customCashback, setCustomCashback] = useState('');
  const [cashbackToSpend, setCashbackToSpend] = useState('');
  const [certificateWriteoff, setCertificateWriteoff] = useState('');
  const [certificateProcessing, setCertificateProcessing] = useState(false);
  const [certificateConfirm, setCertificateConfirm] = useState({ open: false, amount: 0 });
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
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

        const foundCard = clientData.cards?.find((c) => c.cardNumber === cardNumber);
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
      // Сбрасываем флаг загрузки, чтобы можно было перезагрузить
      hasLoadedRef.current = false;
      loadedCardRef.current = null;

      // Добавляем timestamp для избежания кеша
      const response = await axiosInstance.get(`/clients/card/${cardNumber}?t=${Date.now()}`);
      const clientData = response.data;
      setClient(clientData);

      const foundCard = clientData.cards?.find((c) => c.cardNumber === cardNumber);
      setCard(foundCard || null);

      // Восстанавливаем флаг после успешной загрузки
      hasLoadedRef.current = true;
      loadedCardRef.current = cardNumber;
    } catch (error) {
      console.error('Ошибка загрузки клиента:', error);
    }
  };

  const fetchTransactions = async (cardUuid) => {
    if (!cardUuid) {
      setTransactions([]);
      setTransactionsLoading(false);
      return;
    }

    setTransactionsLoading(true);
    try {
      const res = await axiosInstance.get(`/clients/transactions/${cardUuid}`);
      setTransactions(res.data || []);
    } catch (error) {
      console.error('Ошибка загрузки истории операций:', error);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    if (!card?.cardUuid) {
      setCardDetails(null);
      setTransactions([]);
      setTransactionsLoading(false);
      return;
    }

    let cancelled = false;
    setCardDetails(null);
    setCardDetailsLoading(true);

    axiosInstance
      .get(`/cards/${card.cardUuid}`)
      .then((res) => {
        if (!cancelled) {
          setCardDetails(res.data);
        }
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных карты:', error);
      })
      .finally(() => {
        if (!cancelled) {
          setCardDetailsLoading(false);
        }
      });

    fetchTransactions(card.cardUuid);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.cardUuid]);

  if (loading) {
    return <LoaderCentered />;
  }

  if (!client || !card) {
    return <Container>Карта не найдена</Container>;
  }

  const cardType = cardDetails?.status || cardDetails?.card_type || card?.type;
  const isStampCard = cardType === 'stamp';
  const isSubscriptionCard = cardType === 'subscription';
  const isStampLikeCard = isStampCard || isSubscriptionCard;
  const isCashbackCard = cardType === 'cashback';
  const isDiscountCard = cardType === 'discount';
  const isCertificateCard = cardType === 'certificate';
  const currentCashbackBalance = card.cashbackBalance || 0;
  const stampEntityName = isSubscriptionCard ? 'посещений' : 'штампов';
  const EVENT_LABELS = {
    stamp_add: 'Начисление штампов',
    reward_given: 'Добавление награды',
    reward_received: 'Получение награды',
    cashback_accrued: 'Начисление кешбэка',
    cashback_spent: 'Списание кешбэка',
    certificate_spend: 'Списание сертификата',
  };
  const getEventLabel = (event) => EVENT_LABELS[event] || event || 'Операция';
  const formatTransactionAmount = (tx) => {
    const value = tx.quantity ?? tx.amount ?? '';
    if (value === '' || value === null || Number.isNaN(Number(value))) {
      return '—';
    }
    return `${value}`;
  };
  const certificateInfo = card.certificateInfo || {};
  const certificateBalanceValue =
    (certificateInfo && certificateInfo.amount !== undefined ? certificateInfo.amount : undefined) ??
    card.certificateBalance ??
    cardDetails?.balanceMoney;
  const parsedCertificateBalance = Number(certificateBalanceValue);
  const certificateBalance = Number.isFinite(parsedCertificateBalance)
    ? Math.max(0, parsedCertificateBalance)
    : 0;

  const getExpirationMeta = (value) => {
    const raw = (value || '').trim();
    if (!raw || raw === '00.00.0000' || raw === '0000-00-00') {
      return { text: 'Бессрочно', color: '#2c3e50' };
    }
    const normalized = raw.replace(/[\\/]/g, '.');
    const parts = normalized.split('.');
    if (parts.length === 3) {
      const [dayStr, monthStr, yearStr] = parts;
      const day = Number(dayStr);
      const month = Number(monthStr);
      const year = Number(yearStr);
      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        const expiryDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        if (!Number.isNaN(expiryDate.getTime())) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expiryDate < today) {
            return { text: `Истёк ${normalized}`, color: '#e03131' };
          }
          return { text: `Действует до ${normalized}`, color: '#2f9e44' };
        }
      }
    }
    return { text: raw, color: '#2c3e50' };
  };

  const expirationInfo = getExpirationMeta(card.cardExpirationDate);

  const normalizeMoney = (value) => {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return 0;
    }
    return Math.round(numeric);
  };

  const getCashbackPercent = () => Number(cardDetails?.cashbackPercent || 0);

  const calculateAutoCashback = () => {
    const purchase = Number(purchaseAmount);
    const percent = getCashbackPercent();
    if (!purchase || Number.isNaN(purchase) || !percent) {
      return 0;
    }
    return Math.max(0, Math.round((purchase * percent) / 100));
  };

  const handleAddStamps = async (amount = null) => {
    const stampsAmount = amount || Number(stampsToAdd);
    if (!stampsAmount || Number.isNaN(stampsAmount) || stampsAmount <= 0) {
      toast.error(`Введите корректное количество ${stampEntityName}`);
      return;
    }

    // Проверяем лимит на фронтенде
    const stampDailyLimit = card.stampDailyLimit || 999;
    const stampsToday = card.stampsToday || 0;

    if (stampsToday + stampsAmount > stampDailyLimit) {
      toast.error(
        `Превышен дневной лимит ${stampEntityName}. Лимит: ${stampDailyLimit}, уже выдано: ${stampsToday}`,
      );
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          stamps: (card.stamps || 0) + stampsAmount,
          active_storage: (card.activeStorage || 0) + stampsAmount,
        },
      });

      setStampsToAdd('');
      toast.success(`Добавлено ${stampsAmount} ${stampEntityName}! Спасибо за обслуживание клиента`);
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
        },
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
        },
      });

      toast.success('Награда успешно получена! Спасибо за обслуживание клиента');
      await reloadClient();
    } catch (error) {
      toast.error(error.message || 'Ошибка при получении награды');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashbackAccrual = async () => {
    if (!isCashbackCard) {
      return;
    }

    const manualValue = normalizeMoney(customCashback);
    const autoValue = calculateAutoCashback();
    const amountToAdd = manualValue || autoValue;

    if (!amountToAdd) {
      toast.error('Введите сумму покупки или размер кешбэка');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          cashback_balance: currentCashbackBalance + amountToAdd,
          last_accrual: new Date().toLocaleString('ru-RU'),
        },
      });

      toast.success(`Начислено ${amountToAdd} ₽ кешбэка`);
      setPurchaseAmount('');
      setCustomCashback('');
      await reloadClient();
    } catch (error) {
      const message = error.response?.data?.detail || 'Ошибка при начислении кешбэка';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashbackRedeem = async () => {
    if (!isCashbackCard) {
      return;
    }

    const amountToSpend = normalizeMoney(cashbackToSpend);

    if (!amountToSpend) {
      toast.error('Введите сумму для списания');
      return;
    }

    if (amountToSpend > currentCashbackBalance) {
      toast.error('Недостаточно средств на балансе кешбэка');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          cashback_balance: currentCashbackBalance - amountToSpend,
          last_reward_received: new Date().toLocaleString('ru-RU'),
        },
      });

      toast.success(`Списано ${amountToSpend} ₽ кешбэка`);
      setCashbackToSpend('');
      await reloadClient();
    } catch (error) {
      const message = error.response?.data?.detail || 'Ошибка при списании кешбэка';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillCertificateBalance = () => {
    if (!isCertificateCard || certificateBalance <= 0) {
      return;
    }
    setCertificateWriteoff(String(certificateBalance));
  };

  const openCertificateConfirm = () => {
    if (!isCertificateCard) return;
    const amountToSpend = normalizeMoney(certificateWriteoff);
    if (!amountToSpend) {
      toast.error('Введите сумму для списания');
      return;
    }
    if (amountToSpend > certificateBalance) {
      toast.error('Недостаточно средств сертификата');
      return;
    }
    setCertificateConfirm({ open: true, amount: amountToSpend });
  };

  const handleCertificateRedeem = async () => {
    if (!isCertificateCard || !certificateConfirm.open) {
      return;
    }

    const amountToSpend = certificateConfirm.amount;
    setCertificateProcessing(true);
    try {
      const newBalance = Math.max(0, certificateBalance - amountToSpend);
      await axiosInstance.post('/clients/card-action', {
        card_number: cardNumber,
        updates: {
          certificate_info: {
            ...certificateInfo,
            amount: newBalance,
          },
        },
      });

      toast.success(`Списано ${amountToSpend} ₽, остаток ${newBalance} ₽`);
      setCertificateWriteoff('');
      setCertificateConfirm({ open: false, amount: 0 });
      setCardDetails((prev) => (prev ? { ...prev, balanceMoney: newBalance } : prev));
      await reloadClient();
      await fetchTransactions(card?.cardUuid);
    } catch (error) {
      const detail = error.response?.data?.detail || error.message || 'Ошибка при списании сертификата';
      toast.error(detail);
    } finally {
      setCertificateProcessing(false);
    }
  };

  const handleCertificateModalClose = () => {
    if (certificateProcessing) return;
    setCertificateConfirm({ open: false, amount: 0 });
  };

  const renderCashbackControls = () => {
    if (!isCashbackCard) {
      return null;
    }

    if (cardDetailsLoading && !cardDetails) {
      return (
        <SectionCard>
          <SectionTitle>Начисление кешбэка</SectionTitle>
          <LoaderCentered />
        </SectionCard>
      );
    }

    if (!cardDetails) {
      return (
        <SectionCard>
          <SectionTitle>Начисление кешбэка</SectionTitle>
          <p style={{ margin: 0 }}>Не удалось загрузить параметры карты. Обновите страницу.</p>
        </SectionCard>
      );
    }

    const percent = getCashbackPercent();
    const autoValue = calculateAutoCashback();
    const manualValue = normalizeMoney(customCashback);
    const accrualValue = manualValue || autoValue;

    return (
      <SectionCard>
        <SectionTitle>Начисление кешбэка</SectionTitle>
        <StampControls>
          <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
              Сумма покупки, ₽
            </div>
            <CustomInput
              type="number"
              min="0"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder="Введите сумму покупки"
              disabled={isLoading}
            />
          </div>

          <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
              Кешбэк вручную (опционально)
            </div>
            <CustomInput
              type="number"
              min="0"
              value={customCashback}
              onChange={(e) => setCustomCashback(e.target.value)}
              placeholder={`Авторасчёт: ${autoValue || 0} ₽`}
              disabled={isLoading}
            />
            <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '4px' }}>
              Процент карты: {percent ? `${percent}%` : 'не задан'}
            </div>
          </div>

          <CustomMainButton onClick={handleCashbackAccrual} disabled={isLoading || accrualValue <= 0}>
            {isLoading ? 'Обработка...' : `Начислить кешбэк${percent ? ` (${percent}%)` : ''}`}
          </CustomMainButton>
        </StampControls>

        <StampControls style={{ marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
              Списать кешбэк, ₽
            </div>
            <CustomInput
              type="number"
              min="0"
              value={cashbackToSpend}
              onChange={(e) => setCashbackToSpend(e.target.value)}
              placeholder={`Доступно: ${currentCashbackBalance} ₽`}
              disabled={isLoading || currentCashbackBalance <= 0}
            />
          </div>

          <CustomMainButton
            onClick={handleCashbackRedeem}
            disabled={isLoading || currentCashbackBalance <= 0 || normalizeMoney(cashbackToSpend) <= 0}
          >
            {isLoading ? 'Обработка...' : 'Списать кешбэк'}
          </CustomMainButton>
        </StampControls>
      </SectionCard>
    );
  };

  const renderInfoNotice = () => {
    if (isDiscountCard) {
      const percent = cardDetails?.discountPercent;
      const status = cardDetails?.discountStatus;
      return (
        <SectionCard>
          <SectionTitle>Скидочная карта</SectionTitle>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Текущая скидка: {percent ? `${percent}%` : 'нет данных'}
            {status ? ` (${status})` : ''}. Примените скидку вручную при расчёте заказа и подтвердите
            клиенту показом этой страницы.
          </p>
        </SectionCard>
      );
    }

    if (isCertificateCard) {
      const hasBalance = certificateBalance > 0;
      return (
        <SectionCard>
          <SectionTitle>Подарочный сертификат</SectionTitle>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Доступный баланс: <strong>{certificateBalance} ₽</strong>. Списание суммы фиксируется через форму
            ниже после оплаты на кассе.
          </p>
          <StampControls style={{ marginTop: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
                Сумма к списанию, ₽
              </div>
              <CustomInput
                type="number"
                min="0"
                value={certificateWriteoff}
                onChange={(e) => {
                  let raw = e.target.value;
                  if (raw.length > 1 && raw.startsWith('0')) {
                    raw = raw.replace(/^0+/, '') || '0';
                    e.target.value = raw;
                  }
                  setCertificateWriteoff(raw);
                }}
                placeholder={`Доступно: ${certificateBalance} ₽`}
                disabled={certificateProcessing || !hasBalance}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <SecondaryButton
                type="button"
                onClick={handleFillCertificateBalance}
                disabled={certificateProcessing || !hasBalance}
              >
                Весь баланс
              </SecondaryButton>
              <CustomMainButton
                onClick={openCertificateConfirm}
                disabled={
                  certificateProcessing || !hasBalance || normalizeMoney(certificateWriteoff) <= 0
                }
              >
                {certificateProcessing ? 'Обработка...' : 'Списать'}
              </CustomMainButton>
            </div>
          </StampControls>
        </SectionCard>
      );
    }

    return null;
  };

  const renderTransactionsHistory = () => (
    <SectionCard>
      <SectionTitle>История операций</SectionTitle>
      {transactionsLoading ? (
        <LoaderCentered />
      ) : transactions.length === 0 ? (
        <TransactionsEmpty>Пока нет операций по этой карте</TransactionsEmpty>
      ) : (
        <TransactionsTable>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Операция</th>
              <th>Кол-во / сумма</th>
              <th>Баланс</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.dateTime || '—'}</td>
                <td>{getEventLabel(tx.event)}</td>
                <td>{formatTransactionAmount(tx)}</td>
                <td>{tx.balance || '—'}</td>
              </tr>
            ))}
          </tbody>
        </TransactionsTable>
      )}
    </SectionCard>
  );

  const getCardHint = () => {
    if (isStampCard) {
      return 'Введите количество штампов и нажмите «Добавить».';
    }
    if (isSubscriptionCard) {
      return 'Отметьте посещения клиента и сохраните изменения.';
    }
    if (isCashbackCard) {
      return 'Начисляйте или списывайте кешбэк в зависимости от суммы покупки.';
    }
    if (isDiscountCard) {
      return 'Примените скидку вручную по значениям на странице.';
    }
    if (isCertificateCard) {
      return 'Проверьте баланс сертификата перед обслуживанием клиента.';
    }
    return '';
  };

  const infoItems = [
    {
      key: 'stamps',
      label: isSubscriptionCard ? 'Посещений зачтено' : 'Текущие штампы',
      value: card.stamps || 0,
      show: isStampLikeCard,
    },
    {
      key: 'storage',
      label: 'Активное хранилище',
      value: card.activeStorage || 0,
      show: isStampLikeCard,
    },
    {
      key: 'rewards_available',
      label: 'Доступные награды',
      value: card.availableRewards || 0,
      show: isStampLikeCard,
    },
    {
      key: 'cashback_balance',
      label: 'Баланс кешбэка',
      value: `${currentCashbackBalance} ₽`,
      show: isCashbackCard,
    },
    {
      key: 'cashback_percent',
      label: 'Процент кешбэка',
      value: cardDetails?.cashbackPercent ? `${cardDetails.cashbackPercent}%` : '—',
      show: isCashbackCard,
    },
    {
      key: 'last_accrual',
      label: 'Последнее начисление',
      value: card.lastAccrual || '—',
      show: isStampLikeCard || isCashbackCard,
    },
    {
      key: 'last_reward',
      label: 'Последняя награда',
      value: card.lastRewardReceived || '—',
      show: isStampLikeCard || isCashbackCard,
    },
    {
      key: 'discount_percent',
      label: 'Текущая скидка',
      value: cardDetails?.discountPercent ? `${cardDetails.discountPercent}%` : '—',
      show: isDiscountCard,
    },
    {
      key: 'discount_status',
      label: 'Статус клиента',
      value: cardDetails?.discountStatus || '—',
      show: isDiscountCard,
    },
    {
      key: 'certificate_balance',
      label: 'Баланс сертификата',
      value: `${certificateBalance} ₽`,
      show: isCertificateCard,
    },
    {
      key: 'card_expiration',
      label: 'Срок действия карты',
      value: expirationInfo.text,
      color: expirationInfo.color,
      show: true,
    },
    {
      key: 'card_created',
      label: 'Дата выпуска карты',
      value: card.cardCreatedAt || '—',
      show: true,
    },
  ].filter((item) => item.show);

  const hintText = getCardHint();

  return (
    <Container>
      <Header>
        <Title>
          Клиент:{' '}
          <CustomerName>
            {client.name} {client.surname}
          </CustomerName>
        </Title>
      </Header>

      <CustomMainButton
        onClick={() => navigate(`/clients/${client.id}`)}
        style={{ width: '100%', marginBottom: '16px' }}
      >
        Перейти к профилю клиента
      </CustomMainButton>

      {isStampLikeCard && (
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
      )}

      {isStampLikeCard && (
        <SectionCard>
          <SectionTitle>
            {isSubscriptionCard ? 'Добавить посещения:' : 'Добавить штампы:'}
          </SectionTitle>
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
                  const isDisabled =
                    isLoading || (card.stampsToday || 0) + num > (card.stampDailyLimit || 999);
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
              onChange={(e) => {
                let raw = e.target.value;
                if (raw.length > 1 && raw.startsWith('0')) {
                  raw = raw.replace(/^0+/, '') || '1';
                  e.target.value = raw;
                }
                setStampsToAdd(raw);
              }}
              placeholder={`Или введите количество ${stampEntityName}`}
              disabled={isLoading || (card.stampsToday || 0) >= (card.stampDailyLimit || 999)}
            />
            <CustomMainButton
              onClick={() => handleAddStamps()}
              disabled={
                isLoading ||
                !stampsToAdd ||
                Number(stampsToAdd) <= 0 ||
                (card.stampsToday || 0) >= (card.stampDailyLimit || 999) ||
                (card.stampsToday || 0) + Number(stampsToAdd) > (card.stampDailyLimit || 999)
              }
            >
              {isLoading ? 'Добавление...' : 'Добавить'}
            </CustomMainButton>
          </StampControls>
        </SectionCard>
      )}

      {renderCashbackControls()}
      {renderInfoNotice()}
      {renderTransactionsHistory()}

      <InfoGrid>
        {infoItems.map((item) => (
          <InfoItem key={item.key}>
            <InfoLabel>{item.label}</InfoLabel>
            <InfoValue $color={item.color}>{item.value}</InfoValue>
          </InfoItem>
        ))}
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

      {hintText && <Hint>{hintText}</Hint>}

      <CustomModal
        open={certificateConfirm.open}
        onClose={handleCertificateModalClose}
        closeOnOverlayClick={!certificateProcessing}
        title="Подтверждение списания"
        aria-label="Подтверждение списания сертификата"
        actions={
          <>
            <CustomModal.SecondaryButton
              type="button"
              onClick={handleCertificateModalClose}
              disabled={certificateProcessing}
            >
              Отмена
            </CustomModal.SecondaryButton>
            <CustomModal.PrimaryButton
              type="button"
              onClick={handleCertificateRedeem}
              disabled={certificateProcessing}
            >
              {certificateProcessing ? 'Списываю...' : `Списать ${certificateConfirm.amount} ₽`}
            </CustomModal.PrimaryButton>
          </>
        }
      >
        <p>
          Списать <strong>{certificateConfirm.amount} ₽</strong> с подарочного сертификата?
          После списания останется{' '}
          <strong>{Math.max(0, certificateBalance - certificateConfirm.amount)} ₽</strong>.
        </p>
        <p style={{ marginTop: 8, color: '#7f8c8d', fontSize: 14 }}>
          Операция фиксируется только после подтверждения. Проверьте сумму перед продолжением.
        </p>
      </CustomModal>
    </Container>
  );
};

export default CustomerPage;
