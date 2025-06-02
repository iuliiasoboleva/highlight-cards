import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateCurrentCardField } from '../../store/cardsSlice';
import BarcodeRadio from '../EditSettings/BarcodeRadio';

const ReferralProgramConfig = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.cards.currentCard.settings || {});

  const updateSettingsField = (field, value) => {
    dispatch(updateCurrentCardField({ path: `settings.${field}`, value }));
  };

  const options = [
    { value: true, label: 'Активна' },
    { value: false, label: 'Неактивна' },
  ];

  return (
    <BarcodeRadio
      options={options}
      title="Реферальная программа"
      selected={settings.referralProgramActive}
      onChange={(value) => updateSettingsField('referralProgramActive', value === 'true')}
      name="referral-program"
      additionalContentByValue={{
        true: (
          <div className="referral-extra-fields">
            <h4>Производить начисления в момент</h4>
            <BarcodeRadio
              options={[
                { value: 'visit', label: 'Первого визита / использования карты рефералом' },
                { value: 'issue', label: 'Выдачи карты рефералу' },
              ]}
              selected={settings.referralMoment}
              onChange={(value) => updateSettingsField('referralMoment', value)}
              name="referral-moment"
            />

            <label>
              Количество баллов для реферера
              <input
                type="number"
                min="0"
                value={settings.referrerPoints || ''}
                onChange={(e) =>
                  updateSettingsField('referrerPoints', parseInt(e.target.value) || 0)
                }
                className="push-input"
              />
            </label>

            <label>
              Количество баллов для реферала
              <input
                type="number"
                min="0"
                value={settings.referralPoints || ''}
                onChange={(e) =>
                  updateSettingsField('referralPoints', parseInt(e.target.value) || 0)
                }
                className="push-input"
              />
            </label>
          </div>
        ),
      }}
    />
  );
};

export default ReferralProgramConfig;
