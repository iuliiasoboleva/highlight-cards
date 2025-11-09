import React from 'react';

import { Camera, PlusCircle, Search } from 'lucide-react';

import CustomInput from '../../../customs/CustomInput';
import CustomMainButton from '../../../customs/CustomMainButton';
import { CARD_LENGTH, CARD_MIN_LENGTH } from '../../../utils/cardUtils';
import { Card, IconWithTooltip, ScannerIcon, Tooltip } from '../styles';

const CardsBlock = ({
  cardNumber,
  onCardChange,
  handleFindCustomer,
  onOpenAdd,
  onOpenLocation,
  onOpenNetwork,
  onOpenScan,
}) => {
  return (
    <>
      <Card>
        <h3>Добавить сотрудника</h3>
        <p>
          Добавьте сотрудника, чтобы настроить выдачу карт, начисление баллов и работу по сменам.
        </p>
        <ScannerIcon>
          <IconWithTooltip>
            <PlusCircle size={18} />
            <Tooltip>Создайте нового сотрудника</Tooltip>
          </IconWithTooltip>
        </ScannerIcon>
        <CustomMainButton onClick={onOpenAdd}>Добавить сотрудника</CustomMainButton>
      </Card>

      <Card>
        <h3>Добавить точку продаж</h3>
        <p>Создавайте торговые точки, привязывайте сотрудников и настраивайте акции.</p>
        <ScannerIcon>
          <IconWithTooltip>
            <PlusCircle size={18} />
            <Tooltip>Создайте новую точку продаж</Tooltip>
          </IconWithTooltip>
        </ScannerIcon>
        <CustomMainButton onClick={onOpenLocation}>Добавить точку</CustomMainButton>
      </Card>

      <Card>
        <h3>Добавить сеть</h3>
        <p>Объедините несколько точек в одну сеть для общего учёта клиентов.</p>
        <ScannerIcon>
          <IconWithTooltip>
            <PlusCircle size={18} />
            <Tooltip>Создайте новую сеть</Tooltip>
          </IconWithTooltip>
        </ScannerIcon>
        <CustomMainButton onClick={onOpenNetwork}>Создать сеть</CustomMainButton>
      </Card>

      <Card>
        <h3>Поиск по карте</h3>
        <p>Введите номер карты лояльности клиента, чтобы перейти к его профилю.</p>
        <ScannerIcon>
          <IconWithTooltip>
            <Search size={18} />
            <Tooltip>
              {' '}
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

      <Card>
        <h3>Сканер QR-кодов</h3>
        <p>Сканируйте карты лояльности клиентов прямо в браузере — быстро и удобно.</p>
        <ScannerIcon>
          <IconWithTooltip>
            <Camera size={18} />
            <Tooltip> Откройте встроенный сканер и считывайте QR/штрих-коды</Tooltip>
          </IconWithTooltip>
        </ScannerIcon>
        <CustomMainButton onClick={onOpenScan}>Открыть</CustomMainButton>
      </Card>
    </>
  );
};

export default CardsBlock;
