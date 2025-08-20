import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomInput from '../../customs/CustomInput';
import CustomTextArea from '../../customs/CustomTextarea';
import ToggleSwitch from '../../customs/CustomToggleSwitch';
import CustomTooltip from '../../customs/CustomTooltip';
import { updateCurrentCardField } from '../../store/cardsSlice';
import { BarcodeRadioTitle } from '../EditDesign/styles';
import {
  AddBtn,
  PolicyHeader,
  PolicySection,
  PolicyTextareaWrapper,
  RequiredAsterisk,
  Spacer,
  StampSectionLabel,
} from './styles';

const plural = (n, forms) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
};

const humanDuration = (value, unit) => {
  if (!value || !unit) return null;
  const forms =
    unit === 'days'
      ? ['день', 'дня', 'дней']
      : unit === 'months'
        ? ['месяц', 'месяца', 'месяцев']
        : ['год', 'года', 'лет'];
  return `${value} ${plural(value, forms)}`;
};

const numberList = (items) => items.map((t, i) => `${i + 1}. ${t}`).join('\n');

const PolicyFields = ({ policyEnabled, fullPolicyText, linkToFullTerms }) => {
  const dispatch = useDispatch();

  const status = useSelector((s) => s.cards.currentCard.status);
  const settings = useSelector((s) => s.cards.currentCard.settings || {});
  const design = useSelector((s) => s.cards.currentCard.design || {});
  const maxRedeemPercent = useSelector((s) => s.cards.currentCard.maxRedeemPercent);

  const visitsCount =
    typeof design?.stampsQuantity === 'number' && design.stampsQuantity > 0
      ? design.stampsQuantity
      : null;

  const cashbackLife =
    typeof settings?.cashbackLifetimeDays === 'number' && settings.cashbackLifetimeDays > 0
      ? `${settings.cashbackLifetimeDays} ${plural(settings.cashbackLifetimeDays, [
          'день',
          'дня',
          'дней',
        ])}`
      : 'бессрочно';

  const subDuration =
    settings?.cardDuration?.value && settings?.cardDuration?.unit
      ? humanDuration(settings.cardDuration.value, settings.cardDuration.unit)
      : null;

  const certDuration =
    settings?.pointsDuration?.value && settings?.pointsDuration?.unit
      ? humanDuration(settings.pointsDuration.value, settings.pointsDuration.unit)
      : null;

  const defaultText = useMemo(() => {
    switch (status) {
      case 'cashback': {
        const redeem =
          typeof maxRedeemPercent === 'number'
            ? `в пределах, указанных в правилах (до ${maxRedeemPercent}%).`
            : 'в пределах, указанных в правилах.';
        return numberList([
          'За каждую покупку вы получаете бонусы — процент от суммы чека возвращается на карту.',
          `Накопленные бонусы можно использовать при оплате — ${redeem}`,
          `Срок действия бонусов — ${cashbackLife}, если не указано иное.`,
          'Бонусы не обмениваются на наличные, не возвращаются и не подлежат замене.',
          'Кешбэк-карта именная — передача другим лицам не допускается.',
        ]);
      }
      case 'subscription': {
        const line1 = visitsCount
          ? `Абонемент даёт вам доступ к ${visitsCount} ${plural(visitsCount, [
              'визиту',
              'визитам',
              'визитам',
            ])} или услугам в рамках выбранного пакета.`
          : 'Абонемент даёт вам доступ к визитам или услугам в рамках выбранного пакета.';
        const line3 =
          subDuration != null
            ? `Срок действия абонемента — ${subDuration} с момента активации.`
            : 'Срок действия абонемента — например, 30/60/90 дней с момента активации.';
        return numberList([
          line1,
          'Каждый визит списывается автоматически при использовании услуги.',
          line3,
          'Неиспользованные визиты не переносятся и не компенсируются.',
          'Абонемент не подлежит возврату, передаче другим лицам или объединению с другими картами.',
        ]);
      }
      case 'discount':
        return numberList([
          'С этой картой вы получаете постоянную скидку при каждой покупке — согласно условиям программы.',
          'Скидка применяется к товарам/услугам, участвующим в акции.',
          'Карта действует бессрочно (если не указано иное) и может быть отключена при нарушении условий.',
          'Скидка не суммируется с другими акциями и спецпредложениями.',
          'Карта является персональной и не может быть передана другому человеку.',
        ]);
      case 'certificate': {
        const life =
          certDuration != null
            ? `${certDuration} с даты покупки`
            : 'например, 6 месяцев с даты покупки';
        return numberList([
          'Подарочный сертификат можно использовать для оплаты товаров и услуг на сумму, указанную на карте.',
          'При частичном использовании остаток сохраняется до окончания срока действия.',
          `Срок действия сертификата — ${life}.`,
          'Сертификат не подлежит возврату или обмену на наличные.',
          'Не может быть объединён с другими сертификатами и передан третьим лицам.',
        ]);
      }
      default:
        return numberList([
          'Условия использования карты определяются правилами программы лояльности.',
          'Карта является персональной, передача третьим лицам не допускается.',
          'Организатор имеет право изменять условия программы, уведомляя клиентов доступными способами.',
        ]);
    }
  }, [status, visitsCount, subDuration, cashbackLife, certDuration, maxRedeemPercent]);

  useEffect(() => {
    if (!policyEnabled) return;
    const isEmpty = !fullPolicyText || String(fullPolicyText).trim() === '';
    if (isEmpty) {
      dispatch(updateCurrentCardField({ path: 'infoFields.fullPolicyText', value: defaultText }));
    }
  }, [policyEnabled, defaultText, fullPolicyText, dispatch]);

  const handleToggle = () => {
    dispatch(
      updateCurrentCardField({
        path: 'infoFields.policyEnabled',
        value: !policyEnabled,
      }),
    );
  };

  const handlePolicyChange = useCallback(
    (e) => {
      dispatch(
        updateCurrentCardField({
          path: 'infoFields.fullPolicyText',
          value: e.target.value,
        }),
      );
    },
    [dispatch],
  );

  const applyDefaultNow = () => {
    dispatch(updateCurrentCardField({ path: 'infoFields.fullPolicyText', value: defaultText }));
  };

  return (
    <>
      <PolicySection data-info-key="policyEnabled">
        <PolicyHeader>
          <BarcodeRadioTitle>Условия использования</BarcodeRadioTitle>
          <CustomTooltip
            id="condition-help"
            html
            content="Укажите текст условий использования карты"
          />
          <div style={{ marginLeft: 'auto' }}>
            <ToggleSwitch checked={policyEnabled} onChange={handleToggle} />
          </div>
        </PolicyHeader>

        <PolicyTextareaWrapper>
          <CustomTextArea
            className="policy-textarea"
            value={fullPolicyText || ''}
            onChange={handlePolicyChange}
            disabled={!policyEnabled}
            data-info-key="fullPolicyText"
          />
          <RequiredAsterisk>*</RequiredAsterisk>
        </PolicyTextareaWrapper>
      </PolicySection>
      <AddBtn type="button" onClick={applyDefaultNow}>
        Вставить текст по умолчанию
      </AddBtn>
      <Spacer />

      <StampSectionLabel>
        <BarcodeRadioTitle>Ссылка на полные условия (необязательно)</BarcodeRadioTitle>
        <CustomTooltip
          id="condition-full-help"
          html
          content="Ссылка на полный текст условий использования карты"
        />
      </StampSectionLabel>
      <CustomInput
        type="text"
        value={linkToFullTerms || ''}
        onChange={(e) =>
          dispatch(
            updateCurrentCardField({
              path: 'infoFields.linkToFullTerms',
              value: e.target.value,
            }),
          )
        }
        placeholder="Введите URL ссылки на условия использования сервиса на вашем сайте"
        disabled={!policyEnabled}
        data-info-key="linkToFullTerms"
      />
    </>
  );
};

export default PolicyFields;
