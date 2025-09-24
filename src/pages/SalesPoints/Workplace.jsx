import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { BarChart2, Camera, Search, User as UserIcon } from 'lucide-react';

import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
import { CARD_LENGTH, normalizeDigits, validateCard } from '../../utils/cardUtils';
import { Card, Grid, Header, IconWithTooltip, Page, ScannerIcon, Tooltip } from './styles';

const Workplace = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const user = useSelector((state) => state.user);
  const locations = useSelector((state) => state.locations.list);

  const clientsRaw = useSelector((state) => state.clients);
  const clients = Array.isArray(clientsRaw)
    ? clientsRaw
    : Array.isArray(clientsRaw?.list)
      ? clientsRaw.list
      : [];

  const [cardNumber, setCardNumber] = useState('');

  const userLocation = Array.isArray(locations)
    ? locations.find(
        (loc) =>
          Array.isArray(loc.employees) &&
          loc.employees.includes(`${user?.name || ''} ${user?.surname || ''}`.trim()),
      )
    : null;

  const onCardChange = (e) => {
    const digits = normalizeDigits(e.target.value).slice(0, CARD_LENGTH);
    setCardNumber(digits);
  };

  const handleFindCustomer = () => {
    const trimmedCard = (cardNumber || '').trim();
    const err = validateCard(trimmedCard);
    if (err) {
      toast.error(err);
      return;
    }

    const foundClient = clients.find(
      (client) =>
        Array.isArray(client?.cards) &&
        client.cards.some((card) => String(card?.cardNumber ?? '').trim() === trimmedCard),
    );

    if (foundClient) {
      const foundCard = foundClient.cards.find((card) => String(card?.cardNumber ?? '').trim() === trimmedCard);
      if (foundCard?.card?.uuid) {
        navigate(`/getpass/${foundCard.card.uuid}`);
      } else {
        toast.error('UUID карты не найден');
      }
    } else {
      toast.error('Клиент с таким номером карты не найден');
    }
  };

  if (!userLocation) {
    return (
      <Page>
        <Header>
          <h2>Рабочее место</h2>
          <p>Для вашего профиля не привязана точка продаж</p>
        </Header>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <h2>Рабочее место</h2>
        <p>
          Добро пожаловать,{' '}
          <strong>
            {user?.name || '—'} <strong>{user?.surname || ''}</strong>
          </strong>
          ! Вы находитесь в точке <strong>{userLocation.name}</strong>. Начните работу —
          отсканируйте карту клиента или введите номер карты и начислите баллы.
        </p>
      </Header>

      <Grid>
        <Card onClick={(e) => e.preventDefault()}>
          <h3>Информация о сотруднике</h3>
          <div>
            <p>
              Ваши точки продаж: <strong>{userLocation?.name || '—'}</strong>
            </p>
            <p>Адрес: {userLocation?.address || 'не указан'}</p>
            <p>Смена: —</p>
            <p>Статус: {user?.status || 'неизвестен'}</p>
          </div>

          <ScannerIcon>
            <IconWithTooltip onClick={(e) => e.stopPropagation()}>
              <UserIcon size={18} />
              <Tooltip>Ваш профиль сотрудника и назначенная точка</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>
        </Card>

        <Card onClick={(e) => e.preventDefault()}>
          <h3>Мини-отчёт по смене</h3>
          <p>
            - Обслужено клиентов: {user?.clientsServed ?? 0}
            <br />- Начислено баллов: {user?.pointsIssued ?? 0}
            <br />- Выдано подарков: {user?.giftsGiven ?? 0}
          </p>

          <ScannerIcon>
            <IconWithTooltip onClick={(e) => e.stopPropagation()}>
              <BarChart2 size={18} />
              <Tooltip>Краткая статистика по текущей смене</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>
        </Card>

        <Card onClick={(e) => e.preventDefault()}>
          <h3>Поиск по карте</h3>
          <p>
            Введите номер карты лояльности клиента, чтобы перейти к его профилю. Удобно, если нет
            приложения-сканера.
          </p>

          <ScannerIcon>
            <IconWithTooltip onClick={(e) => e.stopPropagation()}>
              <Search size={18} />
              <Tooltip>Введите {CARD_LENGTH} цифр и нажмите «Найти клиента»</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>

          <CustomInput
            type="tel"
            inputMode="numeric"
            placeholder={`Номер карты (${CARD_LENGTH} цифр)`}
            value={cardNumber}
            onChange={onCardChange}
            maxLength={CARD_LENGTH}
          />

          <CustomMainButton
            onClick={handleFindCustomer}
            disabled={cardNumber.length !== CARD_LENGTH}
            $mt={10}
            $maxWidth={268}
          >
            Найти клиента
          </CustomMainButton>
        </Card>

        <Card onClick={() => navigate('/scan')}>
          <h3>Сканер QR-кодов</h3>
          <p>
            Сканер QR-кодов — инструмент для ваших менеджеров. Сканируйте карты лояльности клиентов
            прямо в браузере — быстро и удобно.
          </p>

          <ScannerIcon>
            <IconWithTooltip onClick={(e) => e.stopPropagation()}>
              <Camera size={18} />
              <Tooltip>Откройте встроенный сканер и считывайте QR/штрих-коды</Tooltip>
            </IconWithTooltip>
          </ScannerIcon>

          <CustomMainButton onClick={() => navigate('/scan')}>Открыть</CustomMainButton>
        </Card>
      </Grid>
    </Page>
  );
};

export default Workplace;
