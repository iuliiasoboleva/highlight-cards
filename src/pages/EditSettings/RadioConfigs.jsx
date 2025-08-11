import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import CustomTooltip from '../../customs/CustomTooltip';
import { formatDateToDDMMYYYY, getMinDate } from '../../helpers/date';
import { pluralize } from '../../helpers/pluralize';
import { updateCurrentCardField } from '../../store/cardsSlice';
import BarcodeRadio from './BarcodeRadio';

const RadioConfigs = ({ cardStatus }) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.cards.currentCard.settings || {});

  const updateSettingsField = (field, value) => {
    dispatch(updateCurrentCardField({ path: `settings.${field}`, value }));
  };

  const numberOptions = Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  const getDurationOptions = (count) => [
    { value: 'days', label: pluralize(count, ['день', 'дня', 'дней']) },
    { value: 'months', label: pluralize(count, ['месяц', 'месяца', 'месяцев']) },
    { value: 'years', label: pluralize(count, ['год', 'года', 'лет']) },
  ];

  const configs = [];

  configs.push({
    options: [
      { value: 'cardUnlimit', label: 'Неограниченный' },
      { value: 'cardFixed', label: 'Фиксированный срок' },
      { value: 'cardFixedLater', label: 'Фиксированный срок после регистрации карты' },
    ],
    selected: settings.cardLimit,
    onChange: (value) => updateSettingsField('cardLimit', value),
    title: 'Срок действия карты',
    name: 'card-limit',
    tooltip: `Выберите срок действия карты`,
    additionalContentByValue: {
      cardFixed: (
        <>
          <h3 className="barcode-radio-subtitle">Срок</h3>
          <CustomTooltip id="card-duration-help" html content={`Условия срока действия карты`} />
          <input
            className="push-date"
            type="date"
            value={settings.cardFixedDate || ''}
            min={getMinDate()}
            data-settings-key="cardFixedDate"
            onChange={(e) => {
              const newDate = e.target.value;
              const formattedExpiration = formatDateToDDMMYYYY(newDate);
              updateSettingsField('cardFixedDate', newDate);
              dispatch(
                updateCurrentCardField({ path: 'expirationDate', value: formattedExpiration }),
              );
            }}
          />
        </>
      ),
      cardFixedLater: (
        <>
          <h3 className="barcode-radio-subtitle">Срок</h3>
          <CustomTooltip id="stamp-duration-help" html content={`Условия срока действия штампа`} />
          <div className="stamp-duration-selector">
            <CustomSelect
              value={settings.cardDuration?.value || 1}
              onChange={(value) =>
                updateSettingsField('cardDuration', {
                  ...settings.cardDuration,
                  value: parseInt(value),
                })
              }
              options={numberOptions}
              className="duration-number-select"
            />
            <CustomSelect
              value={settings.cardDuration?.unit || 'days'}
              onChange={(unit) =>
                updateSettingsField('cardDuration', { ...settings.cardDuration, unit })
              }
              options={getDurationOptions(settings.cardDuration?.value || 1)}
              className="duration-unit-select"
            />
          </div>
        </>
      ),
    },
  });

  if (cardStatus === 'stamp') {
    configs.push({
      options: [
        {
          value: 'spending',
          label: 'Расход',
          labelSub: '(Начисление штампов в зависимости от расходов клиента)',
        },
        {
          value: 'visit',
          label: 'Визит',
          labelSub: '(Начисление штампов в зависимости от количества посещений клиента)',
        },
        {
          value: 'stamps',
          label: 'Штампы',
          labelSub: '(Начисление штампов в соответствии с вашими правилами)',
        },
      ],
      selected: settings.rewardProgram,
      onChange: (value) => updateSettingsField('rewardProgram', value),
      title: 'Программа вознаграждения',
      name: 'reward-program',
      additionalContentByValue: {
        spending: (
          <div className="spending-config">
            <label className="spending-label">
              <span>₽</span>
              <CustomInput
                type="number"
                min="1"
                value={settings.spendingAmount || ''}
                onChange={(e) =>
                  updateSettingsField('spendingAmount', parseInt(e.target.value) || 0)
                }
              />
            </label>
            <span className="spending-equal">=</span>
            <label className="spending-label">
              <CustomInput
                type="number"
                min="1"
                value={settings.spendingStamps || ''}
                onChange={(e) =>
                  updateSettingsField('spendingStamps', parseInt(e.target.value) || 0)
                }
              />
              <span>штампов</span>
            </label>
          </div>
        ),
        visit: (
          <div className="visit-config">
            <label className="visit-label">
              <CustomInput type="number" min="1" value={1} disabled />
              <span className="visit-text">визит =</span>
              <CustomInput
                type="number"
                min="1"
                value={settings.visitStamps || ''}
                onChange={(e) => updateSettingsField('visitStamps', parseInt(e.target.value) || 0)}
              />
              <span className="visit-text">штампов</span>
            </label>
            <CustomCheckbox
              checked={settings.limitVisitPerDay || false}
              onChange={(e) => updateSettingsField('limitVisitPerDay', e.target.checked)}
              label="Ограничить до 1 посещения в день"
            />
          </div>
        ),
      },
    });
  }

  if (['stamp', 'subscription'].includes(cardStatus)) {
    configs.push({
      options: [
        { value: 'stampUnlimit', label: 'Неограниченный' },
        { value: 'stampFixedLater', label: 'Фиксированный срок после получения штампов' },
      ],
      selected: settings.stampLimit,
      onChange: (value) => updateSettingsField('stampLimit', value),
      title: 'Срок жизни штампа',
      name: 'stamp-limit',
      tooltip: `Срок действия штампа`,
      additionalContentByValue: {
        stampFixedLater: (
          <>
            <h3 className="barcode-radio-subtitle">Срок</h3>
            <CustomTooltip
              id="stamp-duration-help"
              html
              content={`Условия срока действия штампа`}
            />
            <div className="stamp-duration-selector">
              <CustomSelect
                value={settings.stampDuration?.value || 1}
                onChange={(value) =>
                  updateSettingsField('stampDuration', {
                    ...settings.stampDuration,
                    value: parseInt(value),
                  })
                }
                options={numberOptions}
                className="duration-number-select"
              />
              <CustomSelect
                value={settings.stampDuration?.unit || 'days'}
                onChange={(unit) =>
                  updateSettingsField('stampDuration', { ...settings.stampDuration, unit })
                }
                options={getDurationOptions(settings.stampDuration?.value || 1)}
                className="duration-unit-select"
              />
            </div>
          </>
        ),
      },
    });
  }

  if (['cashback', 'subscription', 'certificate'].includes(cardStatus)) {
    configs.push({
      options: [
        { value: 'pointsUnlimit', label: 'Неограниченный' },
        { value: 'pointsFixedLater', label: 'Фиксированный срок после получения бонусов' },
      ],
      selected: settings.pointsLimit,
      onChange: (value) => updateSettingsField('pointsLimit', value),
      title: 'Срок жизни баллов',
      name: 'points-limit',
      additionalContentByValue: {
        pointsFixedLater: (
          <>
            <h3 className="barcode-radio-subtitle">Срок</h3>
            <CustomTooltip id="duration-help" html content={`Условия срока действия балла`} />
            <div className="stamp-duration-selector">
              <CustomSelect
                value={settings.pointsDuration?.value || 1}
                onChange={(value) =>
                  updateSettingsField('pointsDuration', {
                    ...settings.pointsDuration,
                    value: parseInt(value),
                  })
                }
                options={numberOptions}
                className="duration-number-select"
              />
              <CustomSelect
                value={settings.pointsDuration?.unit || 'days'}
                onChange={(unit) =>
                  updateSettingsField('pointsDuration', { ...settings.pointsDuration, unit })
                }
                options={getDurationOptions(settings.pointsDuration?.value || 1)}
                className="duration-unit-select"
              />
            </div>
          </>
        ),
      },
    });
  }

  if (cardStatus === 'certificate') {
    configs.push({
      options: [
        {
          value: 'multiple',
          label: 'Множественное использование',
          labelSub: '(Клиент может использовать подарочный баланс в нескольких транзакциях)',
        },
        {
          value: 'single',
          label: 'Разовое использование',
          labelSub: '(Клиент может использовать подарочный баланс только в одной транзакции)',
        },
      ],
      selected: settings.redemptionRule,
      onChange: (value) => updateSettingsField('redemptionRule', value),
      title: 'Правила погашения',
      name: 'redemption-rule',
    });
  }

  return (
    <>
      {configs?.map((config, index) => (
        <React.Fragment key={config.name || index}>
          <BarcodeRadio {...config} />
          {index < configs?.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </>
  );
};

export default RadioConfigs;
