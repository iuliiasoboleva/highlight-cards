import React, { useState } from 'react';
import styled from 'styled-components';

import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomModal from '../../customs/CustomModal';
import { CheckboxRow, Links } from './styles';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TariffInfo = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const TariffHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const TariffTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const TariffDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 14px;
`;

const TariffDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #64748b;
  font-size: 14px;
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
  white-space: nowrap;
`;

const TotalRow = styled(DetailRow)`
  background: transparent;
  border-bottom: 1px solid #e2e8f0;
`;

const TotalLabel = styled(DetailLabel)`
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
`;

const TotalValue = styled(DetailValue)`
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
`;

const BenefitRow = styled.div`
  background: #ecfdf5;
  border-radius: 12px;
  margin: 16px -24px 0 -24px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% + 48px);
  position: relative;
  z-index: 1;
`;

const BenefitLabel = styled.div`
  color: #065f46;
  font-size: 14px;
  font-weight: 600;
`;

const BenefitValue = styled(DetailValue)`
  color: #065f46;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

const PromoRow = styled(DetailRow)`
  background: #ecfdf5;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  border-bottom: none;

  ${DetailLabel} {
    color: #065f46;
  }

  ${DetailValue} {
    color: #065f46;
  }
`;

const AgreementModal = ({
  open,
  onClose,
  onConfirm,
  plan,
  points,
  months,
  total,
  originalTotal,
  discount,
  promoCode,
  monthlyPrice
}) => {
  const [agreed, setAgreed] = useState(false);

  // Рассчитываем выгоду при покупке на год
  const isYear = months === 12;
  const monthlyPriceWithoutDiscount = plan?.key === 'network'
    ? plan?.monthly * Math.max(points, 3)
    : plan?.key === 'business'
      ? plan?.monthly * points
      : plan?.monthly;

  const yearlyTotalWithoutDiscount = monthlyPriceWithoutDiscount * 12;
  const yearlyTotalWithDiscount = plan?.key === 'network'
    ? (plan?.yearlyMonthly * Math.max(points, 3)) * 12
    : plan?.key === 'business'
      ? (plan?.yearlyMonthly * points) * 12
      : plan?.yearlyMonthly * 12;

  const savings = yearlyTotalWithoutDiscount - yearlyTotalWithDiscount;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Оплата тарифа"
      maxWidth={500}
      actions={
        <>
          <CustomModal.SecondaryButton onClick={onClose}>Отмена</CustomModal.SecondaryButton>
          <CustomModal.PrimaryButton onClick={onConfirm} disabled={!agreed}>
            Перейти к оплате
          </CustomModal.PrimaryButton>
        </>
      }
    >
      <ModalContent>
        <TariffInfo>
          <TariffHeader>
            <TariffTitle>{plan?.name}</TariffTitle>
            <TariffDescription>{plan?.description}</TariffDescription>
          </TariffHeader>

          <TariffDetails>
            <DetailRow>
              <DetailLabel>Количество точек:</DetailLabel>
              <DetailValue>{points}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Количество месяцев:</DetailLabel>
              <DetailValue>{months}</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Стоимость за месяц:</DetailLabel>
              <DetailValue>{monthlyPrice?.toLocaleString('ru-RU')} ₽</DetailValue>
            </DetailRow>

            {promoCode && discount > 0 && (
              <>
                <DetailRow>
                  <DetailLabel>Сумма до скидки:</DetailLabel>
                  <DetailValue>{originalTotal?.toLocaleString('ru-RU')} ₽</DetailValue>
                </DetailRow>
                <PromoRow>
                  <DetailLabel>🎉 Промокод {promoCode}:</DetailLabel>
                  <DetailValue>-{discount?.toLocaleString('ru-RU')} ₽</DetailValue>
                </PromoRow>
              </>
            )}

            <TotalRow>
              <TotalLabel>К оплате:</TotalLabel>
              <TotalValue>{total?.toLocaleString('ru-RU')} ₽</TotalValue>
            </TotalRow>
          </TariffDetails>

          <BenefitRow>
            <div>
              <BenefitLabel>
                {!isYear ? 'При покупке на год выгода 20%:' : 'Отличный выбор! Ваша выгода:'}
              </BenefitLabel>
              <div style={{ fontSize: '12px', color: '#065f46', marginTop: '4px' }}>
                Стоимость на год: {yearlyTotalWithDiscount.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <BenefitValue>
              {savings.toLocaleString('ru-RU')} ₽
            </BenefitValue>
          </BenefitRow>
        </TariffInfo>

        <CheckboxRow>
          <CustomCheckbox
            checked={agreed}
            onChange={() => setAgreed((v) => !v)}
            label={
              <Links>
                Я принимаю{' '}
                <a href="https://loyalclub.ru/oferta" target="_blank" rel="noopener noreferrer">
                  условия соглашения
                </a>{' '}
                и{' '}
                <a href="https://loyalclub.ru/policy" target="_blank" rel="noopener noreferrer">
                  политику обработки персональных данных
                </a>
              </Links>
            }
          />
        </CheckboxRow>
      </ModalContent>
    </CustomModal>
  );
};

export default AgreementModal;
