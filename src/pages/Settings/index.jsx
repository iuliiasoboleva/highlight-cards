import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AgreementModal from '../../components/AgreementModal';
import GeoBadge from '../../components/GeoBadge';
import LoaderCentered from '../../components/LoaderCentered';
import TopUpModal from '../../components/TopUpModal';
import CustomMainButton from '../../customs/CustomMainButton';
import CustomSelect from '../../customs/CustomSelect';
import { pluralize } from '../../helpers/pluralize';
import { fetchBalance, topUpBalance } from '../../store/balanceSlice';
import { fetchPayments } from '../../store/paymentsSlice';
import { fetchSubscription } from '../../store/subscriptionSlice';
import { fetchTariffs } from '../../store/tariffsSlice';
import { planFeatures } from './planFeatures';
import {
  PlanCard,
  PlanCategory,
  PlanCategoryLeft,
  PlanCategoryNumber,
  PlanCategoryTitle,
  PlanCheck,
  PlanFeatureItem,
  PlanFeatureList,
  PlanFeatures,
  PlanMainTitle,
  PlanPrice,
  PlanPriceValue,
  PlanStatus,
  SettingsContainer,
} from './styles';

const Settings = () => {
  const dispatch = useDispatch();
  const { plans: tariffPlans, loading } = useSelector((state) => state.tariffs);

  const { organization_id: orgId, id: userId } = useSelector((state) => state.user);
  const { amount: balance = 0, loading: balanceLoading } = useSelector(
    (state) => state.balance || {},
  );
  const { info: subscription, loading: subLoading } = useSelector((state) => state.subscription);

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

  const [period, setPeriod] = useState({});

  useEffect(() => {
    if (tariffPlans.length) {
      const init = tariffPlans.reduce((acc, plan) => {
        acc[plan.name] = 'Месяц';
        return acc;
      }, {});
      setPeriod(init);
    }
  }, [tariffPlans]);

  const [showModal, setShowModal] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const handleTopUpConfirm = (amount) => {
    setTopUpOpen(false);
    dispatch(topUpBalance({ orgId, amount }));
  };

  const isTrial = subscription?.status === 'trial';
  const remainingDays = subscription?.days_left ?? 0;

  // Подготовка данных для таблицы тарифов
  const tariffColumns = [
    {
      key: 'feature',
      title: 'ФУНКЦИОНАЛ',
      className: 'text-left feature-header',
      cellClassName: 'text-left feature-cell',
    },
    ...tariffPlans.map((plan) => ({
      key: plan.name,
      title: plan.name,
      className: 'text-center',
      cellClassName: 'text-center',
    })),
  ];

  const tariffRows = [
    {
      feature: (
        <>
          <p>Стоимость в месяц</p>
          <small>
            при оплате за год
            <br />/ за месяц
          </small>
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          `${Math.round(plan.prices.year / 12)} ₽ / ${plan.prices.month} ₽`,
        ]),
      ),
    },
    {
      feature: (
        <>
          <p>Интеграции</p>
          Интеграция с ПО для автоматического начисления
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          plan.integrations === '—' ? <span className="tariff-red">−</span> : plan.integrations,
        ]),
      ),
    },
    {
      feature: (
        <>
          <p>Пользовательские поля</p>
          Добавьте собственное наполнение без шаблона
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          plan.customFields ? (
            <span className="tariff-green">+</span>
          ) : (
            <span className="tariff-red">−</span>
          ),
        ]),
      ),
    },
    {
      feature: (
        <>
          <p>Настройка прав менеджеров</p>
          Детальный контроль доступа
        </>
      ),
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          plan.permissions ? (
            <span className="tariff-green">+</span>
          ) : (
            <span className="tariff-red">−</span>
          ),
        ]),
      ),
    },
    {
      feature: <p>Период оплаты</p>,
      ...Object.fromEntries(
        tariffPlans.map((plan) => [
          plan.name,
          <div className="tariff-selector">
            <CustomSelect
              value={period[plan.name] || 'Месяц'}
              onChange={(value) => setPeriod((prev) => ({ ...prev, [plan.name]: value }))}
              options={[
                { value: 'Год', label: 'Год' },
                { value: 'Месяц', label: 'Месяц' },
              ]}
            />
            <button className="custom-main-button">Выбрать тариф</button>
          </div>,
        ]),
      ),
    },
  ];

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
        <PlanCard>
          <PlanMainTitle>Единый тариф — безлимитный функционал</PlanMainTitle>

          {!subLoading && subscription && (
            <PlanStatus>
              {subscription.status === 'expired'
                ? 'Подписка истекла'
                : subscription.status === 'trial'
                  ? `Демо, осталось ${remainingDays} ${pluralize(remainingDays, ['день', 'дня', 'дней'])}`
                  : `Подписка активна, осталось ${remainingDays} ${pluralize(remainingDays, ['день', 'дня', 'дней'])}`}
            </PlanStatus>
          )}

          <PlanFeatures>
            {planFeatures.map((group, idx) => (
              <PlanCategory key={group.category}>
                <PlanCategoryLeft>
                  <PlanCategoryNumber>{`${idx + 1}`.padStart(2, '0')}</PlanCategoryNumber>
                  <PlanCategoryTitle>{group.category}</PlanCategoryTitle>
                </PlanCategoryLeft>

                <PlanFeatureList>
                  {group.items.map((item) => (
                    <PlanFeatureItem key={item}>
                      <PlanCheck>✓</PlanCheck>
                      {item}
                    </PlanFeatureItem>
                  ))}
                </PlanFeatureList>
              </PlanCategory>
            ))}
          </PlanFeatures>

          <PlanPrice>
            <PlanPriceValue>6 900 ₽ / месяц</PlanPriceValue>

            {subscription?.status !== 'active' ? (
              <CustomMainButton $maxWidth={220} $mt={8} onClick={() => setShowModal(true)}>
                Активировать
              </CustomMainButton>
            ) : (
              <CustomMainButton $maxWidth={200} $mt={8} disabled>
                Тариф активен
              </CustomMainButton>
            )}
          </PlanPrice>
        </PlanCard>
      </>

      {showModal && (
        <AgreementModal
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            alert('Переход к оплате');
          }}
        />
      )}

      <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onConfirm={handleTopUpConfirm}
      />
    </SettingsContainer>
  );
};

export default Settings;
