import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axiosInstance from '../../axiosInstance';
import AgreementModal from '../../components/AgreementModal';
import GeoBadge from '../../components/GeoBadge';
import LoaderCentered from '../../components/LoaderCentered';
import PaymentModal from '../../components/PaymentModal';
import InvoicePayerModal from '../../components/InvoicePayerModal';
import { generateInvoicePdf, buildReceiverDefaults } from '../../utils/pdfInvoice';
import { useToast } from '../../components/Toast';
import TopUpModal from '../../components/TopUpModal';
import CustomMainButton from '../../customs/CustomMainButton';
import { formatDateToDDMMYYYY } from '../../helpers/date';
import { clamp, getPointsBounds } from '../../helpers/getPointsBounds';
import { plural } from '../../helpers/pluralize';
import { fetchBalance, topUpBalance } from '../../store/balanceSlice';
import { fetchPayments } from '../../store/paymentsSlice';
import { fetchSubscription } from '../../store/subscriptionSlice';
import { fetchTariffs } from '../../store/tariffsSlice';
import StaticMeter from './StaticMeter';
import { planFeatures } from './planFeatures';
import {
  AsideCard,
  Benefit,
  BlockTitle,
  CalcLine,
  ConditionsCard,
  CurrentBadge,
  Field,
  FreeSub,
  FreeTitle,
  GhostBtn,
  Grid,
  HeaderCard,
  Label,
  MetaRow,
  MutedNote,
  PlanCard,
  PlanDesc,
  PlanName,
  PlanPrice,
  Plans,
  PopularBadge,
  PriceRow,
  PrimaryBtn,
  Radio,
  RangeLabels,
  RangeWrap,
  RightMeta,
  Row,
  SalesBox,
  SalesBtn,
  SettingsContainer,
  SmallList,
  Subtle,
  Title,
  Total,
} from './styles';

const STATIC_LABELS = [
  'Карты лояльности',
  'Сотрудники',
  'Push / SMS-уведомления',
  'Подарочные сертификаты',
];

