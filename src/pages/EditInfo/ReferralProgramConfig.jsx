import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateCurrentCardField } from '../../store/cardsSlice';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import BarcodeRadio from '../EditSettings/BarcodeRadio';
import {
  AdditionalWrapper,
  ControlsBlock,
  Hr,
  QuantityButton,
  QuantityGrid,
  QuantityHeader,
  StampSectionLabel,
  Subnote,
  Subtitle,
} from './styles';

const ReferralProgramConfig = () => {
  const dispatch = useDispatch();
  const infoFields = useSelector((state) => state.cards.currentCard.infoFields || {});

  const updateInfoField = (field, value) => {
    dispatch(updateCurrentCardField({ path: `infoFields.${field}`, value }));
  };

  const referralOptions = [
    { value: 'true', label: 'Активна' },
    { value: 'false', label: 'Неактивна' },
  ];

  return (
    <BarcodeRadio
      options={referralOptions}
      title="Реферальная программа"
      selected={String(infoFields.referralProgramActive)}
      onChange={(value) => updateInfoField('referralProgramActive', value === 'true')}
      name="referral-program"
      dataKey="referralProgramActive"
      additionalContentByValue={{
        true: (
          <>
            <div style={{ marginTop: '8px' }}>
              <BarcodeRadio
                title="Производить начисления в момент"
                options={[
                  {
                    value: 'visit',
                    label: 'Первого визита / использования карты рефералом',
                  },
                  { value: 'issue', label: 'Выдачи карты рефералу' },
                ]}
                selected={infoFields.referralMoment}
                onChange={(value) => updateInfoField('referralMoment', value)}
                name="referral-moment"
                dataKey="referralMoment"
              />
            </div>

            <Hr />

            <AdditionalWrapper>
              <ControlsBlock data-info-key="referrerStampsQuantity">
                <QuantityHeader>
                  <BarcodeRadioTitle>Количество штампов для реферера</BarcodeRadioTitle>
                  <Subnote>Выберите, сколько штампов начислить тому, кто пригласил.</Subnote>
                </QuantityHeader>

                <QuantityGrid className="stamp-quantity-grid">
                  {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                    <QuantityButton
                      key={num}
                      type="button"
                      $active={num <= (infoFields.referrerStampsQuantity ?? 0)}
                      onClick={() => updateInfoField('referrerStampsQuantity', num)}
                      aria-pressed={num <= (infoFields.referrerStampsQuantity ?? 0)}
                      aria-label={`Начислить ${num} штампов рефереру`}
                      className={`stamp-quantity-button${
                        num <= (infoFields.referrerStampsQuantity ?? 0) ? ' active' : ''
                      }`}
                    >
                      {num}
                    </QuantityButton>
                  ))}
                </QuantityGrid>
              </ControlsBlock>

              <ControlsBlock data-info-key="referralStampsQuantity">
                <QuantityHeader>
                  <BarcodeRadioTitle>Количество штампов для реферала</BarcodeRadioTitle>
                  <Subnote>Выберите, сколько штампов начислить тому, кто установил карту.</Subnote>
                </QuantityHeader>

                <QuantityGrid>
                  {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                    <QuantityButton
                      key={num}
                      type="button"
                      $active={num <= (infoFields.referralStampsQuantity ?? 0)}
                      onClick={() => updateInfoField('referralStampsQuantity', num)}
                      aria-pressed={num <= (infoFields.referralStampsQuantity ?? 0)}
                      aria-label={`Начислить ${num} штампов рефералу`}
                      className={`stamp-quantity-button${
                        num <= (infoFields.referralStampsQuantity ?? 0) ? ' active' : ''
                      }`}
                    >
                      {num}
                    </QuantityButton>
                  ))}
                </QuantityGrid>
              </ControlsBlock>
            </AdditionalWrapper>
          </>
        ),
      }}
    />
  );
};

export default ReferralProgramConfig;
