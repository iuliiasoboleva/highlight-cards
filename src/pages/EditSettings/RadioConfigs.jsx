import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomCheckbox from '../../customs/CustomCheckbox';
import CustomInput from '../../customs/CustomInput';
import CustomSelect from '../../customs/CustomSelect';
import CustomTooltip from '../../customs/CustomTooltip';
import { formatDateToDDMMYYYY } from '../../helpers/date';
import { pluralize } from '../../helpers/pluralize';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import BarcodeRadio from './BarcodeRadio';
import {
  DurationRow,
  Equal,
  SpendingLabel,
  SpendingRow,
  StampSectionLabel,
  VisitConfig,
  VisitLabel,
} from './styles';

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

  const MIN_YEAR = 2025;
  const MAX_YEAR = 2120;
  const todayLocalISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const minAbsoluteISO = '2025-01-01';
  const minDateISO = todayLocalISO < minAbsoluteISO ? minAbsoluteISO : todayLocalISO;

  const normalizeISODate = (value) => {
    if (!value) return '';
    let year;
    let month;
    let day;
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts.length !== 3) return value;
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } else if (value.includes('-')) {
      const parts = value.split('-');
      if (parts.length !== 3) return value;
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      } else {
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
      }
    } else {
      return value;
    }
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return value;
    let y = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
    let m = Math.max(1, Math.min(12, month));
    const daysInMonth = new Date(y, m, 0).getDate();
    let d = Math.max(1, Math.min(daysInMonth, day));
    return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const configs = [];

  const isSubscription = cardStatus === 'subscription';
  configs.push({
    options: [
      { value: 'cardUnlimit', label: 'Неограниченный' },
      { value: 'cardFixed', label: 'Фиксированный срок' },
      { value: 'cardFixedLater', label: 'Фиксированный срок после регистрации карты' },
    ],
    selected: settings.cardLimit,
    onChange: (value) => updateSettingsField('cardLimit', value),
    title: isSubscription ? 'Срок действия абонемента' : 'Срок действия карты',
    name: 'card-limit',
    tooltip: isSubscription ? 'Выберите срок действия абонемента' : 'Выберите срок действия карты',
    additionalContentByValue: {
      cardFixed: (
        <>
          <StampSectionLabel>
            <BarcodeRadioTitle>Срок</BarcodeRadioTitle>
            <CustomTooltip
              id="card-duration-help"
              html
              content={
                isSubscription
                  ? 'Условия срока действия абонемента'
                  : 'Условия срока действия карты'
              }
            />
          </StampSectionLabel>
          <CustomInput
            type="date"
            value={settings.cardFixedDate || ''}
            min={minDateISO}
            max="2120-12-31"
            data-settings-key="cardFixedDate"
            onChange={(e) => {
              const raw = e.target.value;
              updateSettingsField('cardFixedDate', raw);
            }}
            onBlur={(e) => {
              let iso = normalizeISODate(e.target.value);
              if (iso && iso < minDateISO) iso = minDateISO;
              updateSettingsField('cardFixedDate', iso);
              const formattedExpiration = iso ? formatDateToDDMMYYYY(iso) : '';
              dispatch(
                updateCurrentCardField({ path: 'expirationDate', value: formattedExpiration }),
              );
            }}
          />
        </>
      ),
      cardFixedLater: (
        <>
          <StampSectionLabel>
            <BarcodeRadioTitle>Срок</BarcodeRadioTitle>
            <CustomTooltip
              id="card-duration-later-help"
              html
              content={
                isSubscription
                  ? 'Условия срока действия абонемента с момента выпуска'
                  : 'Условия срока действия карты с момента выпуска'
              }
            />
          </StampSectionLabel>
          <DurationRow>
            <CustomSelect
              value={settings.cardDuration?.value || 1}
              onChange={(value) =>
                updateSettingsField('cardDuration', {
                  ...settings.cardDuration,
                  value: parseInt(value, 10),
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
          </DurationRow>
        </>
      ),
    },
  });

  if (isSubscription) {
    configs.push({
      options: [
        { value: 'withVisits', label: 'Ограниченное количество визитов' },
        { value: 'unlimited', label: 'Неограниченное количество визитов' },
      ],
      selected: settings.subscriptionVisitPolicy || 'withVisits',
      onChange: (value) => updateSettingsField('subscriptionVisitPolicy', value),
      title: 'Правила посещений абонемента',
      name: 'subscription-visit-policy',
      tooltip: 'Выберите, ограничивать ли число визитов за выбранный срок абонемента',
      additionalContentByValue: {
        withVisits: (
          <>
            <StampSectionLabel>
              <BarcodeRadioTitle>Количество визитов за срок</BarcodeRadioTitle>
              <CustomTooltip
                id="subscription-visits-help"
                html
                content="Укажите, сколько визитов разрешено в рамках выбранного срока"
              />
            </StampSectionLabel>
            <CustomInput
              type="number"
              min="1"
              value={settings.subscriptionVisitsCount ?? ''}
              onChange={(e) =>
                updateSettingsField(
                  'subscriptionVisitsCount',
                  Math.max(1, parseInt(e.target.value || '0', 10) || 1),
                )
              }
              placeholder="Например: 8"
            />
          </>
        ),
        // для unlimited — ничего не показываем
      },
    });
  }

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
          <SpendingRow>
            <SpendingLabel>
              <span>₽</span>
              <CustomInput
                type="number"
                min="1"
                value={settings.spendingAmount || ''}
                onChange={(e) =>
                  updateSettingsField('spendingAmount', parseInt(e.target.value, 10) || 0)
                }
              />
            </SpendingLabel>
            <Equal>=</Equal>
            <SpendingLabel>
              <CustomInput
                type="number"
                min="1"
                value={settings.spendingStamps || ''}
                onChange={(e) =>
                  updateSettingsField('spendingStamps', parseInt(e.target.value, 10) || 0)
                }
              />
              <span>штампов</span>
            </SpendingLabel>
          </SpendingRow>
        ),
        visit: (
          <VisitConfig>
            <VisitLabel>
              <CustomInput type="number" min="1" value={1} disabled />
              <span className="visit-text">визит =</span>
              <CustomInput
                type="number"
                min="1"
                value={settings.visitStamps || ''}
                onChange={(e) =>
                  updateSettingsField('visitStamps', parseInt(e.target.value, 10) || 0)
                }
              />
              <span className="visit-text">штампов</span>
            </VisitLabel>
            <CustomCheckbox
              checked={settings.limitVisitPerDay || false}
              onChange={(e) => updateSettingsField('limitVisitPerDay', e.target.checked)}
              label="Ограничить до 1 посещения в день"
            />
          </VisitConfig>
        ),
      },
    });
  }

  if (['stamp'].includes(cardStatus)) {
    configs.push({
      options: [
        { value: 'stampUnlimit', label: 'Неограниченный' },
        { value: 'stampFixedLater', label: 'Фиксированный срок после получения штампов' },
      ],
      selected: settings.stampLimit,
      onChange: (value) => updateSettingsField('stampLimit', value),
      title: 'Срок жизни штампа',
      name: 'stamp-limit',
      tooltip:
        'Сделайте штамп ограниченным по времени — например, один раз в месяц, чтобы мотивировать регулярные визиты',
      additionalContentByValue: {
        stampFixedLater: (
          <>
            <StampSectionLabel>
              <BarcodeRadioTitle>Срок</BarcodeRadioTitle>
              <CustomTooltip
                id="stamp-duration-help"
                html
                content="Условия срока действия штампа"
              />
            </StampSectionLabel>
            <DurationRow>
              <CustomSelect
                value={settings.stampDuration?.value || 1}
                onChange={(value) =>
                  updateSettingsField('stampDuration', {
                    ...settings.stampDuration,
                    value: parseInt(value, 10),
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
            </DurationRow>
          </>
        ),
      },
    });
  }

  if (['cashback', 'certificate'].includes(cardStatus)) {
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
            <StampSectionLabel>
              <BarcodeRadioTitle>Срок</BarcodeRadioTitle>
              <CustomTooltip id="duration-help" html content="Условия срока действия балла" />
            </StampSectionLabel>
            <DurationRow>
              <CustomSelect
                value={settings.pointsDuration?.value || 1}
                onChange={(value) =>
                  updateSettingsField('pointsDuration', {
                    ...settings.pointsDuration,
                    value: parseInt(value, 10),
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
            </DurationRow>
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