const Settings = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { plans: tariffPlans, loading } = useSelector((state) => state.tariffs);

  const { organization_id: orgId, id: userId } = useSelector((state) => state.user);
  const { amount: balance = 0, loading: balanceLoading } = useSelector(
    (state) => state.balance || {},
  );
  const { info: subscription, loading: subLoading } = useSelector((state) => state.subscription);

  const [showModal, setShowModal] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState('');
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [planKey, setPlanKey] = useState('business');
  const [points, setPoints] = useState(2);
  const [months, setMonths] = useState(6);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const plan = useMemo(() => planFeatures.find((p) => p.key === planKey), [planKey]);

  const { min: pMin, max: pMax } = getPointsBounds(planKey);

  useEffect(() => {
    setPoints((v) => clamp(v, pMin, pMax));
  }, [planKey]);

  const handleTopUpConfirm = (amount) => {
    setTopUpOpen(false);
    dispatch(topUpBalance({ orgId, amount }));
  };

  useEffect(() => {
    if (!tariffPlans.length) {
      dispatch(fetchTariffs());
    }
  }, [dispatch, tariffPlans.length]);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchSubscription(orgId));
      dispatch(fetchBalance(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    if (subscription?.status === 'trial') {
      setPlanKey('free');
    }
  }, [subscription?.status]);

  const isYear = months === 12;
  const monthlyPrice =
    planKey === 'network'
      ? (isYear ? plan.yearlyMonthly : plan.monthly) * Math.max(points, 3)
      : planKey === 'business'
        ? (isYear ? plan?.yearlyMonthly : plan?.monthly) * points
        : isYear
          ? plan?.yearlyMonthly
          : plan?.monthly;

  const total = monthlyPrice * months;

  const paidUntilRaw =
    subscription?.paid_until ?? subscription?.access_until ?? plan?.paidUntil ?? null;

  const paidUntilStr = paidUntilRaw
    ? formatDateToDDMMYYYY(
        typeof paidUntilRaw === 'number'
          ? String(paidUntilRaw).length === 10
            ? paidUntilRaw * 1000
            : paidUntilRaw
          : paidUntilRaw,
      )
    : '—';

  const autoRenew = Boolean(
    subscription?.auto_renew ??
      subscription?.autorenew ??
      subscription?.is_autorenew_enabled ??
      false,
  );

  if (loading) {
    return <LoaderCentered />;
  }

  if (!tariffPlans.length)
    return (
      <SettingsContainer>
        <p>Тарифы не найдены</p>
      </SettingsContainer>
    );

  return (
    <SettingsContainer>
      <GeoBadge title="Мой тариф" />
      <>
        <HeaderCard>
          <div>
            <Subtle>Ваш тарифный план</Subtle>
            <Title>{plan?.name}</Title>
          </div>
          <RightMeta>
            <MetaRow className="duration">
              <span>Оплачен до:</span>
              <b>{paidUntilStr}</b>
            </MetaRow>
            <MetaRow>
              <span>Автопродление:</span>
              <b className={autoRenew ? 'green' : ''}>{autoRenew ? 'включено' : 'выключено'}</b>
            </MetaRow>
          </RightMeta>
        </HeaderCard>

        <Benefit>🎁 Выгода 20% — при оплате любого тарифа на год.</Benefit>

        <Grid>
          {/* Левая колонка — планы */}
          <div>
            <BlockTitle>Выберите тарифный план</BlockTitle>
            <Plans>
              {planFeatures.map((p) => (
                <PlanCard
                  key={p.key}
                  $active={p.key === planKey}
                  $current={p.key === 'free' && subscription?.status === 'trial'}
                  onClick={() => setPlanKey(p.key)}
                >
                  {p.popular && <PopularBadge>Популярный</PopularBadge>}
                  {p.key === 'free' && subscription?.status === 'trial' && (
                    <CurrentBadge>Текущий</CurrentBadge>
                  )}
                  <Row>
                    <Radio $checked={p.key === planKey} />
                    <PlanName>{p.name}</PlanName>
                  </Row>
                  <PlanDesc>{p.description}</PlanDesc>

                  <PriceRow>
                    {p.monthly === 0 ? (
                      <PlanPrice>0₽ / мес</PlanPrice>
                    ) : p.key === 'network' ? (
                      <PlanPrice>
                        {p.note || `от ${p.monthly.toLocaleString('ru-RU')}₽ / мес / точка`}
                      </PlanPrice>
                    ) : (
                      <PlanPrice>{p.monthly.toLocaleString('ru-RU')}₽ / мес</PlanPrice>
                    )}
                  </PriceRow>
                </PlanCard>
              ))}
            </Plans>
          </div>

          {/* Средняя колонка — условия */}
          <div>
            <BlockTitle>Условия тарифа</BlockTitle>
            <ConditionsCard>
              <Field>
                <Label>
                  <span>Количество точек</span>
                  <strong>{points}</strong>
                </Label>
                <RangeWrap>
                  <input
                    type="range"
                    min={pMin}
                    max={pMax}
                    step={1}
                    value={points}
                    onInput={(e) => setPoints(Number(e.target.value))}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    disabled={pMin === pMax}
                    style={{ '--pct': `${((points - pMin) / (pMax - pMin || 1)) * 100}%` }}
                  />
                  <RangeLabels>
                    <span>{pMin}</span>
                    <span>{pMax}</span>
                  </RangeLabels>
                </RangeWrap>
              </Field>

              <Field>
                <Label>
                  <span>Количество оплачиваемых месяцев</span>
                  <strong>{months} мес.</strong>
                </Label>
                <RangeWrap>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={months}
                    onInput={(e) => setMonths(Number(e.target.value))}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    style={{ '--pct': `${((months - 1) / (12 - 1)) * 100}%` }}
                  />
                  <RangeLabels>
                    <span>1 мес</span>
                    <span>12 мес</span>
                  </RangeLabels>
                </RangeWrap>
              </Field>

              {STATIC_LABELS.map((t) => (
                <StaticMeter key={t} label={t} />
              ))}
            </ConditionsCard>
          </div>
          {/* Правая колонка — расчёт */}
          <AsideCard>
            <BlockTitle>Расчёт стоимости</BlockTitle>

            {planKey === 'free' ? (
              <ConditionsCard>
                <FreeTitle>Бесплатно</FreeTitle>
                <FreeSub>7 дней полного доступа</FreeSub>
                <PrimaryBtn disabled>Доступно только 1 раз</PrimaryBtn>
                <MutedNote>Без привязки карты • Полный функционал</MutedNote>
              </ConditionsCard>
            ) : planKey === 'network' ? (
              <ConditionsCard>
                <SalesBox>
                  <p>
                    У вас сеть от 10 точек
                    <br /> и больше? Мы подготовим для
                    <br /> вас индивидуальные условия.
                  </p>
                  <SalesBtn /* onClick={...} */>Связаться с нами</SalesBtn>
                </SalesBox>
              </ConditionsCard>
            ) : (
              <ConditionsCard>
                <CalcLine>
                  <span>За месяц:</span>
                  <b>{monthlyPrice?.toLocaleString('ru-RU')} ₽</b>
                </CalcLine>
                <CalcLine>
                  <span>
                    За {months} {plural(months, ['месяц', 'месяца', 'месяцев'])}:
                  </span>
                  <b>{total.toLocaleString('ru-RU')} ₽</b>
                </CalcLine>

                <Total>
                  <span>К оплате:</span>
                  <b>{total.toLocaleString('ru-RU')} ₽</b>
                </Total>

                <PrimaryBtn onClick={() => setShowModal(true)}>Оплатить картой</PrimaryBtn>
                <GhostBtn type="button" onClick={() => setInvoiceOpen(true)}>
                  Выставить счёт
                </GhostBtn>

                <SmallList>
                  <li>Все цены указаны с НДС</li>
                  <li>
                    Автопродление можно отключить в<br /> настройках
                  </li>
                  <li>При смене тарифа производится перерасчёт</li>
                </SmallList>
              </ConditionsCard>
            )}
          </AsideCard>
        </Grid>
      </>

      <AgreementModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          try {
            const idk = Math.random().toString(36).slice(2) + Date.now();
            const res = await axiosInstance.post(
              '/payments/yookassa/create',
              {
                amount: total,
                description: `Оплата тарифа ${plan?.name}`,
                return_url: window.location.origin + '/settings',
                metadata: {
                  organization_id: orgId,
                  user_id: userId,
                  months,
                  plan: plan?.name,
                },
              },
              { headers: { 'Idempotence-Key': idk } },
            );
            const data = res.data;
            setConfirmationToken(data.confirmation_token || '');
            setShowModal(false);
            setPayOpen(true);
          } catch (e) {
            const message = e.response?.data?.detail || e.message || 'Не удалось создать платёж';
            toast.error(message);
          }
        }}
      />

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        confirmationToken={confirmationToken}
      />

      <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onConfirm={handleTopUpConfirm}
      />

      <InvoicePayerModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        organizationId={orgId}
        onSaved={async (payer) => {
          try {
            const receiver = buildReceiverDefaults();
            const numberRes = await axiosInstance.post('/billing/invoice/next-number', {}, { params: { organization_id: orgId } });
            const number = numberRes.data?.number || 1;
            await generateInvoicePdf({
              receiver,
              payer,
              invoice: {
                number,
                date: Date.now(),
                purpose: `Плата за пользование сервисом Loyal Club по тарифу ${plan?.name}`,
                items: [
                  { name: `Плата за пользование сервисом Loyal Club`, qty: months, unit: 'мес', price: monthlyPrice },
                ],
                total: total,
              },
            });
          } catch (e) {
            toast.error('Не удалось создать счёт');
          }
        }}
      />
    </SettingsContainer>
  );
};

export default Settings;
