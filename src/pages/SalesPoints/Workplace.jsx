import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Camera, Search } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
import CustomMainButton from '../../customs/CustomMainButton';
import { CARD_LENGTH, CARD_MIN_LENGTH, normalizeDigits, validateCard } from '../../utils/cardUtils';
import { Card, Grid, Header, IconWithTooltip, Page, ScannerIcon, Tooltip } from './styles';

const Workplace = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const user = useSelector((state) => state.user);

  const [cardNumber, setCardNumber] = useState('');

  const onCardChange = (e) => {
    const digits = normalizeDigits(e.target.value).slice(0, CARD_LENGTH);
    setCardNumber(digits);
  };

  const handleFindCustomer = async () => {
    const trimmedCard = (cardNumber || '').trim();
    const err = validateCard(trimmedCard);
    if (err) {
      toast.error(err);
      return;
    }

    try {
      const response = await axiosInstance.get(`/clients/card/${trimmedCard}`);
      const foundClient = response.data;

      if (foundClient?.cards?.length) {
        navigate(`/customer/card/${trimmedCard}`);
      } else {
        toast.error('Карта не найдена');
      }
    } catch (error) {
      toast.error('Клиент с таким номером карты не найден');
    }
  };

  return (
    <Page>
      <Header>
        <h2>Менеджеры</h2>
        <p>
          {user?.name ? `Здравствуйте, ${user.name}! ` : 'Здравствуйте! '}
          Здесь доступны только рабочие инструменты: поиск клиента по номеру карты и сканер QR-кодов.
        </p>
      </Header>

      <Grid>
        <Card onClick={(e) => e.preventDefault()}>
          <h3>Поиск клиента по карте</h3>
          <p>
            Введите номер карты лояльности и сразу переходите в профиль клиента. Можно использовать,
            когда сканер недоступен.
          </p>

          <ScannerIcon>
            <IconWithTooltip onClick={(e) => e.stopPropagation()}>
              <Search size={18} />
              <Tooltip>
                Введите от {CARD_MIN_LENGTH} до {CARD_LENGTH} цифр и нажмите «Найти клиента»
              </Tooltip>
            </IconWithTooltip>
          </ScannerIcon>

          <CustomInput
            type="tel"
            inputMode="numeric"
            placeholder={`Номер карты (${CARD_MIN_LENGTH}-${CARD_LENGTH} цифр)`}
            value={cardNumber}
            onChange={onCardChange}
            maxLength={CARD_LENGTH}
          />

          <CustomMainButton
            onClick={handleFindCustomer}
            disabled={cardNumber.length < CARD_MIN_LENGTH || cardNumber.length > CARD_LENGTH}
            $mt={10}
            $maxWidth={268}
          >
            Найти клиента
          </CustomMainButton>
        </Card>

        <Card onClick={() => navigate('/scan')}>
          <h3>Сканер QR-кодов</h3>
          <p>
            Откройте встроенный сканер и считывайте QR/штрих-коды карт прямо в браузере — это быстрее,
            чем вводить вручную.
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
