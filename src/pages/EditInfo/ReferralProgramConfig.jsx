import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelpCircle } from 'lucide-react';

import { updateCurrentCardField } from '../../store/cardsSlice';
import BarcodeRadio from '../EditSettings/BarcodeRadio';

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
      additionalContentByValue={{
        true: (
          <>
            <div>
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
              />
            </div>
            <hr />
            <div className="barcode-radio-additional">
              <div className="design-stamp-controls">
                <label className="stamp-section-label">
                  <h3 className="barcode-radio-title">
                    Количество штампов для реферера
                    <HelpCircle size={16} style={{ marginLeft: 6 }} />
                  </h3>
                  <p className="labeled-textarea-subtitle">
                    Выберите, сколько штампов начислить тому, кто пригласил.
                  </p>
                </label>
                <div className="stamp-quantity-grid">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      className={`stamp-quantity-button ${
                        num <= infoFields.referrerStampsQuantity ? 'active' : ''
                      }`}
                      onClick={() => updateInfoField('referrerStampsQuantity', num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="design-stamp-controls">
                <label className="stamp-section-label">
                  <h3 className="barcode-radio-title">
                    Количество штампов для реферала
                    <HelpCircle size={16} style={{ marginLeft: 6 }} />
                  </h3>
                  <p className="labeled-textarea-subtitle">
                    Выберите, сколько штампов начислить тому, кто установил карту.
                  </p>
                </label>
                <div className="stamp-quantity-grid">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      className={`stamp-quantity-button ${
                        num <= infoFields.referralStampsQuantity ? 'active' : ''
                      }`}
                      onClick={() => updateInfoField('referralStampsQuantity', num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ),
      }}
    />
  );
};

export default ReferralProgramConfig;
